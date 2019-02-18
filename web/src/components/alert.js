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

import React from 'react';
import {Actions} from 'p-flux';
import types from 'prop-types';

const DEFAULT_DURATION = 3500;
export default class Alert extends React.Component {
  static propTypes = {
    alert: types.shape({
      checkIcon: types.bool,
    }),
  };

  componentDidMount() {
    this.initialize(this.props);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.alert !== nextProps.alert;
  }

  componentDidUpdate() {
    this.initialize(this.props);
  }

  startHideTimer(duration = DEFAULT_DURATION) {
    this.timeout = setTimeout(Actions.hideAlert, duration);
  }

  initialize(props) {
    const {alert} = props;

    if (alert && (alert.message && alert.message.length > 0) && !alert.sticky) {
      this.startHideTimer(alert.duration);
    } else if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  renderIcon() {
    if (this.props.alert.checkIcon) {
      return <i className="alert__icon fa fa-check"/>;
    }
    return null;
  }

  render() {
    const {alert, className} = this.props;

    if (alert && (alert.message && alert.message.length > 0)) {
      return (
        <div className={`alert ${className ? className : ''}`}>
          {this.renderIcon()}
          <span className="alert__text">{alert.message}</span>
          <span className="alert__link" onClick={alert.linkClick}>{alert.linkMessage}</span>
        </div>
      );
    }

    return null;
  }
}
