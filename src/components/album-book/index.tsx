'use client'

import { ChevronLeft, ChevronRight, Images, Play } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { OssHost } from '@/src/constants'

interface AlbumBookProps {
  albumName: string
  mediaList: Api.MediaApi.Detail.ResponseVo[]
  activeMediaIndex: number
  onPreview: (index: number) => void
  onPageChange: (index: number) => void
}

interface PageFlipInstance {
  flipNext: (corner?: 'top' | 'bottom') => void
  flipPrev: (corner?: 'top' | 'bottom') => void
  turnToPage: (page: number) => void
  destroy: () => void
}

const resizeOssImage = (url: string) => {
  if (url.includes('x-oss-process=')) return `${url}/resize,w_1100/quality,q_82`
  return `${url}${url.includes('?') ? '&' : '?'}x-oss-process=image/resize,w_1100/quality,q_82`
}

const getPreviewSource = (media: Api.MediaApi.Detail.ResponseVo) => {
  const source =
    OssHost +
    (media.mediaType === 'video'
      ? media.posterUrl || `${media.mediaUrl}?x-oss-process=video/snapshot,t_1,ar_auto`
      : media.mediaUrl)
  return resizeOssImage(source)
}

const AlbumBook = ({
  albumName,
  mediaList,
  activeMediaIndex,
  onPreview,
  onPageChange,
}: AlbumBookProps) => {
  const bookRef = useRef<HTMLDivElement>(null)
  const pageFlipRef = useRef<PageFlipInstance | null>(null)
  const cleanupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const flipUnlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFlippingRef = useRef(false)
  const pendingPageIndexRef = useRef<number | null>(null)
  const activeMediaIndexRef = useRef(activeMediaIndex)
  activeMediaIndexRef.current = activeMediaIndex
  const [pageIndex, setPageIndex] = useState(activeMediaIndex)
  const pages = useMemo(
    () => (mediaList.length % 2 === 0 ? mediaList : [...mediaList, null]),
    [mediaList],
  )
  const totalSpreads = Math.max(1, Math.ceil(mediaList.length / 2))
  const currentSpread = Math.min(totalSpreads - 1, Math.floor(pageIndex / 2))

  useEffect(() => {
    if (cleanupTimerRef.current) {
      clearTimeout(cleanupTimerRef.current)
      cleanupTimerRef.current = null
    }
    if (pageFlipRef.current || !bookRef.current || !mediaList.length) return

    let cancelled = false
    const container = bookRef.current

    const decodeImages = Promise.allSettled(
      Array.from(container.querySelectorAll('img')).map(async (image) => {
        if (!image.complete) {
          await new Promise<void>((resolve) => {
            image.addEventListener('load', () => resolve(), { once: true })
            image.addEventListener('error', () => resolve(), { once: true })
          })
        }
        if (image.complete && image.naturalWidth > 0) await image.decode()
      }),
    )

    void Promise.all([import('page-flip'), decodeImages]).then(([{ PageFlip }]) => {
      if (cancelled || pageFlipRef.current) return
      const flipBook = new PageFlip(container, {
        width: 520,
        height: 670,
        size: 'stretch',
        minWidth: 280,
        maxWidth: 560,
        minHeight: 360,
        maxHeight: 720,
        drawShadow: true,
        flippingTime: 680,
        usePortrait: true,
        autoSize: true,
        maxShadowOpacity: 0.32,
        showCover: false,
        startPage: activeMediaIndexRef.current,
        mobileScrollSupport: true,
        swipeDistance: 24,
        clickEventForward: true,
        useMouseEvents: true,
        showPageCorners: true,
        disableFlipByClick: true,
      })

      flipBook.loadFromHTML(container.querySelectorAll<HTMLElement>('[data-album-page]'))
      flipBook.on('flip', ({ data }) => {
        pendingPageIndexRef.current = data
      })
      flipBook.on('changeState', ({ data }) => {
        isFlippingRef.current = data !== 'read'
        if (data === 'read' && pendingPageIndexRef.current !== null) {
          if (flipUnlockTimerRef.current) clearTimeout(flipUnlockTimerRef.current)
          const nextPageIndex = pendingPageIndexRef.current
          pendingPageIndexRef.current = null
          setPageIndex(nextPageIndex)
          onPageChange(nextPageIndex)
        }
      })
      pageFlipRef.current = flipBook
      requestAnimationFrame(() => {
        container.classList.remove('opacity-0')
        container.classList.add('opacity-100')
      })
    })

    return () => {
      cancelled = true
      if (flipUnlockTimerRef.current) clearTimeout(flipUnlockTimerRef.current)
      cleanupTimerRef.current = setTimeout(() => {
        try {
          pageFlipRef.current?.destroy()
        } finally {
          pageFlipRef.current = null
        }
      }, 0)
    }
  }, [mediaList.length, onPageChange])

  useEffect(() => {
    const targetPage = Math.max(0, Math.min(activeMediaIndex, mediaList.length - 1))
    setPageIndex(targetPage)
    pageFlipRef.current?.turnToPage(targetPage)
  }, [activeMediaIndex, mediaList.length])

  if (!mediaList.length) {
    return (
      <div className="grid min-h-80 place-items-center content-center gap-3 text-[var(--site-muted)]">
        <Images className="h-9 w-9 opacity-45" aria-hidden="true" />
        <p>这本相册暂时还是空的</p>
      </div>
    )
  }

  const arrowClassName =
    'grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-white/55 bg-white/90 p-0 text-slate-700 shadow-md transition hover:scale-105 hover:bg-white disabled:cursor-default disabled:opacity-30 disabled:hover:scale-100 max-sm:size-9'

  const flipPrevious = () => {
    if (isFlippingRef.current || !pageFlipRef.current) return
    isFlippingRef.current = true
    flipUnlockTimerRef.current = setTimeout(() => {
      isFlippingRef.current = false
    }, 1200)
    pageFlipRef.current.flipPrev('bottom')
  }

  const flipNext = () => {
    if (isFlippingRef.current || !pageFlipRef.current) return
    isFlippingRef.current = true
    flipUnlockTimerRef.current = setTimeout(() => {
      isFlippingRef.current = false
    }, 1200)
    pageFlipRef.current.flipNext('bottom')
  }

  return (
    <section className="w-full" aria-label={`${albumName} 翻页相册`}>
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-center gap-3 max-sm:gap-1">
        <button
          type="button"
          className={arrowClassName}
          aria-label="上一页"
          disabled={currentSpread === 0}
          onClick={flipPrevious}
        >
          <ChevronLeft aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1 overflow-visible py-3">
          <div
            ref={bookRef}
            className="relative mx-auto h-[min(68vh,720px)] opacity-0 transition-opacity duration-200"
          >
            {pages.map((media, index) => (
              <article
                key={media?.mediaId ?? `blank-${index}`}
                data-album-page
                className="relative overflow-hidden border border-[#d8ccb6] bg-[#f4eddf] p-[7%] text-[#655640] select-none [backface-visibility:hidden] [contain:layout_paint_style] [will-change:transform]"
              >
                {media ? (
                  <div className="flex h-full flex-col">
                    <span className="absolute top-[4.5%] left-1/2 h-5 w-20 -translate-x-1/2 -rotate-2 bg-[#d8c8a4]/60 shadow-sm" />
                    <button
                      type="button"
                      className="group relative mt-[8%] aspect-[4/3] w-full cursor-zoom-in overflow-hidden border-[9px] border-[#fffdf8] bg-[#24241f] p-0 shadow-[0_10px_22px_rgba(55,38,23,.22)]"
                      onClick={() => onPreview(index)}
                    >
                      <img
                        src={getPreviewSource(media)}
                        alt={`${albumName} ${index + 1}`}
                        draggable={false}
                        decoding="async"
                        className="h-full w-full object-contain [transform:translateZ(0)]"
                      />
                      {media.mediaType === 'video' && (
                        <span className="absolute top-1/2 left-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur-sm">
                          <Play className="ml-0.5 size-5" fill="currentColor" aria-hidden="true" />
                        </span>
                      )}
                    </button>
                    <div className="mt-4 flex justify-between gap-3 font-serif text-xs text-[#75654e]/75">
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <span>{media.createdTime?.split(' ')[0] || albumName}</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid h-full place-items-center font-serif text-2xl text-[#75654e]/25 italic">
                    {albumName}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        <button
          type="button"
          className={arrowClassName}
          aria-label="下一页"
          disabled={currentSpread === totalSpreads - 1}
          onClick={flipNext}
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>

      <div className="mx-auto grid max-w-[1120px] grid-cols-[1fr_auto_1fr] items-center gap-4 text-xs text-white/80">
        <span>
          {currentSpread + 1} / {totalSpreads}
        </span>
        <div className="flex max-w-48 gap-1 overflow-hidden" aria-hidden="true">
          {Array.from({ length: totalSpreads }, (_, index) => (
            <i
              key={index}
              className={`h-1 rounded-full transition-all ${
                index === currentSpread ? 'w-4 bg-white' : 'w-1 bg-white/30'
              }`}
            />
          ))}
        </div>
        <span className="text-right">{mediaList.length} 个瞬间</span>
      </div>
    </section>
  )
}

export default AlbumBook
