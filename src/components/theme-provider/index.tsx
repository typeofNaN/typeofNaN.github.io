'use client'

import type { FC, PropsWithChildren } from 'react'
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes'

const ThemeProvider: FC<PropsWithChildren<ThemeProviderProps>> = ({ children, ...props }) => (
  <NextThemesProvider {...props}>{children}</NextThemesProvider>
)

export default ThemeProvider
