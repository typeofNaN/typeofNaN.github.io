import React, { Component } from 'react'

import './index.scss'
import { IApp } from '../../config/apps'

interface IProps {
  app: IApp
}

interface IState {}

export default class Application extends Component<IProps, IState> {
  render() {
    const { name, imgUrl, link } = this.props.app
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
      : <div className="application">
          <img src={imgUrl} alt=""/>
          {appName}
        </div>
    return render
  }
}