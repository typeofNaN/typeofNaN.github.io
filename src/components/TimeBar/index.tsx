import React, { Component } from 'react'

import './index.scss'
import { nowTime } from '../../utils/tools'

interface IProps {}

interface IState {
  time: string
}

export default class TimeBar extends Component<IProps, IState> {
  private timer: any
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
    return (
      <span className="time_bar">{ this.state.time }</span>
    )
  }
}