import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import '@unocss/reset/tailwind.css'

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  )
}
