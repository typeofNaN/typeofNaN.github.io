'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Empty, Modal } from 'antd'
import maplibregl, { type GeoJSONSource, type MapMouseEvent } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

import { OssHost } from '@/src/constants'
import { applyAppleMapTheme, mapStyleUrl } from '@/src/config/mapStyle'
import { MapPointApi } from '@/src/service'

const DEFAULT_CENTER: [number, number] = [113.2644, 23.1291]
const DEFAULT_ZOOM = 10
const VIDEO_PATTERN = /\.(mp4|mov|webm|m4v)(\?.*)?$/i

const resolveMediaUrl = (url: string) => {
  if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
    return url
  }
  return `${OssHost || ''}${url}`
}

const MapPage = () => {
  const container = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const [selected, setSelected] = useState<Api.MapPointApi.Detail>()
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)
  const [mapPointList, setMapPointList] = useState<Api.MapPointApi.Detail[]>([])
  const [requestError, setRequestError] = useState(false)
  const [timelineOpen, setTimelineOpen] = useState(false)

  const timeline = useMemo(() => {
    const yearMap = new Map<string, Map<string, Api.MapPointApi.Detail[]>>()

    mapPointList.forEach((point) => {
      if (!point.title?.trim()) return
      const [year, month = '01'] = point.occurredTime.split('-')
      if (!year) return
      if (!yearMap.has(year)) yearMap.set(year, new Map())
      const monthMap = yearMap.get(year)!
      if (!monthMap.has(month)) monthMap.set(month, [])
      monthMap.get(month)!.push(point)
    })

    return [...yearMap.entries()]
      .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
      .map(([year, monthMap]) => ({
        year,
        months: [...monthMap.entries()]
          .sort(([monthA], [monthB]) => Number(monthB) - Number(monthA))
          .map(([month, points]) => ({
            month,
            points: points.sort((a, b) => b.occurredTime.localeCompare(a.occurredTime)),
          })),
      }))
  }, [mapPointList])

  useEffect(() => {
    if (!container.current) return
    let cancelled = false
    const mediaMarkers = new Map<number, maplibregl.Marker>()
    const map = new maplibregl.Map({
      container: container.current,
      style: mapStyleUrl,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
      maplibreLogo: false,
    })
    mapRef.current = map
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
    map.addControl(new maplibregl.AttributionControl({ compact: true }))
    map.on('load', async () => {
      applyAppleMapTheme(map)
      const { data, error } = await MapPointApi.getList()
      if (cancelled) return
      if (error) {
        setRequestError(true)
      }
      const points = data || []
      setMapPointList(points)
      map.addSource('map-points', {
        type: 'geojson',
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 58,
        data: {
          type: 'FeatureCollection',
          features: points.map((point) => ({
            type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [point.longitude, point.latitude],
              },
            properties: {
              id: point.mapPointId,
              cover: point.mediaUrl?.split('|').filter(Boolean)[0] || '',
            },
          })),
        },
      })
      map.addLayer({
        id: 'cluster-halo',
        type: 'circle',
        source: 'map-points',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': 'rgba(22, 119, 255, .18)',
          'circle-radius': ['step', ['get', 'point_count'], 29, 10, 37, 50, 45],
          'circle-blur': 0.35,
        },
      })
      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'map-points',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': ['step', ['get', 'point_count'], '#69b1ff', 10, '#4096ff', 50, '#1677ff'],
          'circle-radius': ['step', ['get', 'point_count'], 21, 10, 28, 50, 35],
          'circle-stroke-width': 3,
          'circle-stroke-color': 'rgba(255,255,255,.92)',
        },
      })
      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'map-points',
        filter: ['has', 'point_count'],
        layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-size': 14 },
        paint: { 'text-color': '#ffffff' },
      })
      map.addLayer({
        id: 'points',
        type: 'circle',
        source: 'map-points',
        filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'cover'], '']],
        paint: {
          'circle-color': '#1677ff',
          'circle-radius': 9,
          'circle-stroke-width': 4,
          'circle-stroke-color': 'rgba(255,255,255,.94)',
        },
      })
      const syncMediaMarkers = () => {
        if (cancelled || !map.isSourceLoaded('map-points')) return

        const visibleIds = new Set<number>()
        const bounds = map.getBounds()
        const features = map.querySourceFeatures('map-points', {
          filter: ['all', ['!', ['has', 'point_count']], ['!=', ['get', 'cover'], '']],
        })

        features.forEach((feature) => {
          if (feature.geometry.type !== 'Point') return
          const coordinates = feature.geometry.coordinates as [number, number]
          if (!bounds.contains(coordinates)) return

          const id = Number(feature.properties?.id)
          const cover = String(feature.properties?.cover || '')
          if (!id || !cover || visibleIds.has(id)) return
          visibleIds.add(id)

          if (mediaMarkers.has(id)) return

          const markerElement = document.createElement('button')
          markerElement.type = 'button'
          markerElement.className = 'map-photo-marker'
          markerElement.title = points.find((item) => item.mapPointId === id)?.title || '查看媒体'

          const mediaElement = document.createElement(VIDEO_PATTERN.test(cover) ? 'video' : 'img')
          mediaElement.className = 'map-photo-marker-media'
          mediaElement.src = resolveMediaUrl(cover)
          if (mediaElement instanceof HTMLVideoElement) {
            mediaElement.muted = true
            mediaElement.playsInline = true
            mediaElement.preload = 'metadata'
          } else {
            mediaElement.alt = markerElement.title
          }
          mediaElement.addEventListener('error', () => {
            markerElement.classList.add('is-error')
            mediaElement.remove()
          })
          markerElement.appendChild(mediaElement)
          markerElement.addEventListener('click', (event) => {
            event.stopPropagation()
            setSelectedMediaIndex(0)
            setSelected(points.find((item) => item.mapPointId === id))
          })

          mediaMarkers.set(
            id,
            new maplibregl.Marker({ element: markerElement }).setLngLat(coordinates).addTo(map),
          )
        })

        mediaMarkers.forEach((marker, id) => {
          if (!visibleIds.has(id)) {
            marker.remove()
            mediaMarkers.delete(id)
          }
        })
      }

      map.on('render', syncMediaMarkers)
      syncMediaMarkers()
      map.triggerRepaint()
      map.on('click', 'clusters', async (e: MapMouseEvent) => {
        const feature = map.queryRenderedFeatures(e.point, { layers: ['clusters'] })[0]
        const id = Number(feature.properties?.cluster_id)
        const zoom = await (map.getSource('map-points') as GeoJSONSource).getClusterExpansionZoom(
          id,
        )
        const coordinates = (feature.geometry as { coordinates: [number, number] }).coordinates
        map.easeTo({ center: coordinates, zoom })
      })
      map.on('click', 'points', (e) => {
        const id = Number(e.features?.[0]?.properties?.id)
        setSelectedMediaIndex(0)
        setSelected(points.find((item) => item.mapPointId === id))
      })
      ;['clusters', 'points'].forEach((layer) => {
        map.on('mouseenter', layer, () => {
          map.getCanvas().style.cursor = 'pointer'
        })
        map.on('mouseleave', layer, () => {
          map.getCanvas().style.cursor = ''
        })
      })
    })
    return () => {
      cancelled = true
      mediaMarkers.forEach((marker) => marker.remove())
      mediaMarkers.clear()
      map.remove()
      mapRef.current = null
    }
  }, [])

  const focusMapPoint = (point: Api.MapPointApi.Detail) => {
    setTimelineOpen(false)
    const map = mapRef.current
    if (!map) return
    map.flyTo({
      center: [Number(point.longitude), Number(point.latitude)],
      zoom: Math.max(map.getZoom(), 13),
      duration: 1200,
      essential: true,
    })
  }

  const selectedMediaList = selected?.mediaUrl?.split('|').filter(Boolean) || []
  const switchMedia = (offset: number) => {
    setSelectedMediaIndex((current) => (
      (current + offset + selectedMediaList.length) % selectedMediaList.length
    ))
  }
  const renderMedia = (mediaUrl: string) => (
    <div className="map-media-stage" key={mediaUrl}>
      {VIDEO_PATTERN.test(mediaUrl) ? (
        <video
          src={resolveMediaUrl(mediaUrl)}
          controls
          className="map-media-content"
        />
      ) : (
        <img
          src={resolveMediaUrl(mediaUrl)}
          alt={selected?.title || ''}
          className="map-media-content"
        />
      )}
    </div>
  )

  return (
    <div className="map-page">
      <div className="map-shell">
        <div ref={container} className="map-container" />
        <button
          type="button"
          className={`map-timeline-backdrop${timelineOpen ? ' is-open' : ''}`}
          aria-label="收起足迹时间线"
          onClick={() => setTimelineOpen(false)}
        />
        <button
          type="button"
          className={`map-glass map-timeline-trigger${timelineOpen ? ' is-hidden' : ''}`}
          aria-label="展开足迹时间线"
          aria-expanded={timelineOpen}
          onClick={() => setTimelineOpen(true)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 5h12M6 12h12M6 19h12" />
            <circle cx="6" cy="5" r="1.7" />
            <circle cx="6" cy="12" r="1.7" />
            <circle cx="6" cy="19" r="1.7" />
          </svg>
        </button>
        <aside
          className={`map-glass map-timeline-panel${timelineOpen ? ' is-open' : ''}`}
          aria-label="足迹时间线"
        >
          <div className="map-timeline-header">
            <strong>时光足迹</strong>
            <span>{mapPointList.filter((point) => point.title?.trim()).length} 个地点</span>
          </div>
          <div className="map-timeline-content">
            {timeline.length ? (
              timeline.map(({ year, months }) => (
                <section className="map-timeline-year" key={year}>
                  <h2>{year}</h2>
                  {months.map(({ month, points }) => (
                    <div className="map-timeline-month" key={`${year}-${month}`}>
                      <h3>{Number(month)}月</h3>
                      <div className="map-timeline-items">
                        {points.map((point) => (
                          <button
                            type="button"
                            key={point.mapPointId}
                            title={point.title}
                            onClick={() => focusMapPoint(point)}
                          >
                            {point.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>
              ))
            ) : (
              <div className="map-timeline-empty">暂无带标题的足迹</div>
            )}
          </div>
        </aside>
        {requestError && (
          <div className="map-glass map-error-panel rounded-12px px-14px py-10px text-13px text-red-5">
            点位数据加载失败，地图仍可正常浏览
          </div>
        )}
      </div>
      <Modal
        className="map-media-modal"
        open={Boolean(selected)}
        centered
        title={selected?.title || '影像足迹'}
        footer={null}
        onCancel={() => {
          setSelected(undefined)
          setSelectedMediaIndex(0)
        }}
        width="80vw"
      >
        {selectedMediaList.length > 1 ? (
          <div className="map-media-carousel">
            {renderMedia(selectedMediaList[selectedMediaIndex])}
            <button
              type="button"
              className="map-media-arrow is-prev"
              aria-label="上一张"
              onClick={() => switchMedia(-1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="map-media-arrow is-next"
              aria-label="下一张"
              onClick={() => switchMedia(1)}
            >
              ›
            </button>
            <div className="map-media-pagination">
              {selectedMediaIndex + 1} / {selectedMediaList.length}
            </div>
          </div>
        ) : selectedMediaList.length === 1 ? (
          renderMedia(selectedMediaList[0])
        ) : (
          <Empty />
        )}
        <time className="map-media-time">{selected?.occurredTime}</time>
      </Modal>
    </div>
  )
}

export default MapPage
