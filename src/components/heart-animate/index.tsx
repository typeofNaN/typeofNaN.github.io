'use client'

import { useEffect } from 'react'
import { HeartAnimate } from 'click-love-heart'

export default function LoveHeart({ children }: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    new HeartAnimate()
  })
  return (
    <>
      {children}
    </>
  )
}