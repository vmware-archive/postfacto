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

const {Actions} = require('p-flux');
const React = require('react');
import Toggle from 'material-ui/Toggle';
import _ from 'lodash';
import { MAX_SLUG_LENGTH, VALID_SLUG_REGEX, DEFAULT_TOGGLE_STYLE } from '../constants';

class RetroCreatePage extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      name: '',
      slug: '',
      password: '',
      isPrivate: true,
      errors: {
        name: '',
        slug: '',
        password: ''
      }
    };
  }

  componentWillMount() {
    if(!localStorage.getItem('authToken')) {
      Actions.setRoute('/');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: {
          slug: nextProps.errors.slug
        }
      });
    } else {
      this.setState({errors: {}});
    }
  }

  componentWillUnmount() {
    Actions.clearErrors();
  }

  submit() {
    let errors = {};
    errors.name = this.validateName(this.state.name);
    errors.slug = this.validateSlug(this.state.slug);
    errors.password = this.validatePassword(this.state.password);

    this.setState({errors});

    if (_.isEmpty(errors.name) && _.isEmpty(errors.slug) && _.isEmpty(errors.password)) {
      Actions.retroCreate({
        name: this.state.name,
        slug: this.state.slug,
        password: this.state.password,
        isPrivate: this.state.isPrivate });
    }
  }

  getCurrentHost(){
    return window.location.origin.split('://')[1];
  }

  validateName = (value) => {
    if (_.isEmpty(value)) {
      return 'Your project needs a team name!';
    }
    return '';
  };

  validateSlug = (value) => {
    if (_.isEmpty(value)) {
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
    if (_.isEmpty(value)) {
      return 'Your project needs a password!';
    }
    return '';
  };

  change = e => {
    let errors = Object.assign({}, this.state.errors);

    const elementName = e.currentTarget.name;
    const elementValue = e.currentTarget.value;

    if (elementName === 'name') {
      errors.name = this.validateName(elementValue);
    }

    if (elementName === 'slug') {
      errors.slug = this.validateSlug(elementValue);
    }

    if (elementName === 'password') {
      errors.password = this.validatePassword(elementValue);
    }

    this.setState({[elementName]: elementValue, errors: errors});
  };

  toggleCheckbox = e => {
    this.setState({[e.currentTarget.name]: !this.state.isPrivate});
  };

  renderAccessInstruction() {
    const accessPrivate = (<div>
          <img className="icon-locked" src={require('../images/icon-locked.svg')}/> The password is needed to view or participate.
        </div>);
    const accessPublic = (<div>
          <img className="icon-locked" src={require('../images/icon-eye.svg')}/> Anyone can view or participate <strong>without</strong> entering password.
        </div>);

    return(
      <div className="access-instruction">
        {this.state.isPrivate ? accessPrivate : accessPublic}

        <br/>
        Password is always required to: <br/>
        <img className="icon-locked" src={require('../images/icon-locked.svg')}/> Access archives<br/>
        <img className="icon-locked" src={require('../images/icon-locked.svg')}/> Edit settings

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
                <input id="retro_name"
                       value={name}
                       type="text"
                       name="name"
                       className={`form-input ${ errors.name ? 'input-error' : '' }`}
                       onChange={this.change}
                       placeholder="Team name"/>
                <div className="error-message">{errors.name}</div>
              </div>
              <div className="row">
                <label className="label">Choose a team URL</label>
                <div className="input-group retro-url">
                  <span className="input-group-label retro-url-prefix">{this.getCurrentHost()}/retros/</span>
                  <input id="retro_url"
                         value={slug}
                         type="text"
                         name="slug"
                         className={`input-group-field form-input ${ errors.slug ? 'input-error' : '' }`}
                         onChange={this.change}
                         placeholder="team-name"/>
                </div>
                <div className="error-message">{errors.slug}</div>
              </div>
              <div className="row">
                <label className="label">Create a team password</label>
                <input id="retro_password"
                       value={password}
                       type="password"
                       name="password"
                       className={`form-input ${ errors.password ? 'input-error' : '' }`}
                       onChange={this.change}
                       placeholder="Create password"/>
                <div className="error-message">{errors.password}</div>
              </div>
              <div className="row">
                <label className="label" htmlFor="retro_is_private">Do people need the password to <strong>access</strong> this retro?</label>

                <Toggle
                  id="retro_is_private"
                  name="isPrivate"
                  label={ isPrivate ? 'Yes' : 'No' }
                  labelPosition="right"
                  toggled={isPrivate}
                  onToggle={this.toggleCheckbox.bind(this)}
                  trackStyle={toggle.trackStyle}
                  trackSwitchedStyle={toggle.trackSwitchedStyle}
                  labelStyle={toggle.labelStyle}
                  thumbStyle={toggle.thumbStyle}
                  thumbSwitchedStyle={toggle.thumbSwitchedStyle}
                  iconStyle={toggle.iconStyle}
                />
                { this.renderAccessInstruction() }
              </div>

              <div className="row">
                <div className="medium-6 small-12 columns" style={{paddingLeft: '0', paddingRight: '0'}}>
                  <input type="submit" className="retro-form-submit expanded button"
                         id="create_new_retro" value="Create Retro"
                         onClick={this.submit.bind(this)}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = RetroCreatePage;
