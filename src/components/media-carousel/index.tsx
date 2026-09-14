'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'

interface MediaCarouselProps {
  images: string[]
  alt: string
  interval?: number
}

const MediaCarousel = ({ images, alt, interval = 5000 }: MediaCarouselProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const plugins = useMemo(
    () =>
      images.length > 1
        ? [Autoplay({ delay: interval, stopOnInteraction: false, stopOnMouseEnter: true })]
        : [],
    [images.length, interval],
  )
  const [viewportRef, emblaApi] = useEmblaCarousel({ loop: true }, plugins)

  const syncSelectedIndex = useCallback(() => {
    if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    syncSelectedIndex()
    emblaApi.on('select', syncSelectedIndex)
    emblaApi.on('reInit', syncSelectedIndex)
    return () => {
      emblaApi.off('select', syncSelectedIndex)
      emblaApi.off('reInit', syncSelectedIndex)
    }
  }, [emblaApi, syncSelectedIndex])

  if (!images.length) return <div className="h-full w-full" />

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="h-full w-full overflow-hidden" ref={viewportRef}>
        <div className="flex h-full w-full [touch-action:pan-y_pinch-zoom]">
          {images.map((image, index) => (
            <div className="h-full min-w-0 flex-[0_0_100%]" key={image}>
              <img
                className="block h-full w-full object-cover"
                src={image}
                alt={index === selectedIndex ? alt : ''}
              />
            </div>
          ))}
        </div>
      </div>
      {images.length > 1 && (
        <div
          className="absolute right-0 bottom-3 left-0 z-1 flex justify-center gap-[5px]"
          aria-label="轮播分页"
        >
          {images.map((image, index) => (
            <button
              type="button"
              key={image}
              className={`h-[6px] cursor-pointer border-0 p-0 transition-[width,background-color] ${index === selectedIndex ? 'w-[18px] rounded-sm bg-white' : 'w-[6px] rounded-full bg-white/50'}`}
              aria-label={`查看第 ${index + 1} 张图片`}
              aria-current={index === selectedIndex ? 'true' : undefined}
              onClick={(event) => {
                event.stopPropagation()
                emblaApi?.scrollTo(index)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MediaCarousel
