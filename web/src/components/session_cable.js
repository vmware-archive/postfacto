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
import types from 'prop-types';

export default class SessionCable extends React.Component {
  static propTypes = {
    cable: types.object.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    websocketSessionDataReceived: types.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {subscription: null};
  }

  componentWillMount() {
    this.initialize(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initialize(nextProps);
  }

  componentWillUnmount() {
    const {cable} = this.props;
    cable.connection.close({allowReconnect: false});
    cable.subscriptions.remove(this.state.subscription);
  }

  initialize(props) {
    const {cable, websocketSessionDataReceived} = props;
    const {subscription} = this.state;
    if (cable && !subscription) {
      this.subscribe(cable, websocketSessionDataReceived);
    }
  }

  subscribe(cable, onRecieved) {
    const subscription = cable.subscriptions.create(
      {channel: 'SessionsChannel'},
      {received: (data) => onRecieved(data.payload)},
    );

    this.setState({subscription});
  }

  render() {
    return null;
  }
}
