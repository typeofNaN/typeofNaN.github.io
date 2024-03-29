import React, { Component } from 'react'

import Application from '../Application'
import { IAppPage, IApp } from '../../config/apps'
import './index.scss'

interface IProps {
  pageData: IAppPage,
  pageIdx: number
}

interface IState { }

export default class SwiperPage extends Component<IProps, IState> {
  render() {
    const { pageIdx, pageData } = this.props
    const { name, apps } = pageData
    return (
      <div
        className="swiper_page"
        style={{
          left: pageIdx * 100 + '%'
        }}
      >
        <div className="app_group">{name}</div>
        <div className="app_list">
          {
            apps.map((app: IApp, index: number) => {
              return (
                <div
                  className="app_item"
                  key={index}
                >
                  <Application app={app} />
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}