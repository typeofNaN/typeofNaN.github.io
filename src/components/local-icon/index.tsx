import type { CSSProperties, HTMLAttributes } from 'react'

import boy from '@/src/icons/fluent-emoji-high-contrast/boy.svg'
import projectNew from '@/src/icons/ix/project-new.svg'
import alarmOutlineRounded from '@/src/icons/material-symbols/alarm-outline-rounded.svg'
import bookmarkStarOutline from '@/src/icons/material-symbols/bookmark-star-outline.svg'
import homeOutlineRounded from '@/src/icons/material-symbols/home-outline-rounded.svg'
import toolsWrenchOutlineSharp from '@/src/icons/material-symbols/tools-wrench-outline-sharp.svg'
import git from '@/src/icons/mdi/git.svg'
import license from '@/src/icons/mdi/license.svg'
import moonWaningCrescent from '@/src/icons/mdi/moon-waning-crescent.svg'
import whiteBalanceSunny from '@/src/icons/mdi/white-balance-sunny.svg'
import footLine from '@/src/icons/mingcute/foot-line.svg'
import wechatMiniprogramLine from '@/src/icons/mingcute/wechat-miniprogram-line.svg'
import envelope from '@/src/icons/mynaui/envelope.svg'
import darkTheme from '@/src/icons/proicons/dark-theme.svg'
import bloggerLine from '@/src/icons/ri/blogger-line.svg'
import githubFill from '@/src/icons/ri/github-fill.svg'
import historyLine from '@/src/icons/ri/history-line.svg'
import albumBold from '@/src/icons/solar/album-bold.svg'

interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  icon: string
  fontSize?: CSSProperties['fontSize']
}

const localIcons = {
  'fluent-emoji-high-contrast:boy': boy,
  'ix:project-new': projectNew,
  'material-symbols:alarm-outline-rounded': alarmOutlineRounded,
  'material-symbols:bookmark-star-outline': bookmarkStarOutline,
  'material-symbols:home-outline-rounded': homeOutlineRounded,
  'material-symbols:tools-wrench-outline-sharp': toolsWrenchOutlineSharp,
  'mdi:git': git,
  'mdi:license': license,
  'mdi:moon-waning-crescent': moonWaningCrescent,
  'mdi:white-balance-sunny': whiteBalanceSunny,
  'mingcute:foot-line': footLine,
  'mingcute:wechat-miniprogram-line': wechatMiniprogramLine,
  'mynaui:envelope': envelope,
  'proicons:dark-theme': darkTheme,
  'ri:blogger-line': bloggerLine,
  'ri:github-fill': githubFill,
  'ri:history-line': historyLine,
  'solar:album-bold': albumBold,
} as const

type LocalIconName = keyof typeof localIcons

const getIconUrl = (icon: string) => {
  const iconAsset = localIcons[icon as LocalIconName]
  return typeof iconAsset === 'string' ? iconAsset : iconAsset?.src
}

const Icon = ({ icon, fontSize, style, ...props }: IconProps) => {
  const iconUrl = getIconUrl(icon)

  if (!iconUrl) return null

  return (
    <span
      {...props}
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: '1em',
        height: '1em',
        flexShrink: 0,
        backgroundColor: 'currentColor',
        WebkitMaskImage: `url(${iconUrl})`,
        maskImage: `url(${iconUrl})`,
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        fontSize,
        ...style,
      }}
    />
  )
}

export { getIconUrl, Icon }
