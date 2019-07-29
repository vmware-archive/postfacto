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
import ActionCable from 'actioncable';
import RetroCable from './retro_cable';

export default class RetroWebsocket extends React.Component {
  static propTypes = {
    url: types.string.isRequired,
    retro_id: types.string.isRequired,
    websocketRetroDataReceived: types.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {cable: null};
  }

  componentWillMount() {
    const {url} = this.props;
    this.initialize(url);
  }

  componentWillReceiveProps(nextProps) {
    const {url} = nextProps;
    this.initialize(url);
  }

  initialize(url) {
    this.setState((oldState) => ({
      cable: oldState.cable || ActionCable.createConsumer(url),
    }));
  }

  render() {
    const {cable} = this.state;
    const {retro_id} = this.props;
    if (cable) {
      return <RetroCable cable={cable} retro_id={retro_id} websocketRetroDataReceived={this.props.websocketRetroDataReceived}/>;
    }
    return null;
  }
}
