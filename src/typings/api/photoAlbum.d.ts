declare namespace Api {
  namespace PhotoAlbumApi {
    namespace TotalList {
      type ResponseVo = Detail.ResponseVo[]
    }

    namespace MediaList {
      type ResponseVo = Api.MediaApi.Detail.ResponseVo[]
    }

    namespace Detail {
      type ResponseVo = {
        cover: string
        createdTime: string
        dateTime: string
        isHot: boolean
        isNew: boolean
        photoAlbumId: number
        photoAlbumName: string
        photoAlbumStatus: 0 | 1
        mediaList: Api.MediaApi.Detail.ResponseVo[]
        sort: number
        story: string
        tags: string
      }
    }
  }
}