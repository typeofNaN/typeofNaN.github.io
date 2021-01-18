import React, { Component } from 'react'
import PubSub from 'pubsub-js'

import './index.scss'
import { IApp } from '../../config/apps'

interface IProps {
  app: IApp
}

interface IState {}

export default class Application extends Component<IProps, IState> {
  openActionSheet = (appType: string) => {
    PubSub.publish('openActionSheet', appType)
  }

  render() {
    const { name, imgUrl, link, type = '' } = this.props.app
    const appName = name
      ? <p className="app_name">{name}</p>
      : null
    const render = link
      ? <a
          href={link}
          className="application"
          target="_blank"
          rel="noreferrer"
        >
          <img src={imgUrl} alt=""/>
          {appName}
        </a>
      : <div
          className="application"
          onClick={() => this.openActionSheet(type)}
        >
          <img src={imgUrl} alt=""/>
          {appName}
        </div>
    return render
  }
}