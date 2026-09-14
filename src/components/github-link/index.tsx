'use client'

import React, { memo } from 'react'
import Link from 'next/link'

import { Icon } from '@/src/components/local-icon'

const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_LINK

const GithubLink: React.FC = () => {
  if (!GITHUB_URL) return null

  return (
    <Link
      href={GITHUB_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub"
      className="flex h-[30px] w-[30px] items-center justify-center rounded-[4px] transition-colors hover:bg-[#e3e3e3] dark:hover:bg-[#222]"
    >
      <Icon icon="ri:github-fill" className="text-[22px]" />
    </Link>
  )
}

export default memo(GithubLink)
