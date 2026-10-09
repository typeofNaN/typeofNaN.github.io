'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import maplibregl, { type GeoJSONSource, type MapMouseEvent } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { CalendarDays, ChevronRight, Images, MapPin, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

import { OssHost } from '@/src/constants'
import UiModal from '@/src/components/ui-modal'
import { applyMapTheme, mapStyle } from '@/src/config/mapStyle'
import { MapPointApi } from '@/src/service'

const DEFAULT_CENTER: [number, number] = [113.2644, 23.1291]
const DEFAULT_ZOOM = 10
const VIDEO_PATTERN = /\.(mp4|mov|webm|m4v)(\?.*)?$/i
const MAP_GLASS_CLASS =
  'border border-white/75! bg-[rgba(252,253,251,0.9)]! shadow-[0_18px_48px_rgba(35,59,51,0.16)]! backdrop-blur-[18px] dark:border-white/10! dark:bg-[rgba(19,27,26,0.9)]! dark:text-[#e8efec]'

const resolveMediaUrl = (url: string) => {
  if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
    return url
  }
  return `${OssHost || ''}${url}`
}

const resolveTimelineThumbnailUrl = (url: string) => {
  if (!VIDEO_PATTERN.test(url)) return resolveMediaUrl(url)
  const separator = url.includes('?') ? '&' : '?'
  return resolveMediaUrl(`${url}${separator}x-oss-process=video/snapshot,t_1,ar_auto`)
}

const MapPage = () => {
  const container = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const [selected, setSelected] = useState<Api.MapPointApi.Detail>()
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)
  const [mapPointList, setMapPointList] = useState<Api.MapPointApi.Detail[]>([])
  const [requestError, setRequestError] = useState(false)
  const [timelineOpen, setTimelineOpen] = useState(false)
  const [activePointId, setActivePointId] = useState<number>()
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

  const footprintStats = useMemo(() => {
    const namedPoints = mapPointList.filter((point) => point.title?.trim())
    const years = new Set(namedPoints.map((point) => point.occurredTime.slice(0, 4)).filter(Boolean))
    return { places: namedPoints.length, years: years.size }
  }, [mapPointList])

  useEffect(() => {
    if (!container.current) return
    let cancelled = false
    const mediaMarkers = new Map<number, maplibregl.Marker>()
    const map = new maplibregl.Map({
      container: container.current,
      style: mapStyle,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
      maplibreLogo: false,
    })
    mapRef.current = map
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
    map.addControl(new maplibregl.AttributionControl({ compact: true }))
    map.on('load', async () => {
      applyMapTheme(map)
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
          'circle-color': 'rgba(39, 118, 111, .18)',
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
          'circle-color': ['step', ['get', 'point_count'], '#79b9af', 10, '#3b8f84', 50, '#27766f'],
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
          'circle-color': '#27766f',
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
            setActivePointId(id)
            setSelectedMediaIndex(0)
            setSelected(points.find((item) => item.mapPointId === id))
          })

          mediaMarkers.set(
            id,
            new maplibregl.Marker({ element: markerElement, anchor: 'bottom' })
              .setLngLat(coordinates)
              .addTo(map),
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
        setActivePointId(id)
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
    setActivePointId(point.mapPointId)
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
    <div className="map-page fixed top-[60px] right-0 bottom-[60px] left-0 bg-[#dfe8e5]">
      <div className="relative h-full w-full">
        <div ref={container} className="absolute! inset-0" />
        <div className="pointer-events-none absolute top-5 left-[348px] z-1 flex items-center gap-5 max-md:top-3 max-md:left-3">
          <div className={`${MAP_GLASS_CLASS} rounded-2xl px-5 py-3.5 max-md:px-4 max-md:py-3`}>
            <h1 className="font-serif text-[26px] leading-none font-semibold tracking-[-0.03em] text-[#183a33] dark:text-[#e4f0ec] max-md:text-xl">
              时光足迹
            </h1>
            <p className="mt-1.5 text-xs text-[#68766f] dark:text-[#9eaca7] max-md:hidden">
              用地图，串起生活的坐标
            </p>
          </div>
          <div className={`${MAP_GLASS_CLASS} flex rounded-2xl px-4 py-3 max-md:hidden`}>
            <div className="flex items-center gap-2 pr-4">
              <MapPin className="h-4 w-4 text-[#d9685e]" strokeWidth={2} />
              <div>
                <strong className="block text-lg leading-none text-[#183a33] dark:text-[#e4f0ec]">
                  {footprintStats.places}
                </strong>
                <span className="text-[10px] tracking-[0.08em] text-[#7a8782]">个地点</span>
              </div>
            </div>
            <div className="flex items-center gap-2 border-l border-[#dfe5e1] pl-4 dark:border-white/10">
              <CalendarDays className="h-4 w-4 text-[#397a6c]" strokeWidth={2} />
              <div>
                <strong className="block text-lg leading-none text-[#183a33] dark:text-[#e4f0ec]">
                  {footprintStats.years}
                </strong>
                <span className="text-[10px] tracking-[0.08em] text-[#7a8782]">年记录</span>
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          className={`absolute inset-0 z-2 hidden border-0 bg-slate-900/10 p-0 transition-opacity max-md:block ${timelineOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
          aria-label="收起足迹时间线"
          onClick={() => setTimelineOpen(false)}
        />
        <button
          type="button"
          className={`absolute bottom-4 left-4 z-3 hidden h-[48px] w-[48px] cursor-pointer place-items-center rounded-full border border-white/70 bg-[#174d43] p-0 text-white shadow-[0_10px_30px_rgba(40,66,75,0.32)] transition hover:bg-[#d9685e] max-md:grid dark:border-white/20 ${timelineOpen ? 'pointer-events-none scale-75 opacity-0' : 'opacity-100'}`}
          aria-label="展开足迹时间线"
          aria-expanded={timelineOpen}
          onClick={() => setTimelineOpen(true)}
        >
          <PanelLeftOpen className="h-[22px] w-[22px]" aria-hidden="true" />
        </button>
        <aside
          className={`${MAP_GLASS_CLASS} absolute top-4 bottom-4 left-4 z-2 flex w-[312px] flex-col overflow-hidden rounded-[20px] max-md:top-3 max-md:right-3 max-md:bottom-3 max-md:left-3 max-md:z-4 max-md:w-auto max-md:max-w-[350px] max-md:origin-bottom-left max-md:transition-[opacity,transform] ${timelineOpen ? 'max-md:pointer-events-auto max-md:translate-x-0 max-md:scale-100 max-md:opacity-100' : 'max-md:pointer-events-none max-md:translate-x-[calc(-100%_-_24px)] max-md:scale-[0.96] max-md:opacity-0'}`}
          aria-label="足迹时间线"
        >
          <div className="border-b border-[rgba(112,129,136,0.16)] px-5 pt-[18px] pb-4">
            <div className="flex items-baseline justify-between">
              <strong className="font-serif text-[23px] tracking-[-0.02em] text-[#183a33] dark:text-[#e4f0ec]">
                足迹档案
              </strong>
              <button
                type="button"
                onClick={() => setTimelineOpen(false)}
                aria-label="收起足迹时间线"
                className="hidden h-8 w-8 cursor-pointer place-items-center rounded-full border-0 bg-[#edf2ef] text-[#49615a] max-md:grid dark:bg-white/10 dark:text-white/70"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-xs text-[#7a8782]">沿着日期，重访走过的地方</p>
          </div>
          <div className="map-timeline-scroll min-h-0 flex-1 overflow-y-auto px-[14px] pt-[14px] pb-[18px]">
            {timeline.length ? (
              timeline.map(({ year, months }) => (
                <section
                  className="relative pl-[18px] before:absolute before:top-[9px] before:bottom-0.5 before:left-1 before:w-px before:bg-[rgba(54,116,102,0.22)] [&+&]:mt-[22px]"
                  key={year}
                >
                  <h2 className="relative mb-[10px] flex items-center justify-between pr-2 text-lg leading-6 text-[#173b34] before:absolute before:top-[7px] before:left-[-18px] before:h-[9px] before:w-[9px] before:rounded-full before:border-2 before:border-white/95 before:bg-[#397a6c] before:shadow-[0_2px_6px_rgba(39,118,111,0.3)] dark:text-[#dceae6]">
                    <span>{year}</span>
                    <span className="font-sans text-[10px] font-medium tracking-[.06em] text-[#8a9792]">
                      {months.reduce((count, item) => count + item.points.length, 0)} 个地点
                    </span>
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
                            className={`group relative flex w-full cursor-pointer items-center gap-2.5 rounded-xl border-0 px-2 py-2 text-left font-[inherit] transition ${activePointId === point.mapPointId ? 'bg-[#f8e7e3] text-[#8f3f38] shadow-[inset_3px_0_0_#d9685e] dark:bg-[#4a2927] dark:text-[#ffc4bc]' : 'bg-transparent hover:bg-[rgba(39,118,111,0.08)] hover:text-[#1f625d] dark:hover:bg-[rgba(121,185,175,0.13)] dark:hover:text-[#b8e0d9]'}`}
                            onClick={() => focusMapPoint(point)}
                          >
                            <span className="w-7 shrink-0 text-[11px] opacity-55">
                              {point.occurredTime.slice(8, 10)}日
                            </span>
                            {point.mediaUrl?.split('|').filter(Boolean)[0] ? (
                              <img
                                src={resolveTimelineThumbnailUrl(
                                  point.mediaUrl.split('|').filter(Boolean)[0],
                                )}
                                alt=""
                                className="h-11 w-11 shrink-0 rounded-lg border-2 border-white object-cover shadow-sm dark:border-white/20"
                              />
                            ) : (
                              <span className="h-10 w-10 shrink-0 rounded-md bg-[var(--site-accent-soft)]" />
                            )}
                            <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">
                              {point.title}
                            </span>
                            <ChevronRight className="h-4 w-4 opacity-30 transition group-hover:translate-x-0.5 group-hover:opacity-80" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>
              ))
            ) : (
              <div className="grid place-items-center px-2 py-10 text-center text-[13px] text-[#7a8782]">
                <Images className="mb-2 h-6 w-6 opacity-50" strokeWidth={1.5} />
                暂无带标题的足迹
              </div>
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
