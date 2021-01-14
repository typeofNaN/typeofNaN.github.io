import React, { Component } from 'react'

import './index.scss'
import TimeBar from '../TimeBar'
import SvgIcon from '../SvgIcon'

interface IProps {}

interface IState {}

export default class StatusBar extends Component<IProps, IState> {
  private readonly statusIcon: Array<string> = ['wifi', 'singal', 'battery']

  render() {
    return (
      <div id="status_bar">
        <TimeBar />
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