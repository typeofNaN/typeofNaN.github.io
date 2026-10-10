'use client'

import { useEffect, useRef } from 'react'

const contourPaths = [
  'M772 68C655 14 514 25 424 92c-94 70-100 178-21 231 72 48 196 35 284-26 84-59 151-58 221-24',
  'M796 92C680 43 548 51 462 111c-85 59-93 148-25 194 65 44 176 30 257-23 85-56 158-56 224-25',
  'M817 119c-109-42-230-33-311 19-73 48-82 117-27 157 58 41 156 29 229-18 81-52 153-50 218-20',
  'M838 148c-99-36-211-27-283 18-61 39-70 92-26 126 49 37 134 26 198-15 75-48 144-45 205-18',
  'M858 177c-91-30-190-20-252 18-48 30-56 67-25 94 40 33 112 23 167-12 68-43 132-39 188-15',
]

const HeroArtScene = () => {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const interactionRoot = host.closest<HTMLElement>('.home-hero') ?? host
    let frame = 0
    let targetX = 0
    let targetY = 0
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

    const commitPointer = () => {
      frame = 0
      host.style.setProperty('--paper-x', targetX.toFixed(3))
      host.style.setProperty('--paper-y', targetY.toFixed(3))
    }
    const move = (event: PointerEvent) => {
      if (reducedMotion) return
      const bounds = interactionRoot.getBoundingClientRect()
      targetX = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2))
      targetY = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2))
      if (!frame) frame = requestAnimationFrame(commitPointer)
    }
    const leave = () => {
      targetX = 0
      targetY = 0
      if (!frame) frame = requestAnimationFrame(commitPointer)
    }

    interactionRoot.addEventListener('pointermove', move, { passive: true })
    interactionRoot.addEventListener('pointerleave', leave)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      interactionRoot.removeEventListener('pointermove', move)
      interactionRoot.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <div
      ref={hostRef}
      className="paper-landscape absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="paper-landscape__svg"
        viewBox="0 0 1000 440"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="paper-shadow" x="-30%" y="-40%" width="170%" height="190%">
            <feDropShadow
              dx="0"
              dy="10"
              stdDeviation="12"
              floodColor="var(--paper-shadow)"
              floodOpacity=".28"
            />
          </filter>
          <filter id="paper-soft-shadow" x="-30%" y="-40%" width="170%" height="190%">
            <feDropShadow
              dx="0"
              dy="5"
              stdDeviation="7"
              floodColor="var(--paper-shadow)"
              floodOpacity=".2"
            />
          </filter>
          <linearGradient id="paper-sage" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="var(--paper-sage-light)" />
            <stop offset="1" stopColor="var(--paper-sage)" />
          </linearGradient>
          <linearGradient id="paper-ink" x1="0" y1="0" x2=".9" y2="1">
            <stop stopColor="var(--paper-ink-soft)" />
            <stop offset="1" stopColor="var(--paper-ink)" />
          </linearGradient>
          <clipPath id="deep-paper-clip">
            <path d="M390 298c70-85 164-132 266-125 95 6 140 59 235 43 52-9 90-35 129-72v296H360c-24-42-7-96 30-142Z" />
          </clipPath>
        </defs>

        <g className="paper-layer paper-layer--back" filter="url(#paper-soft-shadow)">
          <path
            fill="var(--paper-cream)"
            d="M466-32c81 45 125 98 221 103 105 6 190-51 333-72v170c-86 23-154 28-222 7-104-32-170-9-234 35-70 49-136 60-203 30-76-34-93-104-55-166 34-55 87-78 160-107Z"
          />
        </g>
        <g className="paper-layer paper-layer--middle" filter="url(#paper-shadow)">
          <path
            fill="url(#paper-sage)"
            d="M407 37c83 5 131 61 210 85 92 28 168-8 269-15 55-4 99 1 134 12v160c-69-36-125-52-198-35-104 24-177 77-283 64-89-11-169-68-179-142-8-58 9-106 47-129Z"
          />
        </g>
        <g className="paper-layer paper-layer--front" filter="url(#paper-shadow)">
          <path
            fill="url(#paper-ink)"
            d="M390 298c70-85 164-132 266-125 95 6 140 59 235 43 52-9 90-35 129-72v296H360c-24-42-7-96 30-142Z"
          />
          <g
            clipPath="url(#deep-paper-clip)"
            fill="none"
            stroke="var(--paper-contour)"
            strokeWidth="1.2"
            opacity=".52"
          >
            {contourPaths.map((path) => (
              <path key={path} d={path} />
            ))}
            {contourPaths.map((path) => (
              <path key={`lower-${path}`} d={path} transform="translate(-50 105) scale(1.13)" />
            ))}
          </g>
        </g>
        <g className="paper-layer paper-layer--top" filter="url(#paper-soft-shadow)">
          <path
            fill="var(--paper-cream)"
            d="M586-30c27 71 75 108 151 124 82 17 176-12 283-38v80c-75 23-147 32-215 14-87-23-140-69-219-87-61-14-120-1-190 33-24-22-26-48-6-72 44-52 118-70 196-54Z"
          />
        </g>

        <path
          className="paper-path-shadow"
          d="M1007 80c-92 47-145 89-166 132-19 39-6 72 33 101 39 29 45 66 8 123"
        />
        <path
          className="paper-path"
          d="M1007 80c-92 47-145 89-166 132-19 39-6 72 33 101 39 29 45 66 8 123"
        />
        <circle className="paper-path__origin" cx="1005" cy="81" r="4.5" />
        <g className="paper-wayfinder">
          <circle cx="840" cy="213" r="16" fill="var(--paper-marker-halo)" />
          <circle cx="840" cy="213" r="4" fill="var(--paper-accent)" />
        </g>
      </svg>
      <span className="paper-grain" />
    </div>
  )
}

export default HeroArtScene
