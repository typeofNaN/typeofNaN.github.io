'use client'

import { useEffect, useState, useCallback, useMemo, type CSSProperties } from 'react'
import { Chip } from '@heroui/react'

import { Icon } from '@/src/components/local-icon'
import AlbumBook from '@/src/components/album-book'
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
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)

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
      setActiveMediaIndex(0)
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
    if (nextIndex !== null) setActiveMediaIndex(nextIndex)
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

  const previewVideoSources = useMemo(
    () => mediaList.map((media) => (media.mediaType === 'video' ? OssHost + media.mediaUrl : null)),
    [mediaList],
  )

  return (
    <div className="mx-auto flex min-h-[calc(100vh-121px)] w-full max-w-[1280px] flex-col px-5 pt-10 pb-20 sm:px-8 lg:px-10">
      <header
        data-reveal
        className="page-intro reveal-up mb-12 grid grid-cols-[1fr_auto] items-end border-b border-[var(--site-border)] pb-8 max-md:grid-cols-1"
      >
        <div>
          <h1 className="font-serif text-[46px] leading-none font-semibold tracking-[-.04em]">
            相册
          </h1>
          <p className="mt-3 text-[20px] tracking-[.08em] text-[var(--site-muted)]">
            定格生活中的美好
          </p>
        </div>
        <p className="max-w-[190px] border-l border-[var(--site-border)] pl-6 text-sm leading-7 text-[var(--site-subtle)] max-md:hidden">
          一张照片，一段时光
          <br />
          也是一种生活的记录。
        </p>
      </header>
      {photoAlbumList.map((photoAlbum, index) => (
        <article
          key={photoAlbum.photoAlbumId}
          data-reveal
          style={{ '--reveal-delay': `${Math.min(index, 4) * 70}ms` } as CSSProperties}
          className="album-row reveal-up group grid cursor-pointer grid-cols-[48px_minmax(280px,460px)_minmax(300px,1fr)] gap-7 border-b border-[var(--site-border)] px-3 py-5 select-none max-md:grid-cols-[36px_1fr] max-md:gap-4 sm:px-5"
          onClick={() => handleClickAlbum(photoAlbum)}
        >
          <span className="border-r border-[var(--site-border)] pt-2 text-xs tracking-[.14em] text-[var(--site-accent)]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="album-image-frame h-[230px] w-full overflow-hidden bg-[var(--site-surface-soft)] max-md:h-[210px]">
            <img
              src={OssHost + photoAlbum.cover.split('|').filter(Boolean)[0]}
              alt={photoAlbum.photoAlbumName}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex min-w-0 grow flex-col py-2 max-md:col-span-2 max-md:pl-10">
            <div className="flex items-start justify-between gap-[12px]">
              <h2 className="font-serif text-[25px] leading-[1.35] font-semibold">
                {photoAlbum.photoAlbumName}
              </h2>
              <div className="flex shrink-0 items-center gap-[6px] text-xs text-[var(--site-subtle)]">
                <Icon icon="material-symbols:alarm-outline-rounded" />
                {photoAlbum.dateTime}
              </div>
            </div>
            <div className="mt-[14px]">{renderTags(photoAlbum.tags)}</div>
            <p className="mt-[14px] line-clamp-4 text-sm leading-7 text-[var(--site-muted)]">
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
        containerClassName="w-full!"
        dialogClassName="w-[min(1540px,calc(100vw-40px))]! max-w-[min(1540px,calc(100vw-40px))]! max-h-[calc(100vh-32px)]! border-0! bg-transparent! shadow-none! max-[700px]:w-[calc(100vw-16px)]! max-[700px]:max-w-[calc(100vw-16px)]! max-[700px]:max-h-[calc(100vh-16px)]! [&_[data-slot=modal-header]]:absolute [&_[data-slot=modal-header]]:top-2 [&_[data-slot=modal-header]]:left-5 [&_[data-slot=modal-header]]:z-10 [&_[data-slot=modal-header]]:text-white [&_[data-slot=modal-header]]:[text-shadow:0_2px_12px_rgba(0,0,0,.72)] [&_[data-slot=modal-body]]:overflow-visible! [&_[data-slot=modal-body]]:p-0! [&_[data-slot=modal-close-trigger]]:bg-[rgba(16,22,21,.58)] [&_[data-slot=modal-close-trigger]]:text-white [&_[data-slot=modal-close-trigger]]:backdrop-blur-[10px]"
      >
        <AlbumBook
          albumName={currentPhotoAlbumName}
          mediaList={mediaList}
          activeMediaIndex={activeMediaIndex}
          onPreview={(index) => handlePreviewIndexChange(index)}
          onPageChange={setActiveMediaIndex}
        />
      </UiModal>
      <MediaLightbox
        images={previewMediaList}
        videoSources={previewVideoSources}
        index={previewIndex}
        title={currentPhotoAlbumName || '相册预览'}
        onIndexChange={handlePreviewIndexChange}
      />
    </div>
  )
}

export default Album
