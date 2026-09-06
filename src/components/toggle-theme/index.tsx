'use client'

import { useTheme } from 'next-themes'
import { MouseEvent, useCallback, useEffect } from 'react'
import { preload } from 'react-dom'

import { getIconUrl, Icon } from '@/src/components/local-icon'

const themeIcons: Record<string, string> = {
  system: 'proicons:dark-theme',
  light: 'mdi:white-balance-sunny',
  dark: 'mdi:moon-waning-crescent',
}

const getNextTheme = (theme: string) => {
  if (theme === 'system') return 'light'
  if (theme === 'light') return 'dark'
  return 'system'
}

const ToggleTheme = () => {
  Object.values(themeIcons).forEach((icon) => {
    const iconUrl = getIconUrl(icon)
    if (iconUrl) preload(iconUrl, { as: 'image', fetchPriority: 'high' })
  })

  const { theme = 'system', setTheme } = useTheme()

  useEffect(() => {
    document.documentElement.dataset.themeMode = theme
  }, [theme])

  const handleClick = useCallback(
    async (event: MouseEvent<HTMLDivElement>) => {
      const nextTheme = getNextTheme(theme)
      const isDarkMode = theme === 'dark'
      const x = event.clientX
      const y = event.clientY

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      )

      const transition = document.startViewTransition(() => {
        document.documentElement.dataset.themeMode = nextTheme
        setTheme(nextTheme)
      })

      await transition.ready

      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]

      document.documentElement.animate(
        {
          clipPath: isDarkMode ? clipPath : [...clipPath].reverse(),
        },
        {
          duration: 300,
          easing: 'ease-in',
          pseudoElement: isDarkMode ? '::view-transition-new(root)' : '::view-transition-old(root)',
        },
      )
    },
    [theme, setTheme],
  )

  return (
    <div
      className="flex-center w-30px h-30px text-primary cursor-pointer"
      onClick={handleClick}
      title="切换主题"
      aria-label="切换主题"
      role="button"
      tabIndex={0}
    >
      <Icon icon={themeIcons.system} className="theme-mode-icon theme-mode-icon-system" />
      <Icon icon={themeIcons.light} className="theme-mode-icon theme-mode-icon-light" />
      <Icon icon={themeIcons.dark} className="theme-mode-icon theme-mode-icon-dark" />
    </div>
  )
}

export default ToggleTheme
