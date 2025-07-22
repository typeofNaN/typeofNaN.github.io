'use client'

import React, { memo } from 'react'
import Link from 'next/link'

const BEIAN_URL = 'https://beian.miit.gov.cn/'
const BEIAN_TEXT = '赣ICP备2023003304号-1'
const POWERED_BY = 'Powered by Next.js'

const CommonFooter: React.FC = () => {
  const author = process.env.NEXT_PUBLIC_AUTHOR_NAME || 'typeofNaN'

  return (
    <footer className="flex-center gap-4px fixed bottom-0 left-0 w-full h-60px z-99 bg-color b-t-1px b-b-solid b--[rgb(222,222,222)] dark:b-t-[rgb(35,35,35)] backdrop-blur-5px text-12px opacity-90">
      <span>&copy; {author}</span>
      <span className="mx-2">·</span>
      <span>{POWERED_BY}</span>
      <span className="mx-2">·</span>
      <Link
        href={BEIAN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
      >
        {BEIAN_TEXT}
      </Link>
    </footer>
  )
}

export default memo(CommonFooter)
