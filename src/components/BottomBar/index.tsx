import React, { Component } from 'react'

import Application from '../Application'
import { bottomBarApps, IApp } from '../../config/apps'
import './index.scss'

export default class BottomBar extends Component {
  private readonly appList = bottomBarApps
  render() {
    return (
      <div id="bottom_bar">
        {
          this.appList.map((app: IApp, index: number) => {
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
    )
  }
}