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
import LegalBanner from '../shared/legal_banner';

export default class HomeLegalBanner extends React.PureComponent {
  static propTypes = {
    config: types.shape({
      terms: types.string.isRequired,
      privacy: types.string.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      hasBeenDismissed: window.localStorage.homeTermsDismissed,
    };
  }

  onDismiss = () => {
    window.localStorage.homeTermsDismissed = true;

    this.setState({hasBeenDismissed: true});
  };

  render() {
    const {config} = this.props;

    if (this.state.hasBeenDismissed) {
      return null;
    }

    return (<LegalBanner config={config} onDismiss={this.onDismiss}/>);
  }
}
