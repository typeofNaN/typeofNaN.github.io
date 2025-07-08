import Link from 'next/link'
import React from 'react'

import ToggleTheme from '@/src/components/toggle-theme'

const CommonHeader = () => {
  return (
    <header className="fixed top-0 left-0 w-full h-60px bg-[rgba(255,255,255,.6)] dark:bg-[rgba(68,68,68,.6)] b-b-1px b-b-solid b-b-[rgb(222,222,222)] dark:b-b-[rgb(35,35,35)] backdrop-blur-5px">
      <div className="flex-y-center justify-between container m-auto h-full">
        <div className='flex-y-center gap-60px h-full select-none text-primary dark:text-#fff'>
          <Link href="/" className="text-24px">typeofNaN</Link>
          <div className="text-14px">喜欢就是信仰，热爱会是力量</div>
        </div>
        <div className="flex-center">
          <ToggleTheme />
        </div>
      </div>
    </header>
  )
}

export default CommonHeader
