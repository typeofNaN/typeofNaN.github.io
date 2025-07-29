'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'

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
    target: '_self'
  },
  {
    label: '博客',
    link: 'https://typeofNaN.github.io/vuepress-blog/',
    icon: 'ri:blogger-line',
    target: '_blank'
  },
  {
    label: '项目',
    link: '/project',
    icon: 'ix:project-new',
    target: '_self'
  },
  {
    label: '相册',
    link: '/album',
    icon: 'solar:album-bold',
    target: '_self'
  }
]

const CommonNav: React.FC = () => {
  const pathname = usePathname()

  const isActive = (link: string) => {
    // 只对站内路由做高亮
    if (link.startsWith('http')) return false
    return pathname === link
  }

  return (
    <nav className="flex-y-center gap-10px">
      {navList.map(({ label, link, icon, target = '_self' }) => (
        <Link
          href={link}
          key={link}
          target={target}
          className={[
            'flex-y-center gap-10px px-16px py-10px h-40px b-rd-20px text-16px opacity-80 hover:bg-#e3e3e3 dark:hover:bg-#1c1c1c',
            isActive(link) ? 'text-primary dark:text-primary-7' : ''
          ].join(' ')}
        >
          <Icon icon={icon} />
          {label}
        </Link>
      ))}
    </nav>
  )
}

export default CommonNav
