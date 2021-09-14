import React, { Component } from 'react'

import { feLinks, ILinks, ILinkItem } from '../../config/friendLinks'
import './index.scss'

export default class FriendLink extends Component {
  private readonly feLinks = feLinks

  renderLinkGroup(linkGroup: ILinks) {
    return (
      <div
        className="link_group"
        key={linkGroup.type}
      >
        <div className="group_name">{linkGroup.type}</div>
        <div className="group_list">
          {
            linkGroup.links.map((link: ILinkItem) => this.renderLinkItem(link))
          }
        </div>
      </div>
    )
  }

  renderLinkItem(linkItem: ILinkItem) {
    return (
      <a
        href={linkItem.url}
        target="_blank"
        rel="noreferrer"
        key={linkItem.url}
      >
        <div className="link_item">{linkItem.name}</div>
      </a>
    )
  }

  render() {
    return (
      <div id="friend_link">
        {
          this.feLinks.map((links: ILinks) => this.renderLinkGroup(links))
        }
      </div>
    )
  }
}