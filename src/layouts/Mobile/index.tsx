import React, { Component } from 'react'

import './index.scss'
import StatusBar from '../../components/StatusBar'

export default class Mobile extends Component {
  render() {
    return (
      <>
        <div id="mobile">
          <StatusBar></StatusBar>
        </div>
      </>
    )
  }
}