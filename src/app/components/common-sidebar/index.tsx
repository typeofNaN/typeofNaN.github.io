'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'

const CommonSidebar = () => {
  const navList = [
    {
      label: 'Not a Number',
      link: '/',
      icon: 'material-symbols:home-outline-rounded'
    },
    {
      label: '项目',
      link: '/project',
      icon: 'ix:project-new'
    },
    {
      label: '相册',
      link: '/album',
      icon: 'solar:album-bold'
    }
  ]

  const pathname = usePathname()

  return (
    <aside className="fixed top-80px p-10px b-rd-10px w-280px bg-[rgba(255,255,255,.3)]">
      <nav className="">
        {
          navList.map(nav => {
            return (
              <Link href={nav.link} key={nav.link} className={`flex-y-center gap-10px p-10px h-50px b-rd-4px text-16px hover:bg-#e3e3e3 ${pathname === nav.link && 'text-primary'}`}>
                <Icon icon={nav.icon} />
                {nav.label}
              </Link>
            )
          })
        }
      </nav>
    </aside>
  )
}

export default CommonSidebar
