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

class LegalBanner extends React.Component {
  okClicked() {
  }

  shouldHide() {
    return true;
  }

  render() {
    if (this.shouldHide()) {
      return null;
    } else {
      return (
        <div className="banner" style={{display: 'flex'}}>
          <div className="terms-text">
            By accessing and using Postfacto, you agree to our
            {' '}<a href={global.Retro.config.terms} target="_blank">Terms of Use</a> and
            {' '}<a href={global.Retro.config.privacy} target="_blank">Privacy Policy</a> and
            use of cookies
          </div>
          <button className="button ok-button" onClick={this.okClicked.bind(this)}>OK</button>
        </div>
      );
    }
  }
}

class RetroLegalBanner extends LegalBanner {
  static propTypes = {
    retro: types.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      hasBeenDismissed: this.hasBeenDismissed(props.retro),
    };
  }

  okClicked() {
    super.okClicked();

    this.markAsDismissed(this.props.retro);

    this.setState({
      hasBeenDismissed: true,
    });
  }

  shouldHide() {
    return this.state.hasBeenDismissed || this.props.retro.is_private;
  }

  markAsDismissed(retro) {
    let retroBannersDismissed = JSON.parse(window.localStorage.retroBannersDismissed);
    retroBannersDismissed.push(retro.id);
    window.localStorage.retroBannersDismissed = JSON.stringify(retroBannersDismissed);
  }

  hasBeenDismissed(retro) {
    if (!window.localStorage.retroBannersDismissed) {
      window.localStorage.retroBannersDismissed = JSON.stringify([]);
    }

    return JSON.parse(window.localStorage.retroBannersDismissed).includes(retro.id);
  }
}

class HomeLegalBanner extends LegalBanner {
  constructor(props, context) {
    super(props, context);
    this.state = {
      hasBeenDismissed: window.localStorage.homeTermsDismissed,
    };
  }

  okClicked() {
    super.okClicked();

    window.localStorage.homeTermsDismissed = true;

    this.setState({hasBeenDismissed: true});
  }

  shouldHide() {
    return this.state.hasBeenDismissed;
  }
}

export {RetroLegalBanner, HomeLegalBanner};
