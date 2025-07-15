declare namespace Api {
  namespace ProjectGroupApi {
    namespace TotalList {
      type ResponseVo = Detail.ResponseVo[]
    }

    namespace Detail {
      type ResponseVo = {
        createdTime: string
        projectGroupId: number
        projectGroupName: string
        projectGroupStatus: 0 | 1
        projectList: Api.ProjectApi.Detail.ResponseVo[]
      }
    }
  }
}
