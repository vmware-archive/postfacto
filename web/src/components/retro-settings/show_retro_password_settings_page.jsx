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
import {connect} from 'react-redux';
import RetroMenu from '../shared/retro_menu';
import EmptyPage from '../shared/empty_page';
import {getRetroSettings, updateRetroPassword} from '../../redux/actions/api_actions';
import {clearErrors, signOut} from '../../redux/actions/main_actions';
import {showRetroForId} from '../../redux/actions/router_actions';

class ShowRetroPasswordSettingsPage extends React.Component {
  static propTypes = {
    retro: types.object,
    retroId: types.string.isRequired,
    session: types.object,
    errors: types.shape({
      current_password: types.string,
    }),
    environment: types.shape({
      isMobile640: types.bool,
    }).isRequired,
    getRetroSettings: types.func.isRequired,
    clearErrors: types.func.isRequired,
    showRetroForId: types.func.isRequired,
    updateRetroPassword: types.func.isRequired,
    signOut: types.func.isRequired,
  };

  static defaultProps = {
    retro: null,
    session: null,
    errors: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      current_password: '',
      confirm_new_password: '',
      new_password: '',
      errors: {
        confirm_new_password: '',
        current_password: '',
      },
    };

    this.handleBackButtonClicked = this.handleBackButtonClicked.bind(this);
    this.onCurrentPasswordChange = this.onChange.bind(this, 'current_password');
    this.onNewPasswordChange = this.onChange.bind(this, 'new_password');
    this.onConfirmPasswordChange = this.onChange.bind(this, 'confirm_new_password');
    this.handleSubmitButtonClicked = this.handleSubmitButtonClicked.bind(this);
  }

  componentWillMount() {
    const {retroId} = this.props;
    this.props.getRetroSettings(retroId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: {
          current_password: nextProps.errors.current_password,
        },
      });
    } else {
      this.setState({errors: {}});
    }
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  handleBackButtonClicked() {
    const {retroId} = this.props;
    this.props.showRetroForId(retroId);
  }

  handleSubmitButtonClicked() {
    const errors = {};

    if (this.state.new_password !== this.state.confirm_new_password) {
      errors.confirm_new_password = 'Your passwords do not match!';
    } else {
      errors.confirm_new_password = '';

      this.props.updateRetroPassword(this.props.retroId, this.state.current_password, this.state.new_password, this.props.session.request_uuid);
    }

    this.setState((oldState) => ({
      errors: Object.assign({}, oldState.errors, errors),
    }));
  }

  onChange(field, e) {
    const value = e.target.value;

    this.setState({[field]: value});
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

  getMenuItems() {
    const items = [
      {title: 'Sign out', callback: this.props.signOut, isApplicable: window.localStorage.length > 0},
    ];

    return items.filter((item) => item.isApplicable);
  }

  render() {
    const {retro, environment} = this.props;
    const isMobile = environment.isMobile640;
    const {errors} = this.state;
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
                  <h1 className="retro-settings-header">Change password</h1>
                </div>

                <div className="row">
                  <label className="label">Current password</label>
                  <input
                    id="retro_current_password"
                    type="password"
                    name="current_password"
                    onChange={this.onCurrentPasswordChange}
                    className={`form-input ${errors.current_password ? 'input-error' : ''}`}
                    placeholder="Current password"
                  />
                  <div className="error-message">{errors.current_password}</div>

                  <label className="label">New password</label>
                  <input
                    id="retro_new_password"
                    type="password"
                    name="new_password"
                    onChange={this.onNewPasswordChange}
                    placeholder="New password"
                  />

                  <label className="label">Confirm new password</label>
                  <input
                    id="retro_confirm_new_password"
                    type="password"
                    name="confirm_new_password"
                    onChange={this.onConfirmPasswordChange}
                    className={`form-input ${errors.confirm_new_password ? 'input-error' : ''}`}
                    placeholder="New password again"
                  />
                  <div className="error-message">{errors.confirm_new_password}</div>
                </div>

                <div className="row">
                  <em>Remember to let your team know the new password!</em>
                </div>

                <div className="row actions">
                  <button
                    type="submit"
                    className="retro-settings-form-submit button"
                    style={{fontSize: '1.1rem'}}
                    onClick={this.handleSubmitButtonClicked}
                  >
                    Save new password
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
  getRetroSettings: (retroId) => dispatch(getRetroSettings(retroId)),
  clearErrors: () => dispatch(clearErrors()),
  showRetroForId: (retroId) => dispatch(showRetroForId(retroId)),
  updateRetroPassword: (retroId, currentPassword, newPassword, requestUuid) => dispatch(updateRetroPassword(retroId, currentPassword, newPassword, requestUuid)),
  signOut: () => dispatch(signOut()),
});

const ConnectedShowRetroPasswordSettingsPage = connect(mapStateToProps, mapDispatchToProps)(ShowRetroPasswordSettingsPage);
export {ShowRetroPasswordSettingsPage, ConnectedShowRetroPasswordSettingsPage};
