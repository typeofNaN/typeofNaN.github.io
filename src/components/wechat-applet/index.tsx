'use client'

import { memo, useMemo } from 'react'
import { Icon } from '@iconify/react'
import { Image, Popover } from 'antd'

const APPLET_NAME = process.env.NEXT_PUBLIC_AUTHOR_NAME || 'typeofNaN'

const WechatApplet = () => {
  const content = useMemo(() => (
    <div className="flex-center flex-col gap-10px p-10px w-240px">
      <Image
        src="/images/applet.png"
        preview={false}
        width={200}
        height={200}
        alt="小程序二维码"
      />
      <p className="text-18px">{APPLET_NAME}</p>
    </div>
  ), [])

  return (
    <Popover content={content} trigger="hover" overlayClassName="wechat-applet-popover">
      <div className="flex-center w-40px h-40px cursor-pointer bg-green b-rd-50%" title="微信小程序" aria-label="微信小程序" tabIndex={0} role="button">
        <Icon icon="mingcute:wechat-miniprogram-line" fontSize={24} />
      </div>
    </Popover>
  )
}

export default memo(WechatApplet)
