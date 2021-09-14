import React, { Component } from 'react'

import StatusBar from '../../components/StatusBar'
import SwipperApp from '../../components/SwipperApp'
import BottomBar from '../../components/BottomBar'
import ActionSheet from '../../components/ActionSheet'
import './index.scss'

export default class Mobile extends Component {
  render() {
    return (
      <>
        <div id="mobile">
          <StatusBar />
          <SwipperApp />
          <BottomBar />
          <ActionSheet />
        </div>
      </>
    )
  }
}