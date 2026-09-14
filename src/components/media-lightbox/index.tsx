'use client'

import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'

interface MediaLightboxProps {
  images: string[]
  index: number | null
  title?: string
  onIndexChange: (index: number | null) => void
}

const MediaLightbox = ({
  images,
  index,
  title = '图片预览',
  onIndexChange,
}: MediaLightboxProps) => {
  return (
    <Lightbox
      open={index !== null && images.length > 0}
      close={() => onIndexChange(null)}
      index={index ?? 0}
      slides={images.map((src, imageIndex) => ({
        src,
        alt: `${title} ${imageIndex + 1}`,
      }))}
      plugins={[Zoom]}
      on={{ view: ({ index: nextIndex }) => onIndexChange(nextIndex) }}
    />
  )
}

export default MediaLightbox
