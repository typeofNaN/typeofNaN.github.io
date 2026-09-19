declare module 'page-flip' {
  interface PageFlipEvent<T> {
    data: T
  }
  interface PageFlipSettings {
    width: number
    height: number
    size?: 'fixed' | 'stretch'
    minWidth?: number
    maxWidth?: number
    minHeight?: number
    maxHeight?: number
    drawShadow?: boolean
    flippingTime?: number
    usePortrait?: boolean
    startPage?: number
    startZIndex?: number
    autoSize?: boolean
    maxShadowOpacity?: number
    showCover?: boolean
    mobileScrollSupport?: boolean
    swipeDistance?: number
    clickEventForward?: boolean
    useMouseEvents?: boolean
    showPageCorners?: boolean
    disableFlipByClick?: boolean
  }
  export class PageFlip {
    constructor(element: HTMLElement, settings: PageFlipSettings)
    loadFromHTML(elements: NodeListOf<HTMLElement> | HTMLElement[]): void
    flipNext(corner?: 'top' | 'bottom'): void
    flipPrev(corner?: 'top' | 'bottom'): void
    turnToPage(page: number): void
    on(event: 'flip', handler: (event: PageFlipEvent<number>) => void): PageFlip
    on(event: 'changeState', handler: (event: PageFlipEvent<string>) => void): PageFlip
    destroy(): void
  }
}
