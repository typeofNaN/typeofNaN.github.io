'use client'

import { memo, useMemo } from 'react'
import { Icon } from '@iconify/react'
import { Image, Popover } from 'antd'

import { OssHost } from '@/src/constants'

const APPLET_QRCODE = `${OssHost}applet/qrcode/applet.png`
const APPLET_NAME = 'typeofNaN'

const WechatApplet = () => {
  const content = useMemo(() => (
    <div className="flex-center flex-col gap-10px p-10px w-240px">
      <Image
        src={APPLET_QRCODE}
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
      <div className="flex-center w-30px h-30px cursor-pointer" title="微信小程序" aria-label="微信小程序" tabIndex={0} role="button">
        <Icon icon="mingcute:wechat-miniprogram-line" fontSize={22} />
      </div>
    </Popover>
  )
}

export default memo(WechatApplet)
