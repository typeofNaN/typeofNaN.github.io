'use client'

import { useEffect, useState } from 'react'
import { Col, Image, Row } from 'antd'

import { ProjectGroupApi } from '@/src/service'
import { OssHost } from '@/src/constants'

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
    <div className="flex flex-col gap-40px w-full">
      {
        projectGroupList.map(projectGroup => {
          return (
            <div key={projectGroup.projectGroupId}>
              <div className="mb-20px font-bold text-18px">{projectGroup.projectGroupName}</div>
              <Row gutter={[20, 20]}>
                {
                  projectGroup.projectList.map(project => {
                    return (
                      <Col key={project.projectId} lg={6} md={8} sm={12} xs={24}>
                        <div className="flex-y-center bg-color b-rd-8px p-20px cursor-pointer select-none">
                          <div className="flex-center w-40px h-40px">
                            <Image src={OssHost + project.projectIconUrl} width={40} preview={false} />
                          </div>
                          <div className="pl-10px w-[calc(100%-40px)]">{project.projectName}</div>
                        </div>
                      </Col>
                    )
                  })
                }
              </Row>
            </div>
          )
        })
      }
    </div>
  )
}