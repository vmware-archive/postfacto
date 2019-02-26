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

import types from 'prop-types';
import LegalBanner from '../shared/legal_banner';

export default class RetroLegalBanner extends LegalBanner {
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
      hasBeenDismissed: this.hasBeenDismissed(props.retroId),
    };
  }

  okClicked() {
    super.okClicked();

    this.markAsDismissed(this.props.retroId);

    this.setState({
      hasBeenDismissed: true,
    });
  }

  shouldHide() {
    return this.state.hasBeenDismissed || this.props.isPrivate;
  }

  markAsDismissed(retroId) {
    const retroBannersDismissed = JSON.parse(window.localStorage.retroBannersDismissed);
    retroBannersDismissed.push(retroId);
    window.localStorage.retroBannersDismissed = JSON.stringify(retroBannersDismissed);
  }

  hasBeenDismissed(retroId) {
    if (!window.localStorage.retroBannersDismissed) {
      window.localStorage.retroBannersDismissed = JSON.stringify([]);
    }

    return JSON.parse(window.localStorage.retroBannersDismissed).includes(retroId);
  }
}
