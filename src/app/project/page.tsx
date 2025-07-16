'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Col, Image, Modal, Row, Tag } from 'antd'
import { Icon } from '@iconify/react'

import { OssHost } from '@/src/constants'
import { ProjectApi, ProjectGroupApi } from '@/src/service'

const Project = () => {
  const [projectGroupList, setProjectGroupList] = useState<Api.ProjectGroupApi.TotalList.ResponseVo>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projectDetail, setProjectDetail] = useState<Api.ProjectApi.Detail.ResponseVo>()

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await ProjectGroupApi.getProjectGroupList()
      if (data) {
        setProjectGroupList(data)
      }
    }
    fetchData()
  }, [])

  const getProjectDetail = async (projectId: number) => {
    const { data } = await ProjectApi.getDetail(projectId)
    if (data) {
      setProjectDetail(data)
    }
  }

  const handleClickProject = async (projectId: number) => {
    await getProjectDetail(projectId)
    setIsModalOpen(true)
  }

  const modalTitle = (projectIconUrl: string, projectName: string) => {
    return (
      <div className="flex-y-center gap-20px">
        <Image src={OssHost + projectIconUrl} preview={false} width={30} />
        <h3 className="text-20px">{projectName}</h3>
      </div>
    )
  }

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
                        <div className="flex-y-center bg-color b-rd-8px p-20px cursor-pointer select-none transition-duration-400 hover:transform-translate-y--4px hover:shadow" onClick={() => handleClickProject(project.projectId)}>
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
      <Modal
        title={modalTitle(projectDetail?.projectIconUrl || '', projectDetail?.projectName || '')}
        width={1000}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
      >
        <div className="py-10px">
          <div className="flex-y-center gap-10px mb-10px text-16px">
            <Icon icon="material-symbols:bookmark-star-outline" />
            <div className="flex-y-center">
              {
                projectDetail?.tags.split('|').map((tag, index) => {
                  return (
                    <Tag key={index}>{tag}</Tag>
                  )
                })
              }
            </div>
          </div>
          {
            projectDetail?.license && (
              <div className="flex-y-center gap-10px mb-10px text-16px">
                <Icon icon="mdi:license" />
                {
                  <Tag>{projectDetail?.license}</Tag>
                }
              </div>
            )
          }
          {
            projectDetail?.homePage && (
              <div className="flex-y-center gap-10px mb-10px text-16px">
                <Icon icon="material-symbols:home-outline-rounded" />
                <Link href={projectDetail?.homePage} target="_blank" className="text-color hover:underline">{projectDetail?.homePage}</Link>
              </div>
            )
          }
          {
            projectDetail?.repository && (
              <div className="flex-y-center gap-10px mb-10px text-16px">
                <Icon icon="mdi:git" />
                <Link href={projectDetail?.repository} target="_blank" className="text-color hover:underline">{projectDetail?.repository}</Link>
              </div>
            )
          }
        </div>
        {
          projectDetail?.projectBackground && (
            <div className="mb-20px">
              <div className="flex-y-center gap-10px mb-10px font-bold text-18px">
                <div className="w-4px h-20px bg-primary" />
                项目背景
              </div>
              <div className="indent-2em">{projectDetail?.projectBackground}</div>
            </div>
          )
        }
        {
          projectDetail?.projectDescription && (
            <div className="mb-20px">
              <div className="flex-y-center gap-10px mb-10px font-bold text-18px">
                <div className="w-4px h-20px bg-primary" />
                项目简介
              </div>
              <div className="indent-2em">{projectDetail?.projectDescription}</div>
            </div>
          )
        }
        <div className="mb-20px">
          <div className="flex-y-center gap-10px mb-10px font-bold text-18px">
            <div className="w-4px h-20px bg-primary" />
            项目技术栈
          </div>
          {
            projectDetail?.mainStack && (
              <div className="flex-y-center gap-10px mb-10px">
                主技术栈：
                <div className="flex-y-center">
                  {
                    projectDetail?.mainStack.split('|').map((stack, index) => {
                      return (
                        <Tag key={index}>{stack}</Tag>
                      )
                    })
                  }
                </div>
              </div>
            )
          }
          {
            projectDetail?.backEnd && (
              <div className="flex-y-center gap-10px mb-10px">
                后端技术栈：
                <div className="flex-y-center">
                  {
                    projectDetail?.backEnd.split('|').map((stack, index) => {
                      return (
                        <Tag key={index}>{stack}</Tag>
                      )
                    })
                  }
                </div>
              </div>
            )
          }
          {
            projectDetail?.frontEnd && (
              <div className="flex-y-center gap-10px mb-10px">
                前端技术栈：
                <div className="flex-y-center">
                  {
                    projectDetail?.frontEnd.split('|').map((stack, index) => {
                      return (
                        <Tag key={index}>{stack}</Tag>
                      )
                    })
                  }
                </div>
              </div>
            )
          }
        </div>
        {
          projectDetail?.screenshots && (
            <div className="mb-20px">
              <div className="flex-y-center gap-10px mb-10px font-bold text-18px">
                <div className="w-4px h-20px bg-primary" />
                项目预览
              </div>
              <div className="flex-y-center flex-wrap gap-10px">
                <Image.PreviewGroup>
                  {
                    projectDetail?.screenshots.split('|').map((screenshot, index) => {
                      return (
                        <Image key={index} src={OssHost + screenshot} alt="" width={180} preview={{ title: '11' }} />
                      )
                    })
                  }
                </Image.PreviewGroup>
              </div>
            </div>
          )
        }
      </Modal>
    </div>
  )
}

export default Project
