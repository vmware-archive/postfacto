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

function getDismissedIds() {
  return JSON.parse(window.localStorage.retroBannersDismissed || '[]');
}

function markAsDismissed(retroId) {
  const retroBannersDismissed = getDismissedIds();
  retroBannersDismissed.push(retroId);
  window.localStorage.retroBannersDismissed = JSON.stringify(retroBannersDismissed);
}

function hasBeenDismissed(retroId) {
  return getDismissedIds().includes(retroId);
}

export default class RetroLegalBanner extends React.PureComponent {
  static propTypes = {
    retroId: types.string.isRequired,
    isPrivate: types.bool,
    config: types.shape({
      terms: types.string.isRequired,
      privacy: types.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    isPrivate: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      hasBeenDismissed: hasBeenDismissed(props.retroId),
    };
  }

  onDismiss = () => {
    markAsDismissed(this.props.retroId);

    this.setState({hasBeenDismissed: true});
  };

  render() {
    const {config, isPrivate} = this.props;

    if (this.state.hasBeenDismissed || isPrivate) {
      return null;
    }

    return (<LegalBanner config={config} onDismiss={this.onDismiss}/>);
  }
}
