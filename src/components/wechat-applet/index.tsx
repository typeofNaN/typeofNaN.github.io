'use client'

import { Icon } from '@iconify/react'
import { Image, Popover } from 'antd'

import { OssHost } from '@/src/constants'

const WechatApplet = () => {
  const content = <div className="flex-center flex-col gap-10px p-10px w-240px">
    <Image src={OssHost + 'applet/qrcode/applet.png'} preview={false} width={200} height={200} />
    <p className="text-18px">typeofNaN</p>
  </div>

  return (
    <Popover content={content} trigger="hover">
      <div className="flex-center w-30px h-30px">
        <Icon icon="mingcute:wechat-miniprogram-line" />
      </div>
    </Popover>

  )
}

export default WechatApplet
