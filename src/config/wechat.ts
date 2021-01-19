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
    answer: [
      {
        msg: '哈哈哈，你真有趣',
        nextTo: 3
      },
      {
        msg: '你是谁？怎么联系你？',
        nextTo: 4
      }
    ]
  },
  {
    id: 2,
    msg: '看起来是我的老粉丝啊！',
    answer: [
      {
        msg: '必须的，铁粉无疑！忠实粉丝！',
        nextTo: 3
      }
    ]
  },
  {
    id: 3,
    msg: '这是我的个人网站，也是一个手机，里面的每个 App 都是关于我的一个角度。比如，GitHub App 会链接到我的 GitHub 网页。你可以去体验一下！',
    answer: [
      {
        msg: '这看起来好酷！',
        nextTo: 5
      },
      {
        msg: '炫酷！！！爆表',
        nextTo: 5
      }
    ]
  },
  {
    id: 4,
    msg: '我是TypeofNaN，一名前端程序员，可以在手机首页的GitHub或邮箱找到我',
    answer: [
      {
        msg: '可以可以，我要去关注一波',
        nextTo: 5
      }
    ]
  },
  {
    id: 5,
    msg: '谢谢你的认可，我会努力做的更好！！！',
    answer: [
      {
        msg: '为什么会做这个项目？',
        nextTo: 6
      }
    ]
  },
  {
    id: 6,
    msg: '首先作为一个前端程序员，做的东西是直接呈现给用户看的，所以对用户体验来说很重要。现如今每一个人已经越来越离不开手机，所以我就想把自己的个人网站设计成类似于一个手机，用这种的展现方式让每一个看到它的人都有一种亲切感',
    answer: [
      {
        msg: '相法很不错！！',
        nextTo: 7
      },
      {
        msg: '「看机会」吗？',
        nextTo: 8
      }
    ]
  },
  {
    id: 7,
    msg: '再次感谢你对我的肯定！',
    answer: [
      {
        msg: '怎么感觉你在自言自语',
        nextTo: 9
      },
      {
        msg: '嗯......你应该挺无聊的吧......',
        nextTo: 10
      }
    ]
  },
  {
    id: 8,
    msg: '不会吧不会吧不会吧？这里先判断一下你是不是老板？如果钱多事少离家近，也不是不可以考虑，但是如果钱比现在少，活比现在多，离家比现在远，吸引我的动力是什么？我的理想就是钱多事少离家近。这里再判断一下老板？老板，上面这句话没错吧。嗯？',
    answer: [
      {
        msg: '那你现在在哪呢？',
        nextTo: 11
      },
      {
        msg: '哈哈哈，我也是个打工人',
        nextTo: 12
      }
    ]
  },
  {
    id: 9,
    msg: '如果你没有跟着我思考的话，我的确是在自言自语吧......',
    answer: [
      {
        msg: '确实，哈哈哈',
        nextTo: 13
      }
    ]
  },
  {
    id: 10,
    msg: '你居然还在看，是不是说明你也挺无聊的哈哈哈......',
    answer: [
      {
        msg: '确实，哈哈哈',
        nextTo: 13
      }
    ]
  },
  {
    id: 11,
    msg: '我现在在广州，如果条件合适也不是不可以去其他城市，如果你执意要联系我的话，可以通过邮箱 dmdefine6@gmail.com 联系我，我会回复的',
    answer: [
      {
        msg: '好，有需要我会联系你的',
        nextTo: 7
      },
      {
        msg: '我只是看看...',
        nextTo: 13
      }
    ]
  },
  {
    id: 12,
    msg: '打工人，打工魂，打工都是人上人，yes!',
    answer: [
      {
        msg: '棒',
        nextTo: 7
      }
    ]
  },
  {
    id: 13,
    msg: '如果你有时间的话，以后可以多来看看我啊',
    answer: [
      {
        msg: '没问题',
        nextTo: 14
      },
      {
        msg: '我不敢承诺',
        nextTo: 14
      },
      {
        msg: '我可能不会再来了',
        nextTo: 14
      }
    ]
  },
  {
    id: 14,
    msg: '好的，那么再见了，感谢你对我的关注',
    answer: [
      {
        msg: '再见',
        nextTo: 15
      }
    ]
  },
  {
    id: 15,
    msg: '...',
    answer: []
  }
]