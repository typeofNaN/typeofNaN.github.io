import type { Metadata } from 'next'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import Script from 'next/script'
import '@unocss/reset/tailwind.css'

import { CommonFooter, CommonHeader } from './components'
import AntdTheme from '@/src/components/antd-theme'
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
        {/* 背景层 */}
        <div className="fixed top-0 left-0 w-full h-full z--1 bg-#e3e3e3 dark:bg-#000">
          <div className="main-bg absolute inset-0 opacity-30 dark:opacity-20" />
        </div>
        <LoveHeart>
          <AntdRegistry>
            <AntdTheme>
              <CommonHeader />
              <main className="py-60px">{children}</main>
              <CommonFooter />
            </AntdTheme>
          </AntdRegistry>
        </LoveHeart>
      </ThemeProvider>
    </body>
  </html>
)

export default RootLayout
