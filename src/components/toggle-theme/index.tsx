'use client'

import { useTheme } from 'next-themes'
import { MouseEvent, useCallback, useMemo } from 'react'
import { Icon } from '@iconify/react'

const themeIcons: Record<string, string> = {
  system: 'proicons:dark-theme',
  light: 'mdi-white-balance-sunny',
  dark: 'mdi-moon-waning-crescent'
}

const getNextTheme = (theme: string) => {
  if (theme === 'system') return 'light'
  if (theme === 'light') return 'dark'
  return 'system'
}

const ToggleTheme = () => {
  const { theme = 'system', setTheme } = useTheme()

  const handleClick = useCallback(
    async (event: MouseEvent<HTMLDivElement>) => {
      const nextTheme = getNextTheme(theme)
      const isDarkMode = theme === 'dark'
      const x = event.clientX
      const y = event.clientY

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )

      const transition = document.startViewTransition(() => {
        setTheme(nextTheme)
      })

      await transition.ready

      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ]

      document.documentElement.animate(
        {
          clipPath: isDarkMode ? clipPath : [...clipPath].reverse()
        },
        {
          duration: 300,
          easing: 'ease-in',
          pseudoElement: isDarkMode
            ? '::view-transition-new(root)'
            : '::view-transition-old(root)'
        }
      )
    },
    [theme, setTheme]
  )

  const icon = useMemo(() => themeIcons[theme] || themeIcons.system, [theme])

  return (
    <div
      className="flex-center w-30px h-30px text-primary cursor-pointer"
      onClick={handleClick}
      title="切换主题"
      aria-label="切换主题"
      role="button"
      tabIndex={0}
    >
      <Icon icon={icon} />
    </div>
  )
}

export default ToggleTheme
