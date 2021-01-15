import github from '../assets/images/apps/github.png'
import blog from '../assets/images/apps/blog.png'
import email from '../assets/images/apps/email.png'
import music from '../assets/images/apps/music.png'
import map from '../assets/images/apps/map.png'
import contact from '../assets/images/apps/contact.png'

import typeofnan from '../assets/images/apps/typeofnan.png'
import visualEditing from '../assets/images/apps/visual-editing.png'
import blogfish from '../assets/images/apps/blogfish.png'
import dotnetcore from '../assets/images/apps/dotnetcore.png'

import hot from '../assets/images/apps/hot.png'
import nestService from '../assets/images/apps/nest-service.png'
import ice from '../assets/images/apps/ice.png'

import vueRipples from '../assets/images/apps/vue-ripples.png'
import oscli from '../assets/images/apps/oscli.png'
import devtool from '../assets/images/apps/devtool.png'

import waiting from '../assets/images/apps/waiting.png'

import phone from '../assets/images/apps/phone.png'
import message from '../assets/images/apps/message.png'
import b612 from '../assets/images/apps/b612.png'
import wechat from '../assets/images/apps/wechat.png'

export interface IApp {
  imgUrl: string
  name?: string
  link?: string
}

export interface IAppPage {
  name: string
  apps: Array<IApp>
}

export const mainApps: Array<IAppPage> = [
  {
    name: '社交网络',
    apps: [
      {
        imgUrl: github,
        name: 'GitHub',
        link: 'https://github.com/typeofNaN'
      },
      {
        imgUrl: blog,
        name: '博客',
        link: 'https://blog.typeofnan.com'
      },
      {
        imgUrl: email,
        name: '邮箱',
        link: 'mailto:dmdefine6@gmail.com'
      },
      {
        imgUrl: music,
        name: '音乐'
      },
      {
        imgUrl: map,
        name: '地址'
      },
      {
        imgUrl: contact,
        name: '友情链接'
      }
    ]
  },
  {
    name: '网页项目',
    apps: [
      {
        imgUrl: typeofnan,
        name: 'typeofNaN',
        link: 'https://github.com/typeofNaN/typeofNaN.github.io'
      },
      {
        imgUrl: visualEditing,
        name: '可视化编辑',
        link: 'https://github.com/typeofNaN/visual-editing'
      },
      {
        imgUrl: blogfish,
        name: 'Blog',
        link: 'https://github.com/typeofNaN/blog'
      },
      {
        imgUrl: dotnetcore,
        name: '.NetCore社区',
        link: 'https://github.com/typeofNaN/ncc-china'
      }
    ]
  },
  {
    name: 'Node/Deno项目',
    apps: [
      {
        imgUrl: hot,
        name: '热搜爬虫',
        link: 'https://github.com/typeofNaN/hot'
      },
      {
        imgUrl: nestService,
        name: 'Nest Api',
        link: 'https://github.com/typeofNaN/nest-service'
      },
      {
        imgUrl: ice,
        name: '压图助手',
        link: 'https://github.com/typeofNaN/compress-images'
      }
    ]
  },
  {
    name: 'NPM包',
    apps: [
      {
        imgUrl: vueRipples,
        name: 'vue ripples',
        link: 'https://github.com/typeofNaN/vue-ripples'
      },
      {
        imgUrl: oscli,
        name: 'OS CLI',
        link: 'https://github.com/typeofNaN/osinfo-cli'
      },
      {
        imgUrl: devtool,
        name: 'Dev Tools',
        link: 'https://github.com/typeofNaN/dev-tools'
      }
    ]
  },
  {
    name: '桌面应用',
    apps: [
      {
        imgUrl: waiting,
        name: '网愈云音乐',
        link: 'https://github.com/typeofNaN/waiting'
      }
    ]
  },
  {
    name: '微信小程序',
    apps: []
  }
]

export const bottomBarApps: Array<IApp> = [
  {
    imgUrl: phone
  },
  {
    imgUrl: message
  },
  {
    imgUrl: b612
  },
  {
    imgUrl: wechat
  }
]