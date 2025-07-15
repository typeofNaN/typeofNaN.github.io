declare namespace Api {
  namespace MediaApi {
    namespace Detail {
      type ResponseVo = {
        createdTime: string
        mediaId: number
        mediaStatus: 0 | 1
        mediaType: 'image' | 'video'
        mediaUrl: string
        photoAlbum: Api.PhotoAlbumApi.Detail.ResponseVo
        photoAlbumId: number
        posterUrl: string
        sort: number
      }
    }
  }
}