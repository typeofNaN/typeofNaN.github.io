'use client'

import React, { memo } from 'react'
import Link from 'next/link'
import { Divider } from 'antd'

import { CommonNav } from '..'
import ToggleTheme from '@/src/components/toggle-theme'

const CommonHeader: React.FC = () => (
  <header className="fixed top-0 left-0 w-full h-60px z-99 bg-color b-b-1px b-b-solid b-b-[rgb(222,222,222)] dark:b-b-[rgb(35,35,35)] backdrop-blur-5px">
    <div className="flex-y-center justify-between container m-auto h-full">
      <div className="flex-y-center sm:gap-60px gap-20px h-full select-none text-primary dark:text-#fff">
        <Link href="/" className="sm:text-24px text-20px font-bold leading-none">
          typeofNaN
        </Link>
      </div>
      <div className="flex-y-center sm:gap-10px gap-4px sm:text-20px text-18px">
        <CommonNav />
        <Divider type="vertical" />
        <ToggleTheme />
      </div>
    </div>
  </header>
)

export default memo(CommonHeader)
