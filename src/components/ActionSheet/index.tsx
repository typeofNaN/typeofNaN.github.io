import React, { Component } from 'react'
import PubSub from 'pubsub-js'

import './index.scss'
import StatusBar from '../StatusBar'
import SvgIcon from '../SvgIcon'
import WeChat from '../WeChat'
import FriendLink from '../FriendLink'
import { AppTypes } from '../../config/appType'

interface IProps {}

interface IState {
  top: string
  appType: string
}

export default class ActionSheet extends Component<IProps, IState> {
  private readonly AppTypes = AppTypes
  constructor(props: IProps) {
    super(props)
    this.state = {
      top: '100%',
      appType: ''
    }
  }

  componentDidMount(){
    PubSub.subscribe('openActionSheet', (msg: string, data: string) => {
      this.setState({
        appType: data
      })
      this.openActionSheet()
    })
  }

  openActionSheet = () => {
    this.setState({
      top: '0'
    })
  }

  closeActionSheet = () => {
    this.setState({
      top: '100%'
    })
  }

  actionSheetMain() {
    let renderDom
    switch (this.state.appType) {
      case 'wechat':
        renderDom = <WeChat />
        break
      case 'friendLink':
        renderDom = <FriendLink />
        break
      default:
        renderDom = null
        break
    }
    return renderDom
  }

  render() {
    const { appType } = this.state
    return (
      <div
        id="action_sheet"
        style={{top: this.state.top}}
      >
        <StatusBar color="303133" />
        <div
          className="back"
          onClick={() => this.closeActionSheet()}
        >
          <SvgIcon
            iconClass="back"
            className="back_icon"
          />
          {this.AppTypes[appType]}
        </div>
        <div className="action_sheet_main">
          {this.actionSheetMain()}
        </div>
      </div>
    )
  }
}