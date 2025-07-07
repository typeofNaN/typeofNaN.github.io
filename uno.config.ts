import { defineConfig, presetWind3, transformerDirectives } from 'unocss'
import { presetAntd, commonShortcut } from 'unocss-config'

export default defineConfig({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist', '.git', '.husky', '.vscode', 'public', 'build', 'mock', './stats.html']
    }
  },
  presets: [
    presetWind3(),
    presetAntd()
  ],
  transformers: [transformerDirectives()],
  shortcuts: {
    ...commonShortcut
  }
})
