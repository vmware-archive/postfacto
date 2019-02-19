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
import GoogleLogin from 'react-google-login';
import types from 'prop-types';

export default class GoogleLoginWrapper extends React.Component {
  static propTypes = {
    onSuccess: types.func.isRequired,
    onFailure: types.func.isRequired,
    className: types.string,
  };

  constructor(props) {
    super(props);

    this.handleClickCapture = this.handleClickCapture.bind(this);
  }

  handleClickCapture(event) {
    if (global.Retro.config.mock_google_auth) {
      event.stopPropagation();
      const mockedEmail = window.mock_google_auth.split('_')[1];
      this.props.onSuccess({
        profileObj: {
          email: mockedEmail + '@example.com',
          name: 'my full name',
        },
        accessToken: window.mock_google_auth,
      });
    }
  }

  render() {
    return (
      <div onClickCapture={this.handleClickCapture}>
        <GoogleLogin
          clientId={global.Retro.config.google_oauth_client_id}
          onSuccess={this.props.onSuccess}
          onFailure={this.props.onFailure}
          className={'button start-retro ' + this.props.className}
          hostedDomain={global.Retro.config.google_oauth_hosted_domain}
        >
          <span><i className="fa fa-google" aria-hidden="true" style={{marginRight: '10px'}}/>Sign in with Google</span>
        </GoogleLogin>
      </div>
    );
  }
}
