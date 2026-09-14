'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { Chip } from '@heroui/react'

import { Icon } from '@/src/components/local-icon'
import MediaLightbox from '@/src/components/media-lightbox'
import UiModal from '@/src/components/ui-modal'
import { OssHost } from '@/src/constants'
import { ProjectApi, ProjectGroupApi } from '@/src/service'

/**
 * 渲染标签
 */
const renderTags = (tags?: string) => {
  if (!tags) return null
  return tags
    .split('|')
    .filter(Boolean)
    .map((tag, idx) => (
      <Chip key={idx} size="sm" variant="soft">
        {tag}
      </Chip>
    ))
}

/**
 * 渲染技术栈
 */
const renderStack = (label: string, stack?: string) => {
  if (!stack) return null
  return (
    <div className="mb-[10px] flex items-start gap-[10px]">
      <span className="shrink-0">{label}</span>
      <div className="flex flex-wrap gap-[4px]">{renderTags(stack)}</div>
    </div>
  )
}

/**
 * 渲染图片预览
 */
const renderScreenshots = (screenshots: string[] = [], onPreview: (index: number) => void) => {
  if (!screenshots.length) return null
  return (
    <div className="mb-[20px]">
      <div className="mb-[10px] flex items-center gap-[10px] text-[18px] font-bold">
        <div className="h-5 w-1 shrink-0 rounded-sm bg-[var(--site-accent)]" />
        项目预览
      </div>
      <div className="flex flex-wrap gap-[10px]">
        {screenshots.map((screenshot, idx) => (
          <button
            type="button"
            className="h-[120px] w-[180px] cursor-zoom-in overflow-hidden rounded-[7px] border border-[var(--site-border)] bg-[var(--site-surface-soft)] p-0 [&_img]:h-full [&_img]:w-full [&_img]:object-cover"
            key={screenshot}
            onClick={() => onPreview(idx)}
          >
            <img src={screenshot} alt={`项目截图 ${idx + 1}`} />
          </button>
        ))}
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
    <div className="mb-[20px]">
      <div className="mb-[10px] flex items-center gap-[10px] text-[18px] font-bold">
        <div className="h-5 w-1 shrink-0 rounded-sm bg-[var(--site-accent)]" />
        {title}
      </div>
      <div className="indent-[2em]">{content}</div>
    </div>
  )
}

const Project = () => {
  const [projectGroupList, setProjectGroupList] =
    useState<Api.ProjectGroupApi.TotalList.ResponseVo>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projectDetail, setProjectDetail] = useState<Api.ProjectApi.Detail.ResponseVo>()
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

  useEffect(() => {
    ;(async () => {
      const { data } = await ProjectGroupApi.getProjectGroupList()
      if (data) setProjectGroupList(data)
    })()
  }, [])

  const getProjectDetail = useCallback(async (projectId: number) => {
    const { data } = await ProjectApi.getDetail(projectId)
    if (data) setProjectDetail(data)
  }, [])

  const handleClickProject = useCallback(
    async (projectId: number) => {
      await getProjectDetail(projectId)
      setIsModalOpen(true)
    },
    [getProjectDetail],
  )

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false)
    setProjectDetail(undefined)
  }, [])

  const handlePreviewIndexChange = useCallback((nextIndex: number | null) => {
    setPreviewIndex(nextIndex)
    setIsModalOpen(nextIndex === null)
  }, [])

  const modalTitle = useMemo(
    () => (
      <div className="flex items-center gap-[20px]">
        <img src={OssHost + (projectDetail?.projectIconUrl || '')} width={30} height={30} alt="" />
        <h3 className="text-[20px]">{projectDetail?.projectName || ''}</h3>
      </div>
    ),
    [projectDetail],
  )

  const screenshotList = useMemo(
    () =>
      (projectDetail?.screenshots || '')
        .split('|')
        .filter(Boolean)
        .map((screenshot) => OssHost + screenshot),
    [projectDetail?.screenshots],
  )

  return (
    <div className="mx-auto flex min-h-[calc(100vh-121px)] w-full max-w-[1200px] flex-col gap-11 px-4 pt-[42px] pb-14 sm:px-6 max-sm:pt-6 max-sm:pb-9">
      {projectGroupList.map((projectGroup) => (
        <section key={projectGroup.projectGroupId}>
          <div className="mb-[18px] flex items-center gap-[10px]">
            <span className="h-5 w-1 rounded-sm bg-[var(--site-accent)]" />
            <h2 className="text-xl">{projectGroup.projectGroupName}</h2>
          </div>
          <div className="grid grid-cols-4 gap-4 max-sm:grid-cols-1">
            {projectGroup.projectList.map((project) => (
              <div key={project.projectId}>
                <button
                  type="button"
                  className="group flex min-h-[76px] w-full cursor-pointer items-center rounded-lg border border-[var(--site-border)] bg-[var(--site-surface)] p-[14px] text-left font-[inherit] text-[var(--site-foreground)] select-none transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--site-accent)_45%,var(--site-border))] hover:shadow-[var(--site-shadow)]"
                  onClick={() => handleClickProject(project.projectId)}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[7px] bg-[var(--site-surface-soft)]">
                    <img src={OssHost + project.projectIconUrl} width={40} height={40} alt="" />
                  </div>
                  <div className="min-w-0 flex-1 truncate pl-3 text-sm font-semibold">
                    {project.projectName}
                  </div>
                  <Icon
                    icon="lucide:arrow-up-right"
                    className="shrink-0 translate-x-[-4px] translate-y-1 text-[var(--site-subtle)] opacity-0 transition group-hover:translate-0 group-hover:opacity-100"
                  />
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}
      <UiModal title={modalTitle} open={isModalOpen} onClose={handleModalClose} size="lg">
        <div className="overflow-hidden py-[10px]">
          {projectDetail?.tags && (
            <div className="mb-[10px] flex gap-[10px] text-[16px]">
              <Icon icon="material-symbols:bookmark-star-outline" className="mt-[4px] shrink-0" />
              <div className="flex flex-wrap gap-[4px]">{renderTags(projectDetail.tags)}</div>
            </div>
          )}
          {projectDetail?.license && (
            <div className="mb-[10px] flex gap-[10px] text-[16px]">
              <Icon icon="mdi:license" className="mt-[4px] shrink-0" />
              <Chip size="sm" variant="soft">
                {projectDetail.license}
              </Chip>
            </div>
          )}
          {projectDetail?.homePage && (
            <div className="mb-[10px] flex gap-[10px] text-[16px]">
              <Icon icon="material-symbols:home-outline-rounded" className="mt-[4px] shrink-0" />
              <Link
                href={projectDetail.homePage}
                target="_blank"
                className="break-all text-black hover:underline dark:text-white"
              >
                {projectDetail.homePage}
              </Link>
            </div>
          )}
          {projectDetail?.repository && (
            <div className="mb-[10px] flex gap-[10px] text-[16px]">
              <Icon icon="mdi:git" className="mt-[4px] shrink-0" />
              <Link
                href={projectDetail.repository}
                target="_blank"
                className="break-all text-black hover:underline dark:text-white"
              >
                {projectDetail.repository}
              </Link>
            </div>
          )}
        </div>
        {renderDetailBlock('项目背景', projectDetail?.projectBackground)}
        {renderDetailBlock('项目简介', projectDetail?.projectDescription)}
        <div className="mb-[20px]">
          <div className="mb-[10px] flex items-center gap-[10px] text-[18px] font-bold">
            <div className="h-5 w-1 shrink-0 rounded-sm bg-[var(--site-accent)]" />
            项目技术栈
          </div>
          {renderStack('主技术栈：', projectDetail?.mainStack)}
          {renderStack('后端技术栈：', projectDetail?.backEnd)}
          {renderStack('前端技术栈：', projectDetail?.frontEnd)}
        </div>
        {renderScreenshots(screenshotList, handlePreviewIndexChange)}
      </UiModal>
      <MediaLightbox
        images={screenshotList}
        index={previewIndex}
        title="项目截图"
        onIndexChange={handlePreviewIndexChange}
      />
    </div>
  )
}

export default Project
