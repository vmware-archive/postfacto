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
    retro_id: types.string,
  };

  constructor(props) {
    super(props);
    this.state = {cable: null};
  }

  componentWillMount() {
    this.initialize(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initialize(nextProps);
  }

  initialize(props) {
    const {cable} = this.state;
    const {url} = props;
    if (!cable) {
      this.createCable(url);
    }
  }

  createCable(url) {
    const cable = ActionCable.createConsumer(url);
    this.setState({cable});
  }

  renderCable() {
    const {cable} = this.state;
    const {retro_id} = this.props;
    if (cable) {
      return <RetroCable cable={cable} retro_id={retro_id}/>;
    }
    return null;
  }

  render() {
    return (
      this.renderCable()
    );
  }
}
