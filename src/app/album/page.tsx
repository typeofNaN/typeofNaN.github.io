'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { Carousel, Image, Modal, Tag } from 'antd'
import { Icon } from '@iconify/react'

import { OssHost } from '@/src/constants'
import { PhotoAlbumApi } from '@/src/service'

const Album = () => {
  const [photoAlbumList, setPhotoAlbumList] = useState<Api.PhotoAlbumApi.TotalList.ResponseVo>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPhotoAlbumName, setCurrentPhotoAlbumName] = useState('')
  const [mediaList, setMediaList] = useState<Api.MediaApi.Detail.ResponseVo[]>([])

  // 获取相册列表
  useEffect(() => {
    (async () => {
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
  const handleClickAlbum = useCallback(async (photoAlbum: Api.PhotoAlbumApi.Detail.ResponseVo) => {
    await getAlbumDetail(photoAlbum.photoAlbumId)
    setCurrentPhotoAlbumName(photoAlbum.photoAlbumName)
    setIsModalOpen(true)
  }, [getAlbumDetail])

  // 关闭弹窗
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false)
    setMediaList([])
    setCurrentPhotoAlbumName('')
  }, [])

  // 渲染相册封面
  const renderCovers = useCallback((cover: string) => {
    return cover
      .split('|')
      .filter(Boolean)
      .map((img, idx) => (
        <div key={idx} className="flex-center w-300px h-180px">
          <Image
            width={300}
            src={OssHost + img}
            preview={false}
            alt=""
          />
        </div>
      ))
  }, [])

  // 渲染标签
  const renderTags = useCallback((tags: string) => {
    return tags
      .split('|')
      .filter(Boolean)
      .map((tag, idx) => (
        <Tag key={idx}>{tag}</Tag>
      ))
  }, [])

  // 渲染媒体内容
  const renderMediaList = useMemo(() => (
    <Image.PreviewGroup>
      {mediaList.map(media => (
        <div
          key={media.mediaId}
          className="flex-center w-180px h-180px overflow-hidden"
        >
          <Image
            src={
              media.mediaType === 'image'
                ? OssHost + media.mediaUrl
                : OssHost + (media.posterUrl || `${media.mediaUrl}?x-oss-process=video/snapshot,t_1,ar_auto`)
            }
            width={180}
            height={180}
            alt=""
            className="object-cover"
          />
        </div>
      ))}
    </Image.PreviewGroup>
  ), [mediaList])

  return (
    <div className="flex flex-col gap-20px">
      {photoAlbumList.map(photoAlbum => (
        <div
          key={photoAlbum.photoAlbumId}
          className="flex gap-20px p-20px bg-color b-rd-8px select-none transition-duration-400 hover:transform-translate-y--4px hover:shadow cursor-pointer"
          onClick={() => handleClickAlbum(photoAlbum)}
        >
          <div className="w-300px h-180px">
            <Carousel
              autoplay
              autoplaySpeed={5000}
              dots
            >
              {renderCovers(photoAlbum.cover)}
            </Carousel>
          </div>
          <div className="w-[calc(100%-320px)]">
            <div className="flex-y-center justify-between mb-10px">
              <h3 className="text-20px">{photoAlbum.photoAlbumName}</h3>
              <div className="flex-y-center gap-8px text-12px opacity-40">
                <Icon icon="material-symbols:alarm-outline-rounded" />
                {photoAlbum.dateTime}
              </div>
            </div>
            <div className="mb-16px">
              {renderTags(photoAlbum.tags)}
            </div>
            <div className="text-16px opacity-80">{photoAlbum.story}</div>
          </div>
        </div>
      ))}
      <Modal
        title={currentPhotoAlbumName}
        width={1000}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        footer={null}
        onCancel={handleModalClose}
        destroyOnHidden
      >
        <div className="flex flex-wrap gap-12px m-auto">
          {renderMediaList}
        </div>
      </Modal>
    </div>
  )
}

export default Album
