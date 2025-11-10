'use client'

import { ConfigProvider, theme } from 'antd'
import { useTheme } from 'next-themes'

const AntdTheme = ({ children }: { children: React.ReactNode }) => {
  const { theme: appTheme } = useTheme()

  return <ConfigProvider theme={{ algorithm: appTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm }}>{children}</ConfigProvider>
}

export default AntdTheme
