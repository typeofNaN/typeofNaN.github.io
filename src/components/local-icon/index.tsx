import { SiGithub, SiGit, SiWechat } from '@icons-pack/react-simple-icons'
import {
  AlarmClock,
  Album,
  BadgeCheck,
  Footprints,
  FolderPlus,
  History,
  House,
  Mail,
  MonitorCog,
  Moon,
  NotebookPen,
  Scale,
  Sun,
  Gift,
  Wrench,
} from 'lucide-react'
import type { ComponentProps, CSSProperties } from 'react'

interface IconProps extends ComponentProps<'svg'> {
  icon: string
  fontSize?: CSSProperties['fontSize']
  size?: string | number
}

const icons = {
  'fluent-emoji-high-contrast:boy': Gift,
  'ix:project-new': FolderPlus,
  'material-symbols:alarm-outline-rounded': AlarmClock,
  'material-symbols:bookmark-star-outline': BadgeCheck,
  'material-symbols:home-outline-rounded': House,
  'material-symbols:tools-wrench-outline-sharp': Wrench,
  'mdi:git': SiGit,
  'mdi:license': Scale,
  'mdi:moon-waning-crescent': Moon,
  'mdi:white-balance-sunny': Sun,
  'mingcute:foot-line': Footprints,
  'mingcute:wechat-miniprogram-line': SiWechat,
  'mynaui:envelope': Mail,
  'proicons:dark-theme': MonitorCog,
  'ri:blogger-line': NotebookPen,
  'ri:github-fill': SiGithub,
  'ri:history-line': History,
  'solar:album-bold': Album,
} as const

type LocalIconName = keyof typeof icons

const Icon = ({ icon, fontSize, size, style, ...props }: IconProps) => {
  const IconComponent = icons[icon as LocalIconName]

  if (!IconComponent) return null

  return (
    <IconComponent
      {...props}
      aria-hidden="true"
      size={size ?? fontSize ?? '1em'}
      style={{
        display: 'inline-block',
        width: '1em',
        height: '1em',
        flexShrink: 0,
        verticalAlign: '-0.125em',
        ...style,
      }}
    />
  )
}

export { Icon }
