import React, { Component } from 'react'

import SwipperPage from '../SwipperPage'
import { mainApps, IAppPage } from '../../config/apps'
import './index.scss'

interface IProps { }

interface IState {
  pageIdx: number,
  isMouseDown: boolean,
  lastMoveX: number
  lastDownX: number
}

export default class SwipperApp extends Component<IProps, IState> {
  private readonly mainApps = mainApps

  constructor(props: IProps) {
    super(props)
    this.state = {
      pageIdx: 0,
      isMouseDown: false,
      lastMoveX: 0,
      lastDownX: 0
    }
  }

  mouseDown = (event: any) => {
    this.setState({
      isMouseDown: true,
      lastMoveX: event.clientX,
      lastDownX: event.clientX
    })
  }

  touchStart = (event: any) => {
    this.mouseDown(event.touches[0])
  }

  mouseMove = (event: any) => {
    if (this.state.isMouseDown) {
      this.setState({
        lastMoveX: event.clientX
      })
    }
  }

  touchMove = (event: any) => {
    this.mouseMove(event.changedTouches[0])
  }

  mouseUp = (event: any) => {
    if (!this.state.isMouseDown) {
      return
    }

    if (this.state.lastDownX - event.clientX > 50) {
      let pageIdx = this.state.pageIdx + 1
      if (pageIdx === this.mainApps.length) {
        return
      }
      this.setState({
        pageIdx
      })
    } else if (this.state.lastDownX - event.clientX < -50) {
      let pageIdx = this.state.pageIdx - 1
      if (pageIdx < 0) {
        return
      }
      this.setState({
        pageIdx
      })
    }

    this.setState({
      isMouseDown: false,
      lastDownX: 0,
      lastMoveX: 0
    })
  }

  touchEnd = (event: any) => {
    this.mouseUp(event.changedTouches[0])
  }

  render() {
    const { pageIdx } = this.state
    return (
      <div id="swipper_app">
        <div
          className="swipper_pages"
          onMouseDown={this.mouseDown}
          onMouseMove={this.mouseMove}
          onMouseUp={this.mouseUp}
          onMouseLeave={this.mouseUp}
          onTouchStart={this.touchStart}
          onTouchMove={this.touchMove}
          onTouchEnd={this.touchEnd}
          style={{
            left: -pageIdx * 100 + '%'
          }}
        >
          {
            this.mainApps.map((page: IAppPage, index: number) => {
              return (
                <SwipperPage
                  pageData={page}
                  key={index}
                  pageIdx={index}
                />
              )
            })
          }
        </div>
        <div className="swipper_dots">
          {
            this.mainApps.map((page: IAppPage, index: number) => {
              return <i
                className={pageIdx === index ? 'active dot' : 'dot'}
                key={index}
              />
            })
          }
        </div>
      </div>
    )
  }
}