export interface ILinkItem {
  name: string
  url: string
}

export interface ILinks {
  type: string
  links: Array<ILinkItem>
}

export const feLinks: Array<ILinks> = [
  {
    type: '官方文档',
    links: [
      {
        name: 'React.js官方中文文档',
        url: 'https://react.docschina.org/'
      },
      {
        name: 'Vue.js中文文档',
        url: 'https://cn.vuejs.org/'
      },
      {
        name: 'TypeScript中文文档',
        url: 'https://www.tslang.cn/'
      },
      {
        name: 'Deno',
        url: 'https://deno.land/'
      }
    ]
  },
  {
    type: '博客站点',
    links: [
      {
        name: '阮一峰的网络日志',
        url: 'http://www.ruanyifeng.com/blog/'
      }
    ]
  }
]