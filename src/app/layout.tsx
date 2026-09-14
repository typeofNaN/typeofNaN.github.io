import type { Metadata } from 'next'
import Script from 'next/script'

import { CommonFooter, CommonHeader } from './components'
import LoveHeart from '@/src/components/heart-animate'
import ThemeProvider from '@/src/components/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'typeofNaN - 喜欢就是信仰，热爱会是力量',
  keywords: 'typeofNaN、六碗面、个人网站、前端技术开发、JavaScript 技术',
  description: '喜欢就是信仰，热爱会是力量',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="zh-CN" suppressHydrationWarning>
    <body>
      <Script id="theme-mode" strategy="beforeInteractive">
        {`try {
          const theme = localStorage.getItem('theme')
          document.documentElement.dataset.themeMode = ['light', 'dark'].includes(theme || '')
            ? theme
            : 'system'
        } catch (_) {
          document.documentElement.dataset.themeMode = 'system'
        }`}
      </Script>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <div className="site-background fixed inset-0 -z-1" />
        <LoveHeart>
          <CommonHeader />
          <main className="pt-[60px]">{children}</main>
          <CommonFooter />
        </LoveHeart>
      </ThemeProvider>
    </body>
  </html>
)

export default RootLayout
