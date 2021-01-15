import React, { Component } from 'react'

import './index.scss'
import StatusBar from '../../components/StatusBar'
import SwipperApp from '../../components/SwipperApp'
import BottomBar from '../../components/BottomBar'

export default class Mobile extends Component {
  render() {
    return (
      <>
        <div id="mobile">
          <StatusBar></StatusBar>
          <SwipperApp></SwipperApp>
          <BottomBar></BottomBar>
        </div>
      </>
    )
  }
}