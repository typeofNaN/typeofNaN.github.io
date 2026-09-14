'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import maplibregl, { type GeoJSONSource, type MapMouseEvent } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

import { OssHost } from '@/src/constants'
import UiModal from '@/src/components/ui-modal'
import { applyAppleMapTheme, mapStyleUrl } from '@/src/config/mapStyle'
import { MapPointApi } from '@/src/service'

const DEFAULT_CENTER: [number, number] = [113.2644, 23.1291]
const DEFAULT_ZOOM = 10
const VIDEO_PATTERN = /\.(mp4|mov|webm|m4v)(\?.*)?$/i
const MAP_GLASS_CLASS =
  'border border-white/70! bg-[rgba(248,251,251,0.8)]! shadow-[0_10px_30px_rgba(40,66,75,0.17)]! backdrop-blur-[14px] dark:bg-[rgba(24,34,39,0.8)]! dark:text-[#e8eff1]'

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
  const [mediaViewportRef, mediaEmblaApi] = useEmblaCarousel({ loop: true })

  const syncSelectedMediaIndex = useCallback(() => {
    if (mediaEmblaApi) setSelectedMediaIndex(mediaEmblaApi.selectedScrollSnap())
  }, [mediaEmblaApi])

  useEffect(() => {
    if (!mediaEmblaApi) return
    mediaEmblaApi.on('select', syncSelectedMediaIndex)
    return () => {
      mediaEmblaApi.off('select', syncSelectedMediaIndex)
    }
  }, [mediaEmblaApi, syncSelectedMediaIndex])

  useEffect(() => {
    if (!mediaEmblaApi || !selected) return
    mediaEmblaApi.scrollTo(0, true)
  }, [mediaEmblaApi, selected])

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
  const renderMedia = (mediaUrl: string) => (
    <div
      className="relative h-full max-h-full min-h-0 w-full max-w-full min-w-0 overflow-hidden rounded-xl bg-black"
      key={mediaUrl}
    >
      {VIDEO_PATTERN.test(mediaUrl) ? (
        <video
          src={resolveMediaUrl(mediaUrl)}
          controls
          className="absolute inset-0 block h-full max-h-full w-full max-w-full object-contain object-center"
        />
      ) : (
        <img
          src={resolveMediaUrl(mediaUrl)}
          alt={selected?.title || ''}
          className="absolute inset-0 block h-full max-h-full w-full max-w-full object-contain object-center"
        />
      )}
    </div>
  )

  return (
    <div className="map-page fixed top-[60px] right-0 bottom-[60px] left-0">
      <div className="relative h-full w-full">
        <div ref={container} className="absolute! inset-0" />
        <button
          type="button"
          className={`absolute inset-0 z-2 hidden border-0 bg-slate-900/10 p-0 transition-opacity max-md:block ${timelineOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
          aria-label="收起足迹时间线"
          onClick={() => setTimelineOpen(false)}
        />
        <button
          type="button"
          className={`${MAP_GLASS_CLASS} absolute bottom-4 left-4 z-3 hidden h-[52px] w-[52px] cursor-pointer place-items-center rounded-full bg-[#1677ff]! p-0 text-white transition max-md:grid ${timelineOpen ? 'pointer-events-none scale-75 opacity-0' : 'opacity-100'}`}
          aria-label="展开足迹时间线"
          aria-expanded={timelineOpen}
          onClick={() => setTimelineOpen(true)}
        >
          <svg
            className="h-[25px] w-[25px] fill-white stroke-white [stroke-linecap:round] [stroke-width:1.8]"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M6 5h12M6 12h12M6 19h12" />
            <circle cx="6" cy="5" r="1.7" />
            <circle cx="6" cy="12" r="1.7" />
            <circle cx="6" cy="19" r="1.7" />
          </svg>
        </button>
        <aside
          className={`${MAP_GLASS_CLASS} absolute top-5 bottom-5 left-5 z-1 flex w-[280px] flex-col overflow-hidden rounded-2xl max-md:top-3 max-md:right-3 max-md:bottom-3 max-md:left-3 max-md:z-4 max-md:w-auto max-md:max-w-[340px] max-md:origin-bottom-left max-md:transition-[opacity,transform] ${timelineOpen ? 'max-md:pointer-events-auto max-md:translate-x-0 max-md:scale-100 max-md:opacity-100' : 'max-md:pointer-events-none max-md:translate-x-[calc(-100%_-_24px)] max-md:scale-[0.96] max-md:opacity-0'}`}
          aria-label="足迹时间线"
        >
          <div className="flex items-baseline justify-between border-b border-[rgba(112,129,136,0.18)] px-[18px] pt-4 pb-3">
            <strong className="text-[17px]">时光足迹</strong>
            <span className="text-xs opacity-55">
              {mapPointList.filter((point) => point.title?.trim()).length} 个地点
            </span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-[14px] pt-[10px] pb-[18px]">
            {timeline.length ? (
              timeline.map(({ year, months }) => (
                <section
                  className="relative pl-[18px] before:absolute before:top-[9px] before:bottom-0.5 before:left-1 before:w-px before:bg-[rgba(22,119,255,0.25)] [&+&]:mt-[18px]"
                  key={year}
                >
                  <h2 className="relative mb-[10px] text-lg leading-6 before:absolute before:top-[7px] before:left-[-18px] before:h-[9px] before:w-[9px] before:rounded-full before:border-2 before:border-white/95 before:bg-[#1677ff] before:shadow-[0_2px_6px_rgba(22,119,255,0.35)]">
                    {year}
                  </h2>
                  {months.map(({ month, points }) => (
                    <div className="[&+&]:mt-[14px]" key={`${year}-${month}`}>
                      <h3 className="mb-[6px] text-xs font-semibold text-[#67747a] dark:text-[#aab6bb]">
                        {Number(month)}月
                      </h3>
                      <div className="grid gap-1">
                        {points.map((point) => (
                          <button
                            type="button"
                            key={point.mapPointId}
                            title={point.title}
                            className="w-full cursor-pointer overflow-hidden rounded-lg border-0 bg-transparent px-[9px] py-[7px] text-left font-[inherit] leading-5 text-ellipsis whitespace-nowrap hover:bg-[rgba(22,119,255,0.1)] hover:text-[#0958d9]"
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
              <div className="px-2 py-9 text-center text-[13px] opacity-55">暂无带标题的足迹</div>
            )}
          </div>
        </aside>
        {requestError && (
          <div
            className={`${MAP_GLASS_CLASS} absolute bottom-5 left-[320px] z-1 rounded-xl px-[14px] py-[10px] text-[13px] text-red-500 max-md:right-3 max-md:left-3`}
          >
            点位数据加载失败，地图仍可正常浏览
          </div>
        )}
      </div>
      <UiModal
        open={Boolean(selected)}
        title={selected?.title || '影像足迹'}
        onClose={() => {
          setSelected(undefined)
          setSelectedMediaIndex(0)
        }}
        size="cover"
      >
        <div className="grid h-[min(80vh,calc(100dvh-32px))] grid-rows-[minmax(0,1fr)_auto] overflow-hidden">
          {selectedMediaList.length > 1 ? (
            <div className="relative h-full max-h-full min-w-0 overflow-hidden rounded-xl">
              <div className="h-full w-full overflow-hidden" ref={mediaViewportRef}>
                <div className="flex h-full w-full [touch-action:pan-y_pinch-zoom]">
                  {selectedMediaList.map((mediaUrl) => (
                    <div className="h-full min-w-0 flex-[0_0_100%]" key={mediaUrl}>
                      {renderMedia(mediaUrl)}
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="absolute top-1/2 left-4 z-1 grid h-[42px] w-[42px] -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0 bg-black/50 pb-1 text-[34px] leading-none text-white transition hover:scale-105 hover:bg-[#1677ff]/90"
                aria-label="上一张"
                onClick={() => mediaEmblaApi?.scrollPrev()}
              >
                ‹
              </button>
              <button
                type="button"
                className="absolute top-1/2 right-4 z-1 grid h-[42px] w-[42px] -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0 bg-black/50 pb-1 text-[34px] leading-none text-white transition hover:scale-105 hover:bg-[#1677ff]/90"
                aria-label="下一张"
                onClick={() => mediaEmblaApi?.scrollNext()}
              >
                ›
              </button>
              <div className="absolute bottom-[14px] left-1/2 z-1 -translate-x-1/2 rounded-xl bg-black/50 px-[10px] py-1 text-xs leading-[18px] text-white backdrop-blur-[6px]">
                {selectedMediaIndex + 1} / {selectedMediaList.length}
              </div>
            </div>
          ) : selectedMediaList.length === 1 ? (
            renderMedia(selectedMediaList[0])
          ) : (
            <div className="grid min-h-[240px] place-items-center text-[var(--site-muted)]">
              暂无影像
            </div>
          )}
          <time className="mt-3 block flex-none leading-5 opacity-60">
            {selected?.occurredTime}
          </time>
        </div>
      </UiModal>
    </div>
  )
}

export default MapPage
