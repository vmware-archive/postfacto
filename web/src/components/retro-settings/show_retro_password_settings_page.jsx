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
import RetroMenu from '../shared/retro_menu';
import EmptyPage from '../shared/empty_page';

export default class ShowRetroPasswordSettingsPage extends React.Component {
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
    this.handleCancelButtonClicked = this.handleCancelButtonClicked.bind(this);
  }

  componentWillMount() {
    const {retroId} = this.props;
    Actions.getRetroSettings({id: retroId});
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
    Actions.clearErrors();
  }

  handleBackButtonClicked() {
    const {retroId} = this.props;
    Actions.backPressedFromSettings({retro_id: retroId});
  }

  handleCancelButtonClicked() {
    const {retroId} = this.props;
    Actions.backPressedFromPasswordSettings({retro_id: retroId});
  }

  handleSubmitButtonClicked() {
    const errors = {};

    if (this.state.new_password !== this.state.confirm_new_password) {
      errors.confirm_new_password = 'Your passwords do not match!';
    } else {
      errors.confirm_new_password = '';

      Actions.updateRetroPassword({
        retro_id: this.props.retroId,
        new_password: this.state.new_password,
        current_password: this.state.current_password,
        request_uuid: this.props.session.request_uuid,
      });
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

  renderMobileHeading() {
    const {retro} = this.props;
    const menuItems = this.getMenuItems();

    return (
      <div className="retro-settings-heading-mobile">
        {this.renderBackButton()}
        <div className="retro-name">
          <h1>{retro.name}</h1>
        </div>
        <RetroMenu isMobile items={menuItems}/>
      </div>
    );
  }

  renderDesktopHeading() {
    const {retro} = this.props;
    const menuItems = this.getMenuItems();

    return (
      <div className="retro-heading">
        {this.renderBackButton()}
        <div className="retro-name">
          <h1>{retro.name}</h1>
        </div>
        <RetroMenu isMobile={false} items={menuItems}/>
      </div>
    );
  }

  getMenuItems() {
    const items = [
      {title: 'Sign out', callback: Actions.signOut, isApplicable: window.localStorage.length > 0},
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
      <span>
        <div className={retroContainerClasses}>
          {isMobile ? this.renderMobileHeading() : this.renderDesktopHeading()}
          <div>
            <div className="retro-settings-sidebar large-1 medium-1 columns"/>

            <div className="retro-settings large-11 medium-11 columns">
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
                  <button
                    className="retro-password-settings-cancel button"
                    type="button"
                    onClick={this.handleCancelButtonClicked}
                  >
                    Cancel
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
