'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'

const GithubLink = () => {
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_LINK || ''

  return (
    <Link
      href={githubUrl}
      target="_blank"
    >
      <div className="flex-center w-30px h-30px">
        <Icon icon="ri:github-fill" />
      </div>
    </Link>
  )
}

export default GithubLink
