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
import {connect} from 'react-redux';
import RetroFooter from '../shared/footer';
import LoginForm from './login_form';
import Logger from '../../helpers/logger';
import HomeLegalBanner from './home_legal_banner';
import {createSession} from '../../redux/actions/api_actions';
import {homePageShown} from '../../redux/actions/analytics_actions';

export default class HomePage extends React.PureComponent {
  static propTypes = {
    config: types.object.isRequired,
    createSession: types.func.isRequired,
    homePageShownAnalytics: types.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.onSignIn = this.onSignIn.bind(this);
  }


  componentDidMount() {
    this.props.homePageShownAnalytics();
  }

  onSignIn(googleUser) {
    Logger.info('onGoogleSignIn ' + googleUser.profileObj.email);
    this.props.createSession(
      googleUser.accessToken,
      googleUser.profileObj.email,
      googleUser.profileObj.name,
    );
  }

  onGoogleLoginFailure() {
    Logger.info('onGoogleLoginFailure');
  }

  render() {
    const {config} = this.props;

    return (
      <div className="home-page">
        <div className="sticky-header">
          <div className="row">
            <HomeLegalBanner config={config}/>
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
              <LoginForm
                onSuccess={this.onSignIn}
                onFailure={this.onGoogleLoginFailure}
                className="top-start-retro"
                config={config}
              />
            </div>
          </div>
          <div className="row">
            <div className="text-center whats-a-retro-link">
              <a href="https://builttoadapt.io/how-to-run-a-really-good-retrospective-8982bd839e16" target="_blank">What's a retro?</a>
            </div>
          </div>
        </div>

        <RetroFooter config={config}/>
      </div>
    );
  }
}


const mapDispatchToProps = (dispatch) => ({
  homePageShownAnalytics: () => dispatch(homePageShown()),
  createSession: (accessToken, email, name) => dispatch(createSession(accessToken, email, name)),
});

const ConnectedHomePage = connect(null, mapDispatchToProps)(HomePage);

export {HomePage, ConnectedHomePage};
