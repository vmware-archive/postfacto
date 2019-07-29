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
import Toggle from 'material-ui/Toggle';
import {connect} from 'react-redux';
import RetroMenu from '../shared/retro_menu';
import EmptyPage from '../shared/empty_page';
import {DEFAULT_TOGGLE_STYLE, MAX_SLUG_LENGTH, VALID_SLUG_REGEX} from '../shared/constants';
import iconLockedSvg from '../../images/icon-locked.svg';
import iconEyeSvg from '../../images/icon-eye.svg';
import {getRetroSettings, updateRetroSettings} from '../../redux/actions/api_actions';
import {clearErrors, signOut} from '../../redux/actions/main_actions';
import {retroPasswordSettings, showRetroForId} from '../../redux/actions/router_actions';

function getStateUpdateFor(retro, errors) {
  const stateUpdate = {};
  if (retro) {
    stateUpdate.name = retro.name;
    stateUpdate.slug = retro.slug;
    stateUpdate.isPrivate = retro.is_private;
    stateUpdate.video_link = retro.video_link;
  }

  if (errors) {
    stateUpdate.errors = {
      name: errors.name,
      slug: errors.slug,
    };
  } else {
    stateUpdate.errors = {};
  }

  return stateUpdate;
}

class ShowRetroSettingsPage extends React.Component {
  static propTypes = {
    errors: types.object,
    retro: types.object,
    retroId: types.string.isRequired,
    session: types.object,
    environment: types.shape({
      isMobile640: types.bool,
    }).isRequired,
    clearErrors: types.func.isRequired,
    showRetroForId: types.func.isRequired,
    updateRetroSettings: types.func.isRequired,
    routeToRetroPasswordSettings: types.func.isRequired,
    getRetroSettings: types.func.isRequired,
    signOut: types.func.isRequired,
  };

  static defaultProps = {
    errors: null,
    retro: null,
    session: null,
  };

  // Component Lifecycle

  constructor(props) {
    super(props);

    const {retro, errors} = props;
    this.state = Object.assign(
      {
        isPrivate: false,
        name: '',
        slug: '',
        video_link: '',
        errors: {},
      },
      getStateUpdateFor(retro, errors),
    );

    this.handleBackButtonClicked = this.handleBackButtonClicked.bind(this);
    this.onChangeName = this.onChange.bind(this, 'name');
    this.onChangeSlug = this.onChange.bind(this, 'slug');
    this.onChangeVideo = this.onChange.bind(this, 'video_link');
    this.handleChangePasswordClick = this.handleChangePasswordClick.bind(this);
    this.togglePrivate = this.togglePrivate.bind(this);
    this.handleRetroSettingsSubmit = this.handleRetroSettingsSubmit.bind(this);
  }

  componentWillMount() {
    this.getSettings(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const {retro, errors} = nextProps;
    this.setState(getStateUpdateFor(retro, errors));
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  handleBackButtonClicked() {
    const {retroId} = this.props;
    this.props.showRetroForId(retroId);
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

  onChange(field, e) {
    const value = e.target.value;

    const errors = {};

    if (field === 'name') {
      errors.name = this.validateName(value);
    }

    if (field === 'slug') {
      errors.slug = this.validateSlug(value);
    }

    this.setState((oldState) => ({
      [field]: value,
      errors: Object.assign({}, oldState.errors, errors),
    }));
  }

  handleRetroSettingsSubmit() {
    const {retroId, retro, session} = this.props;
    const {name, slug, isPrivate, video_link} = this.state;
    const errors = {
      name: this.validateName(name),
      slug: this.validateSlug(slug),
    };

    if (!errors.name && !errors.slug) {
      this.props.updateRetroSettings(retroId, name, slug, retro.slug, isPrivate, session.request_uuid, video_link);
    } else {
      this.setState({errors});
    }
  }

  handleChangePasswordClick(e) {
    e.preventDefault();

    this.props.routeToRetroPasswordSettings(this.props.retroId);
  }

  // Fetch Retro

  getSettings(props) {
    const {retroId} = props;
    this.props.getRetroSettings(retroId);
  }

  // Render
  renderBackButton() {
    const {environment} = this.props;
    const isMobile = environment.isMobile640;

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

  getMenuItems() {
    const items = [
      {title: 'Sign out', callback: this.props.signOut, isApplicable: window.localStorage.length > 0},
    ];

    return items.filter((item) => item.isApplicable);
  }

  getCurrentHost() {
    return window.location.origin.split('://')[1];
  }

  render() {
    const {retro, retroId, environment} = this.props;
    const isMobile = environment.isMobile640;
    const {errors} = this.state;
    const toggle = DEFAULT_TOGGLE_STYLE;

    const retroContainerClasses = isMobile ? 'full-height mobile-display' : 'full-height';

    if (!(retro && retro.id)) {
      return (<EmptyPage/>);
    }

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
            <div className="retro-settings large-12 medium-12 columns">
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
                    onChange={this.onChangeName}
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
                      onChange={this.onChangeSlug}
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
                    onChange={this.onChangeVideo}
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

const mapStateToProps = (state) => ({
  retro: state.retro.currentRetro,
  errors: state.messages.errors,
  session: state.user.websocketSession,
  environment: state.config.environment,
});

const mapDispatchToProps = (dispatch) => ({
  clearErrors: () => dispatch(clearErrors()),
  showRetroForId: (retroId) => dispatch(showRetroForId(retroId)),
  updateRetroSettings: (retroId, retroName, newSlug, oldSlug, isPrivate, requestUuid, videoLink) => dispatch(updateRetroSettings(retroId, retroName, newSlug, oldSlug, isPrivate, requestUuid, videoLink)),
  routeToRetroPasswordSettings: (retroId) => dispatch(retroPasswordSettings(retroId)),
  getRetroSettings: (retroId) => dispatch(getRetroSettings(retroId)),
  signOut: () => dispatch(signOut()),
});

const ConnectedShowRetroSettingsPage = connect(mapStateToProps, mapDispatchToProps)(ShowRetroSettingsPage);
export {ShowRetroSettingsPage, ConnectedShowRetroSettingsPage};
