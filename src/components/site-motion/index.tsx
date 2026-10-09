'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const SiteMotion = () => {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const observed = new WeakSet<Element>()
    const revealObserver = reduceMotion
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return
              entry.target.classList.add('is-visible')
              revealObserver?.unobserve(entry.target)
            })
          },
          { rootMargin: '0px 0px -9% 0px', threshold: 0.08 },
        )

    const registerRevealTargets = () => {
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
        if (observed.has(element)) return
        observed.add(element)
        if (reduceMotion) element.classList.add('is-visible')
        else revealObserver?.observe(element)
      })
    }

    registerRevealTargets()
    const mutationObserver = new MutationObserver(registerRevealTargets)
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    let animationFrame = 0
    const updatePointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(() => {
        root.style.setProperty('--pointer-x', `${event.clientX}px`)
        root.style.setProperty('--pointer-y', `${event.clientY}px`)
        root.style.setProperty('--pointer-opacity', '1')
      })
    }
    const hidePointer = () => root.style.setProperty('--pointer-opacity', '0')

    window.addEventListener('pointermove', updatePointer, { passive: true })
    document.documentElement.addEventListener('mouseleave', hidePointer)

    return () => {
      cancelAnimationFrame(animationFrame)
      mutationObserver.disconnect()
      revealObserver?.disconnect()
      window.removeEventListener('pointermove', updatePointer)
      document.documentElement.removeEventListener('mouseleave', hidePointer)
    }
  }, [pathname])

  return <div className="site-pointer-glow" aria-hidden="true" />
}

export default SiteMotion
