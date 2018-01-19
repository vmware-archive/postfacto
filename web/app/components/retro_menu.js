/*
 * Postfacto, a free, open-source and self-hosted retro tool aimed at helping
 * remote teams.
 *
 * Copyright (C) 2016 - Present Pivotal Software, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 *
 * it under the terms of the GNU Affero General Public License as
 *
 * published by the Free Software Foundation, either version 3 of the
 *
 * License, or (at your option) any later version.
 *
 *
 *
 * This program is distributed in the hope that it will be useful,
 *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *
 * GNU Affero General Public License for more details.
 *
 *
 *
 * You should have received a copy of the GNU Affero General Public License
 *
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import Popover from 'material-ui/Popover';
import MenuItem from 'material-ui/MenuItem';
import { RaisedButton } from 'material-ui';
const React = require('react');
const types = React.PropTypes;

class RetroMenu extends React.Component {
  static propTypes = {
    isMobile: types.bool.isRequired,
    items: types.array.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      anchorEl: null,
      open: false,
    };
  }

  handleMenuClick(event) {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose() {
    this.setState({
      open: false,
    });
  };

  onClick(menuItem) {
    menuItem.callback.call(this);
    this.handleRequestClose();
  }

  renderMenuItem(item) {
    let menuItem;

    if (item.button) {
      menuItem = (
        <button className="retro-menu-item retro-menu-item--button"
                onClick={this.onClick.bind(this, item)}>
          {item.title}
        </button>
      );
    } else {
      menuItem = (
        <MenuItem
          className="retro-menu-item"
          primaryText={item.title}
          onClick={this.onClick.bind(this, item)}
        />
      );
    }

    return (
      <div key={item.title}>
        {menuItem}
      </div>
    );
  }

  renderMenuItems() {
    return this.props.items.map(this.renderMenuItem.bind(this));
  }

  render() {
    const {isMobile, items} = this.props;
    const {anchorEl, open} = this.state;

    if (items.length === 0) {
      return null;
    }
    return (
      <div className={isMobile ? 'retro-menu-mobile' : 'retro-menu'}>
        <RaisedButton
          className="retro-heading-button"
          backgroundColor="#2574a9"
          labelColor="#f8f8f8"
          onTouchTap={this.handleMenuClick.bind(this)}
          label="MENU"
        />
        <Popover
          anchorEl={anchorEl}
          open={open}
          animated={false}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          onRequestClose={this.handleRequestClose.bind(this)}>
          { this.renderMenuItems() }
        </Popover>
      </div>
    );
  }
}

export default RetroMenu;
