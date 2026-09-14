'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { Chip } from '@heroui/react'

import { Icon } from '@/src/components/local-icon'
import MediaCarousel from '@/src/components/media-carousel'
import MediaLightbox from '@/src/components/media-lightbox'
import UiModal from '@/src/components/ui-modal'
import { OssHost } from '@/src/constants'
import { PhotoAlbumApi } from '@/src/service'

const Album = () => {
  const [photoAlbumList, setPhotoAlbumList] = useState<Api.PhotoAlbumApi.TotalList.ResponseVo>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPhotoAlbumName, setCurrentPhotoAlbumName] = useState('')
  const [mediaList, setMediaList] = useState<Api.MediaApi.Detail.ResponseVo[]>([])
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

  // 获取相册列表
  useEffect(() => {
    ;(async () => {
      const { data } = await PhotoAlbumApi.getPhotoAlbumList()
      if (data) setPhotoAlbumList(data)
    })()
  }, [])

  // 获取相册详情
  const getAlbumDetail = useCallback(async (photoAlbumId: number) => {
    const { data } = await PhotoAlbumApi.getMediaListByPhotoAlbumId(photoAlbumId)
    if (data) setMediaList(data)
  }, [])

  // 点击相册
  const handleClickAlbum = useCallback(
    async (photoAlbum: Api.PhotoAlbumApi.Detail.ResponseVo) => {
      await getAlbumDetail(photoAlbum.photoAlbumId)
      setCurrentPhotoAlbumName(photoAlbum.photoAlbumName)
      setIsModalOpen(true)
    },
    [getAlbumDetail],
  )

  // 关闭弹窗
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false)
    setMediaList([])
    setCurrentPhotoAlbumName('')
  }, [])

  const handlePreviewIndexChange = useCallback((nextIndex: number | null) => {
    setPreviewIndex(nextIndex)
    setIsModalOpen(nextIndex === null)
  }, [])

  // 渲染标签
  const renderTags = useCallback((tags: string) => {
    return tags
      .split('|')
      .filter(Boolean)
      .map((tag, idx) => (
        <Chip key={idx} size="sm" variant="soft">
          {tag}
        </Chip>
      ))
  }, [])

  const previewMediaList = useMemo(
    () =>
      mediaList.map((media) =>
        media.mediaType === 'image'
          ? OssHost + media.mediaUrl
          : OssHost +
            (media.posterUrl || `${media.mediaUrl}?x-oss-process=video/snapshot,t_1,ar_auto`),
      ),
    [mediaList],
  )

  // 渲染媒体内容
  const renderMediaList = useMemo(
    () => (
      <>
        {previewMediaList.map((media, index) => (
          <button
            type="button"
            key={media}
            className="aspect-square cursor-zoom-in overflow-hidden rounded-[7px] border-0 bg-[var(--site-surface-soft)] p-0 [&_img]:h-full [&_img]:w-full [&_img]:object-cover"
            onClick={() => handlePreviewIndexChange(index)}
          >
            <img src={media} alt={`${currentPhotoAlbumName} ${index + 1}`} />
          </button>
        ))}
      </>
    ),
    [currentPhotoAlbumName, handlePreviewIndexChange, previewMediaList],
  )

  return (
    <div className="mx-auto flex min-h-[calc(100vh-121px)] w-full max-w-[1200px] flex-col gap-5 px-4 pt-[42px] pb-14 sm:px-6 max-sm:pt-6 max-sm:pb-9">
      {photoAlbumList.map((photoAlbum) => (
        <article
          key={photoAlbum.photoAlbumId}
          className="flex cursor-pointer flex-col overflow-hidden rounded-lg border border-[var(--site-border)] bg-[var(--site-surface)] select-none transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--site-accent)_40%,var(--site-border))] hover:shadow-[var(--site-shadow)] sm:flex-row"
          onClick={() => handleClickAlbum(photoAlbum)}
        >
          <div className="h-[220px] w-full shrink-0 overflow-hidden bg-[var(--site-surface-soft)] sm:h-[210px] sm:w-[320px]">
            <MediaCarousel
              images={photoAlbum.cover
                .split('|')
                .filter(Boolean)
                .map((img) => OssHost + img)}
              alt={photoAlbum.photoAlbumName}
            />
          </div>
          <div className="flex min-w-0 grow flex-col p-5 sm:px-[26px] sm:py-6">
            <div className="flex items-center justify-between gap-[12px]">
              <h2 className="text-[21px] leading-[1.35]">{photoAlbum.photoAlbumName}</h2>
              <div className="flex shrink-0 items-center gap-[6px] text-xs text-[var(--site-subtle)]">
                <Icon icon="material-symbols:alarm-outline-rounded" />
                {photoAlbum.dateTime}
              </div>
            </div>
            <div className="mt-[14px]">{renderTags(photoAlbum.tags)}</div>
            <p className="mt-[14px] line-clamp-2 text-sm leading-7 text-[var(--site-muted)]">
              {photoAlbum.story}
            </p>
            <span className="mt-auto flex items-center gap-[6px] pt-4 text-[13px] font-semibold text-[var(--site-accent)] sm:pt-[18px]">
              查看相册 <Icon icon="lucide:arrow-right" />
            </span>
          </div>
        </article>
      ))}
      <UiModal
        title={currentPhotoAlbumName}
        open={isModalOpen}
        onClose={handleModalClose}
        size="lg"
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{renderMediaList}</div>
      </UiModal>
      <MediaLightbox
        images={previewMediaList}
        index={previewIndex}
        title={currentPhotoAlbumName || '相册预览'}
        onIndexChange={handlePreviewIndexChange}
      />
    </div>
  )
}

export default Album
