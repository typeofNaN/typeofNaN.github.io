import { request } from '../../request'

/**
 * @description 项目组模块接口
 */
export class ProjectApi {
  /**
   * @description 获取项目详情
   * @param { number } projectId 项目ID
   */
  public static getDetail(projectId: number) {
    return request.get<Api.ProjectApi.Detail.ResponseVo>(
      `/project/${projectId}`
    )
  }
}
