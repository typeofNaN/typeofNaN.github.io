import { request } from '../../request'

/**
 * @description 项目组模块接口
 */
export class ProjectGroupApi {
  /**
   * @description 获取项目列表
   */
  public static getProjectGroupList() {
    return request.get<Api.ProjectGroupApi.TotalList.ResponseVo>(
      '/project-group'
    )
  }
}