export interface IWechatMsg {
  id: number
  msg: string
  answer: Array<IAnswer>
}

export interface IAnswer {
  msg: string
  nextTo: number
}

export const wechatMsg: Array<IWechatMsg> = [
  {
    id: 0,
    msg: '嗨，很高兴见到你啊！',
    answer: [
      {
        msg: '我也是',
        nextTo: 1
      },
      {
        msg: '诶？这对话让我觉得有点似曾相识……',
        nextTo: 2
      }
    ]
  },
  {
    id: 1,
    msg: '祝贺你捡到了我的手机',
    answer: []
  },
  {
    id: 2,
    msg: '看起来是我的老粉丝啊！',
    answer: []
  },
]