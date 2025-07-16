'use client'

import { useEffect } from 'react'
import { HeartAnimate } from 'click-love-heart'

const LoveHeart = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  useEffect(() => {
    new HeartAnimate()
  })
  return (
    <>
      {children}
    </>
  )
}

export default LoveHeart
