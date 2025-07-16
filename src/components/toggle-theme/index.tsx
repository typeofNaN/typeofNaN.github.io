'use client'

import { useTheme } from 'next-themes'
import { MouseEvent } from 'react'
import { Icon } from '@iconify/react'

const ToggleTheme = () => {
  const { theme = 'system', setTheme } = useTheme()

  const handleClick = async (event: MouseEvent<HTMLDivElement>): Promise<void> => {
    const isDarkMode = theme === 'dark'
    const x = event.clientX
    const y = event.clientY

    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

    const transition = document.startViewTransition(() => {
      if (theme === 'system') {
        setTheme('light')
      } else if (theme === 'light') {
        setTheme('dark')
      } else {
        setTheme('system')
      }
    })

    await transition.ready

    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]

    document.documentElement.animate(
      {
        clipPath: isDarkMode ? clipPath : [...clipPath].reverse()
      },
      {
        duration: 300,
        easing: 'ease-in',
        pseudoElement: isDarkMode ? '::view-transition-new(root)' : '::view-transition-old(root)'
      }
    )
  }

  return (
    <div className="flex-center w-30px h-30px text-primary cursor-pointer" onClick={handleClick}>
      {theme === 'system' && <Icon icon="proicons:dark-theme" />}
      {theme === 'light' && <Icon icon="mdi-white-balance-sunny" />}
      {theme === 'dark' && <Icon icon="mdi-moon-waning-crescent" />}
    </div>
  )
}

export default ToggleTheme
