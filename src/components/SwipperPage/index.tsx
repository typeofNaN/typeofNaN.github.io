import React, { Component } from 'react'

import './index.scss'
import Application from '../Application'
import { IAppPage, IApp } from '../../config/apps'

interface IProps {
  pageData: IAppPage,
  pageIdx: number
}

interface IState {}

export default class SwipperPage extends Component<IProps, IState> {
  render() {
    const { pageIdx, pageData } = this.props
    const { name, apps } = pageData
    return (
      <div
        className="swipper_page"
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
                <Application app={app}></Application>
              </div>
            )
          })
        }
        </div>
      </div>
    )
  }
}