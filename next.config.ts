import type { NextConfig } from 'next'

import packageJson from './package.json'

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_AUTHOR_NAME: packageJson.author.name,
    NEXT_PUBLIC_GITHUB_LINK: packageJson.author.url
  }
}

export default nextConfig
