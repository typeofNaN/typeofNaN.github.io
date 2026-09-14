'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Icon } from '@/src/components/local-icon'

type NavLink = {
  label: string
  link: string
  icon: string
  target?: '_self' | '_blank' | '_top' | '_parent'
}

const navList: NavLink[] = [
  {
    label: '首页',
    link: '/',
    icon: 'material-symbols:home-outline-rounded',
    target: '_self',
  },
  {
    label: '足迹',
    link: '/map',
    icon: 'mingcute:foot-line',
    target: '_self',
  },
  // {
  //   label: '博客',
  //   link: 'https://typeofNaN.github.io/vuepress-blog/',
  //   icon: 'ri:blogger-line',
  //   target: '_blank',
  // },
  {
    label: '项目',
    link: '/project',
    icon: 'ix:project-new',
    target: '_self',
  },
  {
    label: '相册',
    link: '/album',
    icon: 'solar:album-bold',
    target: '_self',
  },
]

const CommonNav: React.FC = () => {
  const pathname = usePathname()

  const isActive = (link: string) => {
    // 只对站内路由做高亮
    if (link.startsWith('http')) return false
    return pathname === link
  }

  return (
    <nav className="flex items-center gap-0 sm:gap-[4px]">
      {navList.map(({ label, link, icon, target = '_self' }) => (
        <Link
          href={link}
          key={link}
          target={target}
          className={[
            'relative flex h-[40px] items-center gap-2 rounded-md px-[9px] text-[15px] text-[var(--site-muted)] transition-colors hover:bg-[var(--site-surface-soft)] hover:text-[var(--site-foreground)] sm:px-[13px]',
            isActive(link) ? 'bg-[var(--site-accent-soft)] text-[var(--site-accent)]' : '',
          ].join(' ')}
        >
          <Icon icon={icon} />
          <span className="hidden sm:inline">{label}</span>
        </Link>
      ))}
    </nav>
  )
}

export default CommonNav
