import React, { Component } from 'react'

import SvgIcon from '../SvgIcon'
import { nowTime } from '../../utils/tools'
import './index.scss'

interface IProps {
  color?: string
}

interface IState {
  time: string
}

export default class StatusBar extends Component<IProps, IState> {
  private readonly statusIcon: Array<string> = ['singal', 'wifi', 'battery']

  private timer: any = null

  constructor(props: IProps) {
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
    const { color = '#fff' } = this.props
    const { time } = this.state
    return (
      <div
        id="status_bar"
        style={{ color }}
      >
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