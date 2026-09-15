'use client'

import React from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Avatar, ProgressBar } from '@heroui/react'
import Typeit from 'typeit-react'

import { Icon } from '@/src/components/local-icon'
import { SkillPackList, LifeTrajectory, OssHost } from '@/src/constants'
import WechatApplet from '../components/wechat-applet'

/**
 * 获取问候语
 */
const getHelloStr = () => {
  const nowHour = new Date().getHours()
  if (nowHour >= 3 && nowHour < 8) return '早上好'
  if (nowHour >= 8 && nowHour < 12) return '上午好'
  if (nowHour >= 12 && nowHour < 14) return '中午好'
  if (nowHour >= 14 && nowHour < 18) return '下午好'
  return '晚上好'
}

const typeitOptions = {
  strings: [
    `Hello，${getHelloStr()}！我是 typeofNaN，一名软件开发工程师。欢迎来到我的个人空间。这里展示了一些我的足迹、博客、项目、生活。茫茫人海，很幸运，在这里，遇见你 ❤️`,
  ],
  lifeLike: true,
  speed: 120,
  loop: false,
}

interface ContainerBoxProps {
  icon: string
  title: string
  children: React.ReactNode
}

const ContainerBox: React.FC<ContainerBoxProps> = ({ icon, title, children }) => (
  <section className="overflow-hidden rounded-lg border border-[var(--site-border)] bg-[var(--site-surface)] shadow-[var(--site-shadow)]">
    <div className="flex items-center gap-3 border-b border-[var(--site-border)] px-6 py-[22px] max-sm:p-[18px]">
      <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[7px] bg-[var(--site-accent-soft)] text-[var(--site-accent)]">
        <Icon icon={icon} fontSize={20} />
      </div>
      <div>
        <p className="mb-[2px] text-[11px] font-bold text-[var(--site-accent)]">ABOUT ME</p>
        <h2 className="text-xl leading-[1.3]">{title}</h2>
      </div>
    </div>
    <div className="px-6 pt-7 pb-2 max-sm:px-4 max-sm:pt-6 max-sm:pb-[6px]">{children}</div>
  </section>
)

const AUTHOR_NAME = process.env.NEXT_PUBLIC_AUTHOR_NAME || 'typeofNaN'
const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_LINK || ''
const BLOG_URL = 'https://typeofNaN.github.io/vuepress-blog/'
const OLD_BOY_URL = 'https://30.typeofnan.cn'
const HeroThreeScene = dynamic(() => import('@/src/components/hero-three-scene'), { ssr: false })
const SOCIAL_LINK_CLASS =
  'flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-[rgba(12,28,28,0.24)] text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-white/75 hover:bg-white/15'

const Home: React.FC = () => {
  return (
    <div>
      <section className="relative h-[clamp(390px,54vh,540px)] min-h-[390px] w-full overflow-hidden max-sm:h-[430px] max-sm:min-h-[430px]">
        <div className="absolute inset-0 bg-[#071312]">
          <HeroThreeScene />
        </div>
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto flex h-full w-full max-w-[1200px] items-center px-4 sm:px-6 max-sm:items-end max-sm:pb-[46px]">
          <div className="w-[min(610px,100%)] text-white">
            <div className="flex items-center gap-[14px]">
              <Avatar size="lg">
                <Avatar.Image src={OssHost + 'web/images/avatar.jpg'} alt={AUTHOR_NAME} />
                <Avatar.Fallback>NaN</Avatar.Fallback>
              </Avatar>
              <div>
                <p className="mb-[2px] text-[11px] font-bold text-white/65">HELLO, I AM</p>
                <h1 className="text-[clamp(30px,4vw,48px)] leading-[1.12] font-bold">
                  {AUTHOR_NAME}
                </h1>
              </div>
            </div>
            <p className="mt-7 text-[clamp(22px,3vw,34px)] leading-[1.35] font-semibold max-sm:mt-[22px]">
              喜欢就是信仰，热爱会是力量
            </p>
            <p className="mt-[10px] text-[15px] text-white/75 max-sm:text-sm">
              软件开发工程师，记录代码、项目与生活。
            </p>
            <div className="mt-[26px] flex items-center gap-[10px]">
              <Link
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className={SOCIAL_LINK_CLASS}
                title="Github"
              >
                <Icon icon="ri:github-fill" fontSize={24} />
              </Link>
              <Link
                href={BLOG_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="博客"
                className={SOCIAL_LINK_CLASS}
                title="博客"
              >
                <Icon icon="ri:blogger-line" fontSize={24} />
              </Link>
              <Link
                href={OLD_BOY_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="老男孩"
                className={SOCIAL_LINK_CLASS}
                title="老男孩"
              >
                <Icon icon="fluent-emoji-high-contrast:boy" fontSize={24} />
              </Link>
              <WechatApplet className={SOCIAL_LINK_CLASS} />
              <Link
                href="mailto:dmdefine6@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="电子邮件"
                className={SOCIAL_LINK_CLASS}
                title="Email"
              >
                <Icon icon="mynaui:envelope" fontSize={24} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--site-border)] bg-[var(--site-surface)]">
        <div className="mx-auto min-h-[150px] w-full max-w-[1200px] px-4 py-[34px] sm:px-6 max-sm:min-h-[138px] max-sm:py-7">
          <p className="mb-[2px] text-[11px] font-bold text-[var(--site-accent)]">A FEW WORDS</p>
          <Typeit
            options={typeitOptions}
            className="mt-3 block w-full text-lg leading-[1.85] text-[var(--site-foreground)] italic max-sm:text-base"
          />
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-[1200px] gap-7 px-4 pt-[42px] pb-14 sm:px-6 max-sm:pt-6 max-sm:pb-9">
        <ContainerBox icon="ri:history-line" title="人生轨迹">
          <ol className="m-0 list-none p-0">
            {LifeTrajectory.map(({ color, date, content }) => (
              <li
                key={`${date}-${content}`}
                className="timeline-item relative min-h-[68px] pb-7 pl-7"
                style={{ '--timeline-color': color } as React.CSSProperties}
              >
                <span className="absolute top-[5px] left-px h-[11px] w-[11px] rounded-full border-[3px] border-[var(--site-surface)] bg-[var(--timeline-color,var(--site-accent))] shadow-[0_0_0_1px_var(--site-border)]" />
                <div>
                  <p className="text-sm font-bold text-[var(--site-foreground)]">{date}</p>
                  <p className="mt-[5px] text-sm leading-7 text-[var(--site-muted)] max-sm:text-[13px]">
                    {content}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </ContainerBox>
        <ContainerBox icon="material-symbols:tools-wrench-outline-sharp" title="个人技能">
          <div className="grid grid-cols-4 gap-[14px] max-sm:grid-cols-2 max-sm:gap-[10px]">
            {SkillPackList.map(({ skillName, icon, proficiency }) => (
              <div key={skillName}>
                <div className="flex min-h-[68px] items-center gap-[10px] rounded-[7px] border border-[var(--site-border)] bg-[var(--site-background)] p-3 max-sm:min-h-[62px] max-sm:p-[9px]">
                  <img src={icon} width={34} height={34} alt={skillName} />
                  <div className="min-w-0 grow">
                    <div className="mb-[6px] flex items-center justify-between gap-[6px]">
                      <p className="truncate text-[13px] font-semibold text-[var(--site-foreground)]">
                        {skillName}
                      </p>
                      <span className="text-[11px] text-[var(--site-subtle)]">{proficiency}</span>
                    </div>
                    <ProgressBar aria-label={`${skillName} 熟练度`} value={proficiency} size="sm">
                      <ProgressBar.Track>
                        <ProgressBar.Fill />
                      </ProgressBar.Track>
                    </ProgressBar>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ContainerBox>
      </div>
    </div>
  )
}

export default Home
