'use client'

import Lightbox from 'yet-another-react-lightbox'
import Video from 'yet-another-react-lightbox/plugins/video'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'

interface MediaLightboxProps {
  images: string[]
  index: number | null
  title?: string
  videoSources?: Array<string | null>
  onIndexChange: (index: number | null) => void
}

const MediaLightbox = ({
  images,
  index,
  title = '图片预览',
  videoSources,
  onIndexChange,
}: MediaLightboxProps) => {
  return (
    <Lightbox
      open={index !== null && images.length > 0}
      close={() => onIndexChange(null)}
      index={index ?? 0}
      slides={images.map((src, imageIndex) => {
        const videoSource = videoSources?.[imageIndex]
        return videoSource
          ? {
              type: 'video' as const,
              poster: src,
              autoPlay: false,
              controls: true,
              playsInline: true,
              preload: 'metadata',
              sources: [
                {
                  src: videoSource,
                  type: videoSource.toLowerCase().includes('.webm') ? 'video/webm' : 'video/mp4',
                },
              ],
            }
          : {
              src,
              alt: `${title} ${imageIndex + 1}`,
            }
      })}
      plugins={[Zoom, Video]}
      on={{ view: ({ index: nextIndex }) => onIndexChange(nextIndex) }}
    />
  )
}

export default MediaLightbox
