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
import {Actions} from 'p-flux';
import RetroFooter from './footer';
import GoogleLoginWrapper from './google_login_wrapper';
import Logger from '../helpers/logger';
import {HomeLegalBanner} from './retro_legal_banner';

export default class HomePage extends React.Component {
  componentDidMount() {
    Actions.showHomePageAnalytics();
  }

  onSignIn(googleUser) {
    Logger.info('onGoogleSignIn ' + googleUser.profileObj.email);
    Actions.createSession({access_token: googleUser.accessToken, email: googleUser.profileObj.email, name: googleUser.profileObj.name});
  }

  onGoogleLoginFailure() {
    Logger.info('onGoogleLoginFailure');
  }

  render() {
    return (
      <div className="home-page">
        <div className="sticky-header">
          <div className="row">
            <HomeLegalBanner />
          </div>
          <div className="row header-title">
            <div className="show-for-medium small-12 columns">
              <span className="title">postfacto</span>
              <span className="subtitle">A retro app for successful teams.</span>
            </div>
            <div className="hide-for-medium small-12 columns text-center">
              <span className="title small-12 columns">postfacto</span>
              <span className="subtitle">A retro app for successful teams.</span>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="row" style={{paddingTop: '77px'}}>
            <div className="text-block columns">
              <h2>Postfacto helps you run better retrospectives.</h2>
            </div>
          </div>
          <div className="row">
            <div className="text-center">
              {
                global.Retro.config.google_oauth_client_id || global.Retro.config.mock_google_auth ? <GoogleLoginWrapper
                  onSuccess={this.onSignIn}
                  onFailure={this.onGoogleLoginFailure}
                  className="top-start-retro"
                /> : null
              }
            </div>
          </div>
          <div className="row">
            <div className="text-center whats-a-retro-link">
              <a href="https://builttoadapt.io/how-to-run-a-really-good-retrospective-8982bd839e16" target="_blank">What's a retro?</a>
            </div>
          </div>
        </div>

        <RetroFooter/>
      </div>
    );
  }
}
