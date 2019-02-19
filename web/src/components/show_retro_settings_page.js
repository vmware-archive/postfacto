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

import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import React from 'react';
import types from 'prop-types';
import {Actions} from 'p-flux';
import RetroMenu from './retro_menu';
import EmptyPage from './empty_page';
import Toggle from 'material-ui/Toggle';
import {DEFAULT_TOGGLE_STYLE, MAX_SLUG_LENGTH, VALID_SLUG_REGEX} from '../constants';
import iconLockedSvg from '../images/icon-locked.svg';
import iconEyeSvg from '../images/icon-eye.svg';

export default class ShowRetroSettingsPage extends React.Component {
  static propTypes = {
    alert: types.object,
    errors: types.object,
    isPrivate: types.bool,
    name: types.string,
    retro: types.object,
    retroId: types.string,
    session: types.object,
    slug: types.string,
  };

  // Component Lifecycle

  constructor(props) {
    super(props);
    this.state = {
      isMobile: false,
      isPrivate: false,
      name: '',
      slug: '',
      video_link: '',
      errors: {},
    };

    this.handleResize = this.handleResize.bind(this);
    this.handleBackButtonClicked = this.handleBackButtonClicked.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangePasswordClick = this.handleChangePasswordClick.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
    this.handleRetroSettingsSubmit = this.handleRetroSettingsSubmit.bind(this);
  }

  componentWillMount() {
    this.getSettings(this.props);
    this.handleResize();
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.retro) {
      this.setState({
        name: nextProps.retro.name,
        slug: nextProps.retro.slug,
        isPrivate: nextProps.retro.is_private,
        video_link: nextProps.retro.video_link,
      });
    }

    if (nextProps.errors) {
      this.setState({
        errors: {
          name: nextProps.errors.name,
          slug: nextProps.errors.slug,
        },
      });
    } else {
      this.setState({errors: {}});
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    Actions.clearErrors();
  }

  handleResize() {
    this.setState({isMobile: this.getIsMobile()});
  }

  handleBackButtonClicked() {
    const {retroId} = this.props;
    Actions.backPressedFromSettings({retro_id: retroId});
  }

  validateName(value) {
    if (!value) {
      return 'Your project needs a name!';
    }
    return '';
  }

  validateSlug(value) {
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
  }

  handleChange(e) {
    const errors = Object.assign({}, this.state.errors);

    const elementName = e.currentTarget.name;
    const elementValue = e.currentTarget.value;

    if (elementName === 'name') {
      errors.name = this.validateName(elementValue);
    }

    if (elementName === 'slug') {
      errors.slug = this.validateSlug(elementValue);
    }

    this.setState({[elementName]: elementValue, errors});
  }

  handleRetroSettingsSubmit() {
    const {retroId, retro, session} = this.props;
    const {name, slug, isPrivate, video_link} = this.state;
    const errors = {
      name: this.validateName(name),
      slug: this.validateSlug(slug),
    };

    if (!errors.name && !errors.slug) {
      Actions.updateRetroSettings({
        retro_id: retroId,
        retro_name: name,
        new_slug: slug,
        old_slug: retro.slug,
        video_link,
        is_private: isPrivate,
        request_uuid: session.request_uuid,
      });
    } else {
      this.setState({errors});
    }
  }

  handleChangePasswordClick(e) {
    e.preventDefault();

    Actions.routeToRetroPasswordSettings({retro_id: this.props.retroId});
  }

  getIsMobile() {
    return window.innerWidth < 640;
  }

  // Fetch Retro

  getSettings(props) {
    const {retroId} = props;
    Actions.getRetroSettings({id: retroId});
  }

  // Render
  renderBackButton() {
    const {isMobile} = this.state;
    return (
      <FlatButton
        className="retro-back"
        onClick={this.handleBackButtonClicked}
        label="Back"
        labelStyle={isMobile ? {'display': 'none'} : {}}
        icon={<FontIcon className="fa fa-chevron-left"/>}
      />
    );
  }

  toggleCheckbox(e) {
    this.setState({[e.currentTarget.name]: !this.state.isPrivate});
  }

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

  getMenuItems() {
    const items = [
      {title: 'Sign out', callback: Actions.signOut, isApplicable: window.localStorage.length > 0},
    ];

    return items.filter((item) => item.isApplicable);
  }

  getCurrentHost() {
    return window.location.origin.split('://')[1];
  }

  render() {
    const {retro, retroId} = this.props;
    const toggle = DEFAULT_TOGGLE_STYLE;

    const {isMobile, errors} = this.state;
    const retroContainerClasses = isMobile ? 'full-height mobile-display' : 'full-height';

    if (!(retro && retro.id)) return (<EmptyPage/>);

    return (
      <span className="retro-settings-page">
        <div className={retroContainerClasses}>
          <div className="retro-heading row">
            <div className="small-2 columns back-button">
              {this.renderBackButton()}
            </div>
            <h1 className="small-8 text-center retro-name">
              {retro.name}
            </h1>
            <div className="small-2 menu end">
              <RetroMenu isMobile={false} items={this.getMenuItems()}/>
            </div>
          </div>
          <div>
            <div className="retro-settings-sidebar large-1 medium-1 columns"/>

            <div className="retro-settings large-11 medium-11 columns">
              <div className="medium-8 small-12 columns">
                <div className="row">
                  <h1 className="retro-settings-header">Settings</h1>
                </div>

                <div className="row">
                  <label className="label">Project name</label>
                  <input
                    id="retro_name"
                    value={this.state.name}
                    type="text"
                    name="name"
                    className={`form-input ${errors.name ? 'input-error' : ''}`}
                    onChange={this.handleChange}
                    placeholder=""
                  />
                  <div className="error-message">{errors.name}</div>
                </div>

                <div className="row">
                  <label className="label">Project URL</label>
                  <div className="input-group retro-url">
                    <span className="input-group-label retro-url-prefix">{this.getCurrentHost()}/retros/</span>
                    <input
                      id="retro_url"
                      value={this.state.slug}
                      type="text"
                      name="slug"
                      className={`input-group-field form-input ${errors.slug ? 'input-error' : ''}`}
                      onChange={this.handleChange}
                      placeholder=""
                    />
                  </div>

                  <div className="error-message">{errors.slug}</div>
                </div>


                <div className="row">
                  <label className="label">Video URL</label>
                  <input
                    id="retro_video_link"
                    name="video_link"
                    value={this.state.video_link}
                    type="text"
                    onChange={this.handleChange}
                    className="form-input"
                    placeholder=""
                  />
                </div>

                <div className="row" onClick={this.handleChangePasswordClick}>
                  <a id="retro-password-settings" href={`/retros/${retroId}/settings/password`}>Change password</a>
                </div>

                <div className="row">
                  <label className="label" htmlFor="retro_is_private">
                    Do people need the password to <strong>access</strong> this retro?
                  </label>

                  <Toggle
                    id="retro_is_private"
                    name="isPrivate"
                    label={this.state.isPrivate ? 'Yes' : 'No'}
                    toggled={this.state.isPrivate}
                    labelPosition="right"
                    onToggle={this.toggleCheckbox}
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
                  <button
                    className="retro-settings-form-submit button"
                    type="submit"
                    onClick={this.handleRetroSettingsSubmit}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </span>
    );
  }
}
