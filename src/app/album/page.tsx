'use client'

import { useEffect, useState } from 'react'

import { PhotoAlbumApi } from '@/src/service'

export default function Project() {
  const [photoAlbumList, setPhotoAlbumList] = useState<Api.PhotoAlbumApi.TotalList.ResponseVo>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await PhotoAlbumApi.getPhotoAlbumList()
      if (data) {
        setPhotoAlbumList(data)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      {
        photoAlbumList.map(photoAlbum => {
          return (
            <div key={photoAlbum.photoAlbumId}>
              <div>{photoAlbum.photoAlbumName}</div>
            </div>
          )
        })
      }
    </div>
  )
}