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
import {Actions} from 'p-flux';
import Logger from '../helpers/logger';

export default class RetroCable extends React.Component {
  static propTypes = {
    cable: types.object,
    retro_id: types.string.isRequired,
  };

  constructor(props, context) {
    super(props, context);
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
    const {cable, retro_id} = props;
    const {subscription} = this.state;
    if (cable && !subscription) {
      this.subscribe(cable, retro_id, localStorage.getItem('apiToken-' + retro_id));
    }
  }

  onReceived(data) {
    Actions.websocketRetroDataReceived(data);
  }

  onDisconnected(data) {
    Logger.info('disconnected from actioncable', data);
  }

  subscribe(cable, retro_id, api_token) {
    const subscription = cable.subscriptions.create(
      {channel: 'RetrosChannel', retro_id, api_token},
      {
        received: this.onReceived,
        disconnected: this.onDisconnected,
        connected: this.onConnected,
      },
    );

    this.setState({subscription});
  }

  render() {
    return null;
  }
}
