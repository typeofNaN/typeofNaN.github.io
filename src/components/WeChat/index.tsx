import React, { Component } from 'react'

import './index.scss'
import SvgIcon from '../SvgIcon'
import { wechatMsg, IAnswer } from '../../config/wechat'

interface IMsg {
  content: string
  from: number
}

interface IProps { }

interface IState {
  wechatMsgList: Array<IMsg>
  answerList: Array<IAnswer>
  showAnswer: boolean
}

export default class WeChat extends Component<IProps, IState> {
  private readonly wechatMsg = wechatMsg

  constructor(props: IProps) {
    super(props)
    this.state = {
      wechatMsgList: [],
      answerList: [],
      showAnswer: false
    }
  }

  componentDidMount() {
    const msg: IMsg = {
      content: this.wechatMsg[0].msg,
      from: 0
    }
    const answerList = this.wechatMsg[0].answer
    this.setState({
      wechatMsgList: [msg],
      answerList
    })
  }

  getAnswer = () => {
    this.setState({
      showAnswer: true
    })
  }

  closeAnswer = () => {
    this.setState({
      showAnswer: false
    })
  }

  clickAnswer = (answer: IAnswer) => {
    const { msg, nextTo } = answer
    const { wechatMsgList } = this.state
    wechatMsgList.push({
      content: msg,
      from: 1
    })
    this.setState({
      showAnswer: false,
      wechatMsgList
    })

    setTimeout(() => {
      wechatMsgList.push({
        content: this.wechatMsg[nextTo].msg,
        from: 0
      })
      const answerList = this.wechatMsg[nextTo].answer
      this.setState({
        wechatMsgList,
        answerList
      })
    }, 1000)
  }

  render() {
    const { wechatMsgList, showAnswer, answerList } = this.state
    return (
      <div id="wechat">
        <div className="chat_list">
          {
            wechatMsgList.map((msg: IMsg, index: number) =>
              <div
                className={msg.from === 0 ? 'msg_item me' : 'msg_item you'}
                key={index}
              >
                <div className="msg_content">{msg.content}</div>
              </div>
            )
          }
        </div>
        <div className="answer_box">
          <div className={showAnswer ? 'answer_tip no_close' : 'answer_tip show_close'}>
            <p onClick={() => this.getAnswer()}>说点什么...</p>
            <span onClick={() => this.closeAnswer()}>
              <SvgIcon
                iconClass="close"
                className="close_icon"
              />
            </span>
          </div>
          <div
            className="answer_list"
            style={{ display: showAnswer ? 'block' : 'none' }}
          >
            {
              answerList.map((answer: IAnswer, index) =>
                <div
                  className="answer_item"
                  key={index}
                  onClick={() => this.clickAnswer(answer)}
                >{answer.msg}</div>
              )
            }
          </div>
        </div>
      </div>
    )
  }
}