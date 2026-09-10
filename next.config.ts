import type { NextConfig } from 'next'

import packageJson from './package.json'

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_AUTHOR_NAME: packageJson.author.name,
    NEXT_PUBLIC_GITHUB_LINK: packageJson.author.url,
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          antd: {
            test: /[\\/]node_modules[\\/](@ant-design|antd|rc-|@rc-component)[\\/]/,
            name: 'vendor-antd',
            chunks: 'all',
            priority: 30,
          },
          icons: {
            test: /[\\/]node_modules[\\/](@icons-pack|lucide-react)[\\/]/,
            name: 'vendor-icons',
            chunks: 'all',
            priority: 20,
          },
        },
      }
    }

    return config
  },
}

export default nextConfig
