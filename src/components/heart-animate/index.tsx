'use client'

import { useEffect, useRef } from 'react'
import { HeartAnimate } from 'click-love-heart'

const LoveHeart = ({ children }: { children: React.ReactNode }) => {
  const heartInstance = useRef<HeartAnimate | null>(null)

  useEffect(() => {
    // 避免多次实例化
    if (!heartInstance.current) {
      heartInstance.current = new HeartAnimate()
    }
    // 可选：组件卸载时清理
    return () => {
      heartInstance.current = null
    }
  }, [])

  return <>{children}</>
}

export default LoveHeart
