import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import '@unocss/reset/tailwind.css'

import { CommonFooter, CommonHeader, CommonSidebar } from './components'
import LoveHeart from '@/src/components/heart-animate'
import ThemeProvider from '@/src/components/theme-provider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'typeofNaN - 喜欢就是信仰，热爱会是力量',
  keywords: 'typeofNaN、六碗面、个人网站、前端技术开发、JavaScript 技术',
  description: '喜欢就是信仰，热爱会是力量'
}

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="zh-CN" suppressHydrationWarning>
    <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {/* 背景层 */}
        <div className="fixed top-0 left-0 w-full h-full z--1 bg-#e3e3e3 dark:bg-#000">
          <div className="main-bg absolute inset-0 opacity-30 dark:opacity-20" />
        </div>
        <LoveHeart>
          <AntdRegistry>
            <CommonHeader />
            <div className="flex gap-20px relative py-80px px-20px container m-auto overflow-y-auto">
              <CommonSidebar />
              <main className="flex-1 pl-300px w-full">
                {children}
              </main>
            </div>
            <CommonFooter />
          </AntdRegistry>
        </LoveHeart>
      </ThemeProvider>
    </body>
  </html>
)

export default RootLayout
