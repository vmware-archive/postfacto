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
import Logger from '../../helpers/logger';

export default class RetroCable extends React.Component {
  static propTypes = {
    cable: types.object.isRequired,
    retro_id: types.string.isRequired,
    websocketRetroDataReceived: types.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {subscription: null};
  }

  componentWillMount() {
    const {cable, retro_id, websocketRetroDataReceived} = this.props;
    this.initialize(cable, retro_id, websocketRetroDataReceived);
  }

  componentWillReceiveProps(nextProps) {
    const {cable, retro_id, websocketRetroDataReceived} = nextProps;
    this.initialize(cable, retro_id, websocketRetroDataReceived);
  }

  componentWillUnmount() {
    const {cable} = this.props;
    cable.connection.close({allowReconnect: false});
    cable.subscriptions.remove(this.state.subscription);
  }

  initialize(cable, retro_id, websocketRetroDataReceived) {
    const {subscription} = this.state;
    if (cable && !subscription) {
      this.subscribe(cable, retro_id, localStorage.getItem('apiToken-' + retro_id), websocketRetroDataReceived);
    }
  }


  onDisconnected(data) {
    Logger.info('disconnected from actioncable', data);
  }

  subscribe(cable, retro_id, api_token, websocketRetroDataReceived) {
    const subscription = cable.subscriptions.create(
      {channel: 'RetrosChannel', retro_id, api_token},
      {
        received: websocketRetroDataReceived,
        disconnected: this.onDisconnected,
      },
    );

    this.setState({subscription});
  }

  render() {
    return null;
  }
}
