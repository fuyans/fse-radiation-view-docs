import {defineConfig} from 'vitepress'

declare const process:
  | {
      env?: Record<string, string | undefined>
    }
  | undefined

// Use relative base by default so built docs assets work on subpaths.
const base = process?.env?.DOCS_BASE ?? './'

export default defineConfig({
  title: 'FSE Radiation View',
  description: 'Documentation for the FSE Radiation View',
  base,
  srcExclude: ['README.md'],
  markdown: {
    math: true,
  },
  themeConfig: {
    editLink: {
      pattern: 'https://github.com/fuyans/fse-radiation-view-docs/edit/main/:path',
      text: 'Edit source',
    },
    search: {
      provider: 'local',
    },
    nav: [
      {
        text: 'Guide',
        items: [
          { text: 'User Manual', link: '/user-manual' },
          { text: 'User Interface', link: '/ui-and-ux' },
          { text: 'Tutorial', link: '/tutorial' },
          { text: 'Verification', link: '/verification' },
        ],
      },
      {
        text: 'Reference',
        items: [
          {
            text: 'Radiation heat transfer',
            link: '/reference-radiation-heat-transfer',
          },
          { text: 'Ray casting', link: '/reference-ray-casting' },
        ],
      },
    ],
    sidebar: {
      '/reference': [
        {
          text: 'Reference',
          items: [
            { text: 'Radiation heat transfer', link: '/reference-radiation-heat-transfer' },
            { text: 'Ray casting', link: '/reference-ray-casting' },
          ],
        },
      ],
      '/': [
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
    },
    outline: { level: [2, 3] },
  },
})
