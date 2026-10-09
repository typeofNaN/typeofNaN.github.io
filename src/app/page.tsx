'use client'

import { useState, type CSSProperties } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Avatar } from '@heroui/react'
import { ArrowRight, MapPin, Images, FolderKanban } from 'lucide-react'
import Typeit from 'typeit-react'
import { SkillPackList, LifeTrajectory, OssHost } from '@/src/constants'
import { Icon } from '@/src/components/local-icon'
import WechatApplet from '../components/wechat-applet'

const HeroThreeScene = dynamic(() => import('@/src/components/hero-three-scene'), { ssr: false })
const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_LINK || 'https://github.com/typeofNaN'
const BLOG_URL = 'https://typeofNaN.github.io/vuepress-blog/'
const OLD_BOY_URL = 'https://30.typeofnan.cn'
const AUTHOR_NAME = process.env.NEXT_PUBLIC_AUTHOR_NAME || 'typeofNaN'
const SOCIAL_LINK_CLASS =
  'hero-social-link flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-[rgba(12,28,28,0.24)] text-white backdrop-blur-sm'
const TOGGLE_CLASS =
  'group mt-3 inline-flex cursor-pointer items-center gap-2.5 border-b border-current py-2.5 text-[13px] leading-none font-bold text-[#17483e] transition-all hover:gap-3.5 hover:text-[#27766f] [&_svg]:h-4 [&_svg]:w-4 [&_svg]:transition-transform aria-expanded:[&_svg]:-rotate-90'

const getHelloStr = () => {
  const hour = new Date().getHours()
  if (hour >= 3 && hour < 8) return '早上好'
  if (hour >= 8 && hour < 12) return '上午好'
  if (hour >= 12 && hour < 14) return '中午好'
  if (hour >= 14 && hour < 18) return '下午好'
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

const Home = () => {
  const [timelineExpanded, setTimelineExpanded] = useState(false)
  const [skillsExpanded, setSkillsExpanded] = useState(false)
  const visibleTimeline = timelineExpanded ? LifeTrajectory : LifeTrajectory.slice(0, 6)
  const visibleSkills = skillsExpanded ? SkillPackList : SkillPackList.slice(0, 12)

  return (
    <div className="bg-[#f4f7f5] text-[#14231f]">
      <section className="home-hero relative h-[clamp(390px,54vh,540px)] min-h-[390px] w-full overflow-hidden max-sm:h-[430px] max-sm:min-h-[430px]">
        <div className="absolute inset-0 bg-[#071312]">
          <HeroThreeScene />
        </div>
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto flex h-full w-full max-w-[1200px] items-center px-4 sm:px-6 max-sm:items-end max-sm:pb-[46px]">
          <div className="w-[min(610px,100%)] text-white">
            <div className="hero-enter hero-enter-1 flex items-center gap-[14px]">
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
            <p className="hero-enter hero-enter-2 mt-7 text-[clamp(22px,3vw,34px)] leading-[1.35] font-semibold max-sm:mt-[22px]">
              喜欢就是信仰，热爱会是力量
            </p>
            <p className="hero-enter hero-enter-3 mt-[10px] text-[15px] text-white/75 max-sm:text-sm">
              软件开发工程师，记录代码、项目与生活。
            </p>
            <div className="hero-enter hero-enter-4 mt-[26px] flex items-center gap-[10px]">
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

      <main className="mx-auto w-[min(1320px,calc(100%_-_80px))] max-[800px]:w-[calc(100%_-_36px)]">
        <section
          data-reveal
          className="reveal-up min-h-[150px] border-b border-[#d5ddda] py-[34px] max-sm:min-h-[138px] max-sm:py-7"
        >
          <p className="mb-2 text-[11px] font-bold tracking-[0.08em] text-[#27766f]">A FEW WORDS</p>
          <Typeit
            options={typeitOptions}
            className="block text-lg leading-[1.85] text-[#17211f] italic max-sm:text-base"
          />
        </section>

        <section
          data-reveal
          className="reveal-up grid grid-cols-[220px_1fr_330px] gap-[46px] border-b border-[#d5ddda] py-[54px] max-[800px]:grid-cols-1 max-[800px]:gap-[38px]"
        >
          <div data-reveal className="reveal-up reveal-delay-1">
            <span className="mb-5 block h-0.5 w-[34px] bg-[#17483e]" />
            <h2 className="text-[29px] tracking-[-.03em]">人生轨迹</h2>
            <p className="mt-2.5 text-[9px] leading-[1.7] tracking-[.24em] text-[#96a39f]">
              SOME MOMENTS
              <br />
              IN MY LIFE
            </p>
          </div>
          <div data-reveal className="reveal-up reveal-delay-2">
            <ol className="list-none pt-[7px]">
              {visibleTimeline.map(({ date, content }, index) => {
                const isCurrent = index === visibleTimeline.length - 1 && date === '今天'
                return (
                  <li
                    key={`${date}-${content}`}
                    className="timeline-row relative grid grid-cols-[92px_1fr] gap-5 border-l border-[#cbd5d1] pb-[26px] pl-7 max-sm:grid-cols-[78px_1fr] max-sm:gap-3"
                    style={{ '--row-index': index } as CSSProperties}
                  >
                    <span
                      className={`absolute rounded-full ${isCurrent ? 'top-[3px] -left-2 h-[15px] w-[15px] bg-[#ef6c65] shadow-[0_0_0_5px_#f4f7f5]' : 'top-1.5 -left-[5px] h-[9px] w-[9px] bg-[#6f9188]'}`}
                    />
                    <time className="text-xs text-[#465852]">{date}</time>
                    <p className="text-xs leading-[1.55] text-[#596963]">{content}</p>
                  </li>
                )
              })}
            </ol>
            <button
              className={TOGGLE_CLASS}
              type="button"
              onClick={() => setTimelineExpanded((value) => !value)}
              aria-expanded={timelineExpanded}
            >
              {timelineExpanded ? '收起人生轨迹' : `展开全部 ${LifeTrajectory.length} 条轨迹`}{' '}
              <ArrowRight />
            </button>
          </div>
          <figure className="image-reveal reveal-delay-3 relative m-0 h-[340px] overflow-hidden max-[800px]:h-[280px]">
            {/* The static export serves this remote OSS image directly. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="parallax-image h-full w-full object-cover"
              src={OssHost + 'web/images/mountain-field-note.png'}
              alt="云雾漫过群山与森林"
            />
            <figcaption className="absolute right-[22px] bottom-6 text-[17px] leading-[1.6] text-white italic [text-shadow:0_2px_8px_#000]">
              山高路远，
              <br />
              但一直在路上。
            </figcaption>
          </figure>
        </section>

        <section
          data-reveal
          className="reveal-up grid grid-cols-[220px_1fr] gap-[46px] border-b border-[#d5ddda] py-[54px] max-[800px]:grid-cols-1 max-[800px]:gap-[38px]"
        >
          <div data-reveal className="reveal-up reveal-delay-1">
            <span className="mb-5 block h-0.5 w-[34px] bg-[#17483e]" />
            <h2 className="text-[29px] tracking-[-.03em]">技能与工具</h2>
            <p className="mt-2.5 text-[9px] leading-[1.7] tracking-[.24em] text-[#96a39f]">
              SKILLS &amp; TOOLS
            </p>
            <span className="mt-8 block text-[13px] leading-[1.7] text-[#73817d]">
              持续学习，
              <br />
              用喜欢的工具创造有价值的东西。
            </span>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-x-14 gap-y-7 py-2 max-[800px]:grid-cols-1">
              {visibleSkills.map(({ skillName, icon, proficiency }) => (
                <div className="skill-row grid grid-cols-[38px_1fr] gap-x-3.5" key={skillName}>
                  {/* Skill icons have dynamic remote URLs and are rendered as-is. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="row-span-2 h-[30px] w-[30px] self-center" src={icon} alt="" />
                  <div className="flex justify-between text-[13px]">
                    <span>{skillName}</span>
                    <span>{proficiency}%</span>
                  </div>
                  <div className="mt-[9px] h-1 bg-[#d7dfdc]">
                    <span
                      className="skill-meter block h-full bg-[#0c4338]"
                      style={{ '--skill-value': `${proficiency}%` } as CSSProperties}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              className={TOGGLE_CLASS}
              type="button"
              onClick={() => setSkillsExpanded((value) => !value)}
              aria-expanded={skillsExpanded}
            >
              {skillsExpanded ? '收起技能列表' : `展开全部 ${SkillPackList.length} 项技能`}{' '}
              <ArrowRight />
            </button>
          </div>
        </section>

        <nav
          data-reveal
          className="reveal-up grid grid-cols-3 py-[42px] max-[800px]:grid-cols-1"
          aria-label="探索更多"
        >
          {[
            {
              href: '/map',
              icon: MapPin,
              title: '去看看走过的地方',
              detail: 'FOOTPRINTS · 用脚步感受这个世界',
            },
            {
              href: '/project',
              icon: FolderKanban,
              title: '浏览项目',
              detail: 'PROJECTS · 把想法变成现实',
            },
            {
              href: '/album',
              icon: Images,
              title: '翻翻相册',
              detail: 'PHOTOS · 定格生活中的美好',
            },
          ].map(({ href, icon: DestinationIcon, title, detail }, index) => (
            <Link
              key={href}
              href={href}
              className={`destination-link flex min-h-[92px] items-center gap-5 border-[#d5ddda] px-9 max-[800px]:border-b max-[800px]:px-0 max-[800px]:py-6 ${index < 2 ? 'border-r max-[800px]:border-r-0' : ''} ${index === 0 ? 'pl-0' : ''}`}
            >
              <DestinationIcon className="h-[42px] w-[42px] text-[#73958d]" strokeWidth={1.2} />
              <span>
                <strong className="flex items-center gap-3 text-[17px]">
                  {title} <ArrowRight className="h-[18px] w-[18px]" />
                </strong>
                <small className="mt-2 block text-[9px] tracking-[.14em] text-[#879590]">
                  {detail}
                </small>
              </span>
            </Link>
          ))}
        </nav>
      </main>
    </div>
  )
}

export default Home
