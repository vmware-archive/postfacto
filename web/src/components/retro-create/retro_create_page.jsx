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
import Toggle from 'material-ui/Toggle';
import types from 'prop-types';
import {connect} from 'react-redux';
import {DEFAULT_TOGGLE_STYLE, MAX_SLUG_LENGTH, VALID_SLUG_REGEX} from '../shared/constants';
import iconLockedSvg from '../../images/icon-locked.svg';
import iconEyeSvg from '../../images/icon-eye.svg';
import {retroCreate} from '../../redux/actions/api_actions';
import {home} from '../../redux/actions/router_actions';
import {clearErrors} from '../../redux/actions/main_actions';

class RetroCreatePage extends React.Component {
  static propTypes = {
    errors: types.shape({
      slug: types.string,
    }),
    redirectToHome: types.func.isRequired,
    clearErrors: types.func.isRequired,
    retroCreate: types.func.isRequired,
  };

  static defaultProps = {
    errors: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      slug: '',
      password: '',
      isPrivate: true,
      errors: {
        name: '',
        slug: '',
        password: '',
      },
    };

    this.togglePrivate = this.togglePrivate.bind(this);
    this.submit = this.submit.bind(this);
    this.onChangeName = this.onChange.bind(this, 'name');
    this.onChangeSlug = this.onChange.bind(this, 'slug');
    this.onChangePassword = this.onChange.bind(this, 'password');
  }

  componentWillMount() {
    if (!localStorage.getItem('authToken')) {
      this.props.redirectToHome();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: {
          slug: nextProps.errors.slug,
        },
      });
    } else {
      this.setState({errors: {}});
    }
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  submit() {
    const errors = {};
    errors.name = this.validateName(this.state.name);
    errors.slug = this.validateSlug(this.state.slug);
    errors.password = this.validatePassword(this.state.password);

    this.setState({errors});

    if (!errors.name && !errors.slug && !errors.password) {
      this.props.retroCreate({
        name: this.state.name,
        slug: this.state.slug,
        password: this.state.password,
        isPrivate: this.state.isPrivate,
      });
    }
  }

  getCurrentHost() {
    return window.location.origin.split('://')[1];
  }

  validateName = (value) => {
    if (!value) {
      return 'Your project needs a team name!';
    }
    return '';
  };

  validateSlug = (value) => {
    if (!value) {
      return 'Your project needs a URL!';
    }

    if (value.length > MAX_SLUG_LENGTH) {
      return 'Your URL is too long!';
    }

    if (!value.match(VALID_SLUG_REGEX)) {
      return 'Your URL should only contain letters, numbers or hyphens!';
    }

    return '';
  };

  validatePassword = (value) => {
    if (!value) {
      return 'Your project needs a password!';
    }
    return '';
  };

  onChange(field, e) {
    const value = e.target.value;

    const errors = {};

    if (field === 'name') {
      errors.name = this.validateName(value);
    }

    if (field === 'slug') {
      errors.slug = this.validateSlug(value);
    }

    if (field === 'password') {
      errors.password = this.validatePassword(value);
    }

    this.setState((oldState) => ({
      [field]: value,
      errors: Object.assign({}, oldState.errors, errors),
    }));
  }

  togglePrivate = () => {
    this.setState((oldState) => ({
      isPrivate: !oldState.isPrivate,
    }));
  };

  renderAccessInstruction() {
    const accessPrivate = (
      <div>
        <img className="icon-locked" src={iconLockedSvg} alt="Locked"/>
        {' '}The password is needed to view or participate.
      </div>
    );
    const accessPublic = (
      <div>
        <img className="icon-locked" src={iconEyeSvg} alt="Unlocked"/>
        {' '}Anyone can view or participate <strong>without</strong> entering password.
      </div>
    );

    return (
      <div className="access-instruction">
        {this.state.isPrivate ? accessPrivate : accessPublic}

        <br/>
        Password is always required to: <br/>
        <img className="icon-locked" src={iconLockedSvg} alt="Locked"/> Access archives<br/>
        <img className="icon-locked" src={iconLockedSvg} alt="Locked"/> Edit settings

      </div>
    );
  }

  render() {
    const {name, slug, password, isPrivate, errors} = this.state;
    const toggle = DEFAULT_TOGGLE_STYLE;

    return (
      <div className="new-retro-page">
        <div>
          <div className="medium-6 small-12 columns new-retro-msg new-retro-column">
            <div className="medium-centered small-centered">Time to make your team retro!</div>
          </div>
          <div className="medium-6 small-12 columns new-retro-column">

            <div className="medium-centered small-centered" style={{width: '30rem'}}>
              <div className="row">
                <label className="label">What's your team called?</label>
                <input
                  id="retro_name"
                  value={name}
                  type="text"
                  name="name"
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                  onChange={this.onChangeName}
                  placeholder="Team name"
                />
                <div className="error-message">{errors.name}</div>
              </div>
              <div className="row">
                <label className="label">Choose a team URL</label>
                <div className="input-group retro-url">
                  <span className="input-group-label retro-url-prefix">{this.getCurrentHost()}/retros/</span>
                  <input
                    id="retro_url"
                    value={slug}
                    type="text"
                    name="slug"
                    className={`input-group-field form-input ${errors.slug ? 'input-error' : ''}`}
                    onChange={this.onChangeSlug}
                    placeholder="team-name"
                  />
                </div>
                <div className="error-message">{errors.slug}</div>
              </div>
              <div className="row">
                <label className="label">Create a team password</label>
                <input
                  id="retro_password"
                  value={password}
                  type="password"
                  name="password"
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                  onChange={this.onChangePassword}
                  placeholder="Create password"
                />
                <div className="error-message">{errors.password}</div>
              </div>
              <div className="row">
                <label className="label" htmlFor="retro_is_private">Do people need the password to <strong>access</strong> this retro?</label>

                <Toggle
                  id="retro_is_private"
                  name="isPrivate"
                  label={isPrivate ? 'Yes' : 'No'}
                  labelPosition="right"
                  toggled={isPrivate}
                  onToggle={this.togglePrivate}
                  trackStyle={toggle.trackStyle}
                  trackSwitchedStyle={toggle.trackSwitchedStyle}
                  labelStyle={toggle.labelStyle}
                  thumbStyle={toggle.thumbStyle}
                  thumbSwitchedStyle={toggle.thumbSwitchedStyle}
                  iconStyle={toggle.iconStyle}
                />
                {this.renderAccessInstruction()}
              </div>

              <div className="row">
                <div className="medium-6 small-12 columns" style={{paddingLeft: '0', paddingRight: '0'}}>
                  <input
                    type="submit"
                    className="retro-form-submit expanded button"
                    id="create_new_retro"
                    value="Create Retro"
                    onClick={this.submit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.messages.errors,
});

const mapDispatchToProps = (dispatch) => ({
  redirectToHome: () => dispatch(home()),
  clearErrors: () => dispatch(clearErrors()),
  retroCreate: (newRetro) => dispatch(retroCreate(newRetro)),
});

const ConnectedRetroCreatePage = connect(mapStateToProps, mapDispatchToProps)(RetroCreatePage);
export {RetroCreatePage, ConnectedRetroCreatePage};
