import {defineConfig} from 'vitepress'

declare const process:
  | {
      env?: Record<string, string | undefined>
    }
  | undefined

const repoName = 'radiation-view-docs'
const base = process?.env?.DOCS_BASE || `/${repoName}/`

export default defineConfig({
  title: 'FSE Radiation View',
  description: 'Documentation for the FSE Radiation View',
  base,
  srcExclude: ['README.md', 'BUILD_SINGLE.md'],
  themeConfig: {
    search: {
      provider: 'local',
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'User Manual', link: '/user-manual' },
      { text: 'Tutorial', link: '/tutorial' },
      { text: 'Verification', link: '/verification' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'User Manual', link: '/user-manual' },
          { text: 'User Interface', link: '/user-interface-and-interaction' },
          { text: 'Tutorial', link: '/tutorial' },
          { text: 'Verification', link: '/verification' },
        ],
      },
    ],
    outline: { level: [2, 3] },
  },
})
