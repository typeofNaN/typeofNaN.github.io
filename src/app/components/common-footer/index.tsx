'use client'

import Link from 'next/link'
import React from 'react'

const CommonFooter = () => {
  const author = process.env.NEXT_PUBLIC_AUTHOR_NAME || ''

  return (
    <footer className="flex-center gap-4px fixed bottom-0 left-0 w-full h-60px z-99 bg-color b-t-1px b-b-solid b-b-[rgb(222,222,222)] dark:b-b-[rgb(35,35,35)] backdrop-blur-5px text-12px opacity-90">
      <span>&copy; {author}</span>
      ·
      <span>Power by Next.js</span>
      ·
      <Link href={'https://beian.miit.gov.cn/'} target="_blank">赣ICP备2023003304号-1</Link>
    </footer>
  )
}

export default CommonFooter
