'use client'

import React, { memo } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'

const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_LINK

const GithubLink: React.FC = () => {
  if (!GITHUB_URL) return null

  return (
    <Link
      href={GITHUB_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub"
      className="flex-center w-30px h-30px hover:bg-#e3e3e3 dark:hover:bg-#222 b-rd-4px transition-colors"
    >
      <Icon icon="ri:github-fill" className="text-22px" />
    </Link>
  )
}

export default memo(GithubLink)
