import React, { Component } from 'react'

import './index.scss'
import SvgIcon from '../SvgIcon'
import { nowTime } from '../../utils/tools'

interface IProps {}

interface IState {
  time: string
}

export default class StatusBar extends Component<IProps, IState> {
  private readonly statusIcon: Array<string> = ['singal', 'wifi', 'battery']

  private timer: any = null

  constructor(props: any) {
    super(props)
    this.state = {
      time: nowTime()
    }
  }

  componentDidMount() {
    this.timer = setInterval(
      () => {
        this.setState({
          time: nowTime()
        })
      },
      60000
    )
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer)
  }

  render() {
    const { time } = this.state
    return (
      <div id="status_bar">
        <span className="time_bar">{time}</span>
        <div className="status_icons">
          {
            this.statusIcon.map((icon: string) => 
              <SvgIcon
                iconClass={icon}
                key={icon}
                className="status_icon"
              />
            )
          }
        </div>
      </div>
    )
  }
}