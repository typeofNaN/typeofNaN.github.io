'use client'

import React, { memo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const BEIAN_URL = 'https://beian.miit.gov.cn/'
const BEIAN_TEXT = '赣ICP备2023003304号-1'
const POWERED_BY = 'Powered by Next.js'

const CommonFooter: React.FC = () => {
  const author = process.env.NEXT_PUBLIC_AUTHOR_NAME || 'typeofNaN'
  const pathname = usePathname()

  return (
    <footer
      className={`flex min-h-[60px] w-full flex-wrap items-center justify-center gap-[2px] border-t border-[var(--site-border)] bg-[var(--site-surface)] px-4 py-4 text-[10px] text-[var(--site-subtle)] sm:gap-1 sm:text-xs ${pathname === '/map' ? 'fixed right-0 bottom-0 left-0 z-[98] h-[60px]' : ''}`}
    >
      <span>&copy; {author}</span>
      <span className="mx-1 sm:mx-2">·</span>
      <span>{POWERED_BY}</span>
      <span className="mx-1 sm:mx-2">·</span>
      <Link href={BEIAN_URL} target="_blank" rel="noopener noreferrer" className="hover:underline">
        {BEIAN_TEXT}
      </Link>
    </footer>
  )
}

export default memo(CommonFooter)
