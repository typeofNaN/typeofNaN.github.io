'use client'

import { useEffect, useState } from 'react'
import { Carousel, Image, Modal, Tag } from 'antd'
import { Icon } from '@iconify/react'

import { OssHost } from '@/src/constants'
import { PhotoAlbumApi } from '@/src/service'

export default function Album() {
  const [photoAlbumList, setPhotoAlbumList] = useState<Api.PhotoAlbumApi.TotalList.ResponseVo>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPhotoAlbumName, setCurrentPhotoAlbumName] = useState('')
  const [mediaList, setMediaList] = useState<Api.MediaApi.Detail.ResponseVo[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await PhotoAlbumApi.getPhotoAlbumList()
      if (data) {
        setPhotoAlbumList(data)
      }
    }
    fetchData()
  }, [])

  const getAlbumDetail = async (photoAlbumId: number) => {
    const { data } = await PhotoAlbumApi.getMediaListByPhotoAlbumId(photoAlbumId)
    if (data) {
      setMediaList(data)
    }
  }

  const handleClickAlbum = async (photoAlbum: Api.PhotoAlbumApi.Detail.ResponseVo) => {
    await getAlbumDetail(photoAlbum.photoAlbumId)
    setCurrentPhotoAlbumName(photoAlbum.photoAlbumName)
    setIsModalOpen(true)
  }

  return (
    <div className="flex flex-col gap-20px">
      {
        photoAlbumList.map(photoAlbum => {
          return (
            <div key={photoAlbum.photoAlbumId} className="flex gap-20px p-20px bg-color b-rd-8px select-none" onClick={() => handleClickAlbum(photoAlbum)}>
              <div className="w-300px h-180px">
                <Carousel autoplay={{ dotDuration: true }} autoplaySpeed={5000}>
                  {
                    photoAlbum.cover.split('|').map((cover, index) => {
                      return (
                        <div key={index} className="flex-center w-300px h-180px">
                          <Image width={300} src={OssHost + cover} preview={false} />
                        </div>
                      )
                    })
                  }
                </Carousel>
              </div>
              <div className="w-[calc(100%-320px)]">
                <div className="flex-y-center justify-between mb-10px">
                  <h3 className="text-20px hover:text-primary">{photoAlbum.photoAlbumName}</h3>
                  <div className="flex-y-center gap-8px text-12px opacity-40">
                    <Icon icon="material-symbols:alarm-outline-rounded" />
                    {photoAlbum.dateTime}
                  </div>
                </div>
                <div className="mb-16px">
                  {
                    photoAlbum.tags.split('|').map((tag, index) => {
                      return (
                        <Tag key={index}>{tag}</Tag>
                      )
                    })
                  }
                </div>
                <div className="text-16px opacity-80">{photoAlbum.story}</div>
              </div>
            </div>
          )
        })
      }
      <Modal
        title={currentPhotoAlbumName}
        width={1000}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
      >
        <div className="flex flex-wrap gap-12px m-auto">
          <Image.PreviewGroup>
            {
              mediaList.map(media => {
                return (
                  <div key={media.mediaId} className="flex-center w-180px h-180px overflow-hidden">
                    {
                      media.mediaType === 'image'
                        ? (
                          <Image src={OssHost + media.mediaUrl} width={180} height={180} className="object-cover" />
                        )
                        : (
                          <Image src={OssHost + (media.posterUrl || `${media.mediaUrl}?x-oss-process=video/snapshot,t_1,ar_auto`)} width={180} height={180} className="object-cover" />
                        )
                    }
                  </div>
                )
              })
            }
          </Image.PreviewGroup>
        </div>
      </Modal>
    </div>
  )
}