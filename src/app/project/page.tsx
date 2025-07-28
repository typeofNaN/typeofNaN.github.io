'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { Col, Image, Modal, Row, Tag } from 'antd'
import { Icon } from '@iconify/react'

import { OssHost } from '@/src/constants'
import { ProjectApi, ProjectGroupApi } from '@/src/service'

/**
 * 渲染标签
 */
const renderTags = (tags?: string) => {
  if (!tags) return null
  return tags.split('|').filter(Boolean).map((tag, idx) => (
    <Tag key={idx}>{tag}</Tag>
  ))
}

/**
 * 渲染技术栈
 */
const renderStack = (label: string, stack?: string) => {
  if (!stack) return null
  return (
    <div className="flex-y-center gap-10px mb-10px">
      {label}
      <div className="flex-y-center">
        {renderTags(stack)}
      </div>
    </div>
  )
}

/**
 * 渲染图片预览
 */
const renderScreenshots = (screenshots?: string) => {
  if (!screenshots) return null
  return (
    <div className="mb-20px">
      <div className="flex-y-center gap-10px mb-10px font-bold text-18px">
        <div className="w-4px h-20px bg-primary" />
        项目预览
      </div>
      <div className="flex-y-center flex-wrap gap-10px">
        <Image.PreviewGroup>
          {screenshots.split('|').filter(Boolean).map((screenshot, idx) => (
            <Image
              key={idx}
              src={OssHost + screenshot}
              alt=""
              width={180}
              preview={{ title: '项目截图' }}
            />
          ))}
        </Image.PreviewGroup>
      </div>
    </div>
  )
}

/**
 * 渲染详情区块
 */
const renderDetailBlock = (title: string, content?: string) => {
  if (!content) return null
  return (
    <div className="mb-20px">
      <div className="flex-y-center gap-10px mb-10px font-bold text-18px">
        <div className="w-4px h-20px bg-primary" />
        {title}
      </div>
      <div className="indent-2em">{content}</div>
    </div>
  )
}

const Project = () => {
  const [projectGroupList, setProjectGroupList] = useState<Api.ProjectGroupApi.TotalList.ResponseVo>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projectDetail, setProjectDetail] = useState<Api.ProjectApi.Detail.ResponseVo>()

  useEffect(() => {
    (async () => {
      const { data } = await ProjectGroupApi.getProjectGroupList()
      if (data) setProjectGroupList(data)
    })()
  }, [])

  const getProjectDetail = useCallback(async (projectId: number) => {
    const { data } = await ProjectApi.getDetail(projectId)
    if (data) setProjectDetail(data)
  }, [])

  const handleClickProject = useCallback(async (projectId: number) => {
    await getProjectDetail(projectId)
    setIsModalOpen(true)
  }, [getProjectDetail])

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false)
    setProjectDetail(undefined)
  }, [])

  const modalTitle = useMemo(() => (
    <div className="flex-y-center gap-20px">
      <Image
        src={OssHost + (projectDetail?.projectIconUrl || '')}
        preview={false}
        width={30}
        alt=""
      />
      <h3 className="text-20px">{projectDetail?.projectName || ''}</h3>
    </div>
  ), [projectDetail])

  return (
    <div className="flex flex-col gap-40px w-full py-20px container">
      {projectGroupList.map(projectGroup => (
        <div key={projectGroup.projectGroupId}>
          <div className="mb-20px font-bold text-18px">{projectGroup.projectGroupName}</div>
          <Row gutter={[20, 20]}>
            {projectGroup.projectList.map(project => (
              <Col
                key={project.projectId}
                lg={6}
                md={8}
                sm={12}
                xs={24}
              >
                <div
                  className="flex-y-center bg-color b-rd-8px p-20px cursor-pointer select-none transition-duration-400 hover:transform-translate-y--4px hover:shadow"
                  onClick={() => handleClickProject(project.projectId)}
                >
                  <div className="flex-center w-40px h-40px">
                    <Image
                      src={OssHost + project.projectIconUrl}
                      width={40}
                      preview={false}
                      alt=""
                    />
                  </div>
                  <div className="pl-10px w-[calc(100%-40px)]">{project.projectName}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      ))}
      <Modal
        title={modalTitle}
        width={1000}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        footer={null}
        onCancel={handleModalClose}
        destroyOnHidden
      >
        <div className="py-10px">
          {projectDetail?.tags && (
            <div className="flex-y-center gap-10px mb-10px text-16px">
              <Icon icon="material-symbols:bookmark-star-outline" />
              <div className="flex-y-center">{renderTags(projectDetail.tags)}</div>
            </div>
          )}
          {projectDetail?.license && (
            <div className="flex-y-center gap-10px mb-10px text-16px">
              <Icon icon="mdi:license" />
              <Tag>{projectDetail.license}</Tag>
            </div>
          )}
          {projectDetail?.homePage && (
            <div className="flex-y-center gap-10px mb-10px text-16px">
              <Icon icon="material-symbols:home-outline-rounded" />
              <Link
                href={projectDetail.homePage}
                target="_blank"
                className="text-color hover:underline"
              >{projectDetail.homePage}</Link>
            </div>
          )}
          {projectDetail?.repository && (
            <div className="flex-y-center gap-10px mb-10px text-16px">
              <Icon icon="mdi:git" />
              <Link
                href={projectDetail.repository}
                target="_blank"
                className="text-color hover:underline"
              >{projectDetail.repository}</Link>
            </div>
          )}
        </div>
        {renderDetailBlock('项目背景', projectDetail?.projectBackground)}
        {renderDetailBlock('项目简介', projectDetail?.projectDescription)}
        <div className="mb-20px">
          <div className="flex-y-center gap-10px mb-10px font-bold text-18px">
            <div className="w-4px h-20px bg-primary" />
            项目技术栈
          </div>
          {renderStack('主技术栈：', projectDetail?.mainStack)}
          {renderStack('后端技术栈：', projectDetail?.backEnd)}
          {renderStack('前端技术栈：', projectDetail?.frontEnd)}
        </div>
        {renderScreenshots(projectDetail?.screenshots)}
      </Modal>
    </div>
  )
}

export default Project
