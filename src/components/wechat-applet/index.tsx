'use client'

import { memo, useMemo } from 'react'
import { Popover } from '@heroui/react'

import { Icon } from '@/src/components/local-icon'
import { OssHost } from '@/src/constants'

const APPLET_NAME = process.env.NEXT_PUBLIC_AUTHOR_NAME || 'typeofNaN'

const WechatApplet = ({ className = '' }: { className?: string }) => {
  const content = useMemo(
    () => (
      <div className="flex w-[240px] flex-col items-center justify-center gap-[10px] p-[10px]">
        <img src={OssHost + 'web/images/applet.png'} width={200} height={200} alt="小程序二维码" />
        <p className="text-[18px]">{APPLET_NAME}</p>
      </div>
    ),
    [],
  )

  return (
    <Popover>
      <Popover.Trigger>
        <div
          className={`${className} cursor-pointer`}
          title="微信小程序"
          aria-label="微信小程序"
          tabIndex={0}
          role="button"
        >
          <Icon icon="mingcute:wechat-miniprogram-line" fontSize={24} />
        </div>
      </Popover.Trigger>
      <Popover.Content placement="top">
        <Popover.Dialog>{content}</Popover.Dialog>
      </Popover.Content>
    </Popover>
  )
}

export default memo(WechatApplet)
