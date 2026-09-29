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
    <div className="mx-auto flex min-h-[calc(100vh-121px)] w-full max-w-[1280px] flex-col px-5 pt-12 pb-20 sm:px-8 lg:px-10">
      <header className="mb-12 grid grid-cols-[1fr_auto] items-end border-b border-[var(--site-border)] pb-8 max-md:grid-cols-1">
        <div>
          <h1 className="font-serif text-[46px] leading-none font-semibold tracking-[-.04em]">
            项目
          </h1>
          <p className="mt-3 text-[20px] tracking-[.08em] text-[var(--site-muted)]">
            把想法变成现实
          </p>
        </div>
        <p className="max-w-[190px] border-l border-[var(--site-border)] pl-6 text-sm leading-7 text-[var(--site-subtle)] max-md:hidden">
          一些正在生长的想法
          <br />
          也是我与世界对话的方式。
        </p>
      </header>
      <div className="flex flex-col gap-14">
        {projectGroupList.map((projectGroup) => (
          <section key={projectGroup.projectGroupId}>
            <div className="mb-2 flex items-baseline gap-4">
              <span className="h-6 w-1 rounded-full bg-[var(--site-accent)]" />
              <h2 className="font-serif text-[24px] font-semibold">
                {projectGroup.projectGroupName}
              </h2>
              <span className="text-[13px] text-[var(--site-subtle)]">
                {projectGroup.projectList.length} 个项目
              </span>
            </div>
            <div className="grid grid-cols-2 max-md:grid-cols-1">
              {projectGroup.projectList.map((project) => (
                <div
                  className="border-b border-[var(--site-border)] even:border-l max-md:even:border-l-0"
                  key={project.projectId}
                >
                  <button
                    type="button"
                    className="group flex min-h-[106px] w-full cursor-pointer items-center gap-5 bg-transparent px-4 py-5 text-left font-[inherit] text-[var(--site-foreground)] transition duration-300 hover:bg-[var(--site-accent-soft)] sm:px-5"
                    onClick={() => handleClickProject(project.projectId)}
                  >
                    <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-[10px] bg-[var(--site-accent-soft)] transition group-hover:bg-[var(--site-surface)]">
                      <img
                        src={OssHost + project.projectIconUrl}
                        width={42}
                        height={42}
                        alt=""
                        className="rounded-[7px]"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-serif text-[18px] font-semibold">
                        {project.projectName}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-[13px] leading-6 text-[var(--site-muted)]">
                        {project.projectDescription ||
                          project.projectBackground ||
                          '查看项目详情与技术实现'}
                      </p>
                    </div>
                    <Icon
                      icon="lucide:arrow-right"
                      className="shrink-0 text-[18px] text-[var(--site-accent)] transition group-hover:translate-x-1"
                    />
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
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
