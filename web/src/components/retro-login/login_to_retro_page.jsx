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
import {getRetroLogin, loginToRetro} from '../../redux/actions/api_actions';

class LoginToRetroPage extends React.Component {
  static propTypes = {
    retro: types.object.isRequired,
    retroId: types.string.isRequired,
    errors: types.object,
    force_relogin: types.bool,
    config: types.shape({
      terms: types.string.isRequired,
      privacy: types.string.isRequired,
    }).isRequired,
    getRetroLogin: types.func.isRequired,
    loginToRetro: types.func.isRequired,
  };

  static defaultProps = {
    errors: {login_error_message: ''},
    force_relogin: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      password: '',
      errors: [],
      inputStyle: '',
    };

    this.onInputFocus = this.onInputFocus.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onLoginClicked = this.onLoginClicked.bind(this);
  }

  componentDidMount() {
    const {retroId} = this.props;

    if (retroId) {
      this.props.getRetroLogin(retroId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {login_error_message} = nextProps.errors;

    this.setState({
      errors: [login_error_message],
      inputStyle: login_error_message ? 'input-error' : '',
    });
  }

  onInputChange(event) {
    this.setState({password: event.target.value});
  }

  onInputFocus() {
    this.setState({errors: [], inputStyle: ''});
  }

  onLoginClicked() {
    this.loginToRetro();
  }

  onKeyPress(event) {
    if (event.key === 'Enter' && event.target.value) {
      this.loginToRetro();
    }
  }

  loginToRetro() {
    const {retroId} = this.props;
    this.props.loginToRetro(retroId, this.state.password);
    this.setState({password: ''});
  }

  pageTitle() {
    const {force_relogin} = this.props;
    return force_relogin ? 'The owner of this retro has chosen to protect it with a password.' : 'Psst... what\'s the password?';
  }

  render() {
    const {retro: {name}, config} = this.props;
    const {errors, inputStyle} = this.state;
    if (!name) {
      return null;
    }
    return (
      <div className="password-page">
        <div className="row" style={{marginTop: '180px'}}>
          <div className="small-centered medium-8 small-10 columns">
            <div className="field row">
              <h1>{this.pageTitle()}</h1>
              <label className="label">Enter the password to access {name}.</label>
              <input
                className={`form-input ${inputStyle}`}
                placeholder="Password"
                type="password"
                value={this.state.password}
                onFocus={this.onInputFocus}
                onChange={this.onInputChange}
                onKeyPress={this.onKeyPress}
                required
                autoFocus
                autoComplete="off"
              />
              <p className="password-terms-text">
                By logging in, you agree to our
                {' '}<a href={config.terms} target="_blank">Terms of Use</a> and
                {' '}<a href={config.privacy} target="_blank">Privacy Policy</a> and
                use of cookies.
              </p>
              <div className="error-message">{errors}</div>
            </div>
            <div className="actions row">
              <button
                type="submit"
                className="retro-form-submit expanded button"
                style={{fontSize: '1.1rem'}}
                onClick={this.onLoginClicked}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.messages.errors,
  retro: state.retro.currentRetro,
});


const mapDispatchToProps = (dispatch) => ({
  getRetroLogin: (retroId) => dispatch(getRetroLogin(retroId)),
  loginToRetro: (retroId, password) => dispatch(loginToRetro(retroId, password)),
});

const ConnectedLoginToRetroPage = connect(mapStateToProps, mapDispatchToProps)(LoginToRetroPage);
export {LoginToRetroPage, ConnectedLoginToRetroPage};
