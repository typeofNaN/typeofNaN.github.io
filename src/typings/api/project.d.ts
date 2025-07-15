declare namespace Api {
  namespace ProjectApi {
    namespace Detail {
      interface ResponseVo {
        backEnd: string
        createdTime: string
        frontEnd: string
        homePage: string
        license: string
        mainStack: string
        projectBackground: string
        projectDescription: string
        projectGroup: Api.ProjectGroupApi.Detail.ResponseVo
        projectGroupId: number | null
        projectIconUrl: string
        projectId: number
        projectName: string
        projectStatus: 0 | 1
        repository: string
        screenshots: string
        sort: number
        tags: string
      }
    }
  }
}
