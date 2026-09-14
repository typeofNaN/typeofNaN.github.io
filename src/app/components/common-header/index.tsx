'use client'

import React, { memo } from 'react'
import Link from 'next/link'
import { Separator } from '@heroui/react'

import { CommonNav } from '..'
import ToggleTheme from '@/src/components/toggle-theme'

const CommonHeader: React.FC = () => (
  <header className="fixed top-0 left-0 z-[99] h-[60px] w-full border-b border-[var(--site-border)] bg-[var(--site-header-bg)] backdrop-blur-[16px] backdrop-saturate-[1.4]">
    <div className="mx-auto flex h-full w-full max-w-[1200px] items-center justify-between px-4 sm:px-6">
      <div className="flex h-full items-center select-none">
        <Link
          href="/"
          className="site-brand text-[19px] leading-none font-bold text-[var(--site-foreground)] sm:text-[22px]"
        >
          typeofNaN
        </Link>
      </div>
      <div className="flex items-center gap-[2px] text-[18px] sm:gap-[8px] sm:text-[20px]">
        <CommonNav />
        <span className="flex h-[18px] max-sm:hidden">
          <Separator orientation="vertical" />
        </span>
        <ToggleTheme />
      </div>
    </div>
  </header>
)

export default memo(CommonHeader)
