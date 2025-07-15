'use client'

import { useEffect, useState } from 'react'

import { ProjectGroupApi } from '@/src/service'

export default function Project() {
  const [projectGroupList, setProjectGroupList] = useState<Api.ProjectGroupApi.TotalList.ResponseVo>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await ProjectGroupApi.getProjectGroupList()
      if (data) {
        setProjectGroupList(data)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      {
        projectGroupList.map(projectGroup => {
          return (
            <div key={projectGroup.projectGroupId}>
              <div>{projectGroup.projectGroupName}</div>
              {
                projectGroup.projectList.map(project => {
                  return (
                    <div key={project.projectId}>{project.projectName}</div>
                  )
                })
              }
            </div>
          )
        })
      }
    </div>
  )
}