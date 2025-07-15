'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'

export default function Github() {
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_LINK || ''

  return (
    <Link href={githubUrl} target="_blank">
      <div className="flex-center w-30px h-30px">
        <Icon icon="ri:github-fill" />
      </div>
    </Link>
  )
}