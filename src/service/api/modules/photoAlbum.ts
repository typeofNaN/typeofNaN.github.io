import { request } from '../../request'

/**
 * @description 图库模块接口
 */
export class PhotoAlbumApi {
  /**
   * @description 获取图库列表
   */
  public static getPhotoAlbumList() {
    return request.get<Api.PhotoAlbumApi.TotalList.ResponseVo>(
      '/photo-album'
    )
  }

  /**
   * @description 根据ID获取图库
   * @param { number } photoAlbumId 图库ID
   */
  public static async getMediaListByPhotoAlbumId(photoAlbumId: number) {
    return request.get<Api.PhotoAlbumApi.MediaList.ResponseVo>(
      `/photo-album/${photoAlbumId}`
    )
  }
}
