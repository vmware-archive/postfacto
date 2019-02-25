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
import types from 'prop-types';
import RetroCreatePage from './retro-create/retro_create_page';
import ListRetrosPage from './retros-list/list_retros_page';
import ShowRetroPage from './retro-show/show_retro_page';
import ShowRetroSettingsPage from './retro-settings/show_retro_settings_page';
import ShowRetroPasswordSettingsPage from './retro-settings/show_retro_password_settings_page';
import LoginToRetroPage from './retro-login/login_to_retro_page';
import ApiServerNotFoundPage from './server-lost/api_server_not_found_page';
import RetroNotFoundPage from './retro-not-found/retro_not_found_page';
import NotFoundPage from './not-found/not_found_page';
import NewTermsPage from './terms/new_terms_page';
import EmptyPage from './shared/empty_page';
import HomePage from './home/home_page';
import ListRetroArchivesPage from './retro-archives/list_retro_archives_page';
import Alert from './shared/alert';
import RegistrationPage from './registration/registration_page';
import useRouter from './use_router';

export class Router extends React.Component {
  static propTypes = {
    router: types.object.isRequired,
    retro: types.object,
    config: types.object,
    alert: types.object,
    featureFlags: types.object,
  };

  static defaultProps = {
    retro: null,
    config: null,
    alert: null,
    featureFlags: {},
  };

  constructor(props) {
    super(props);
    this.state = {Page: EmptyPage, additionalProps: {}};
  }

  componentDidMount() {
    const {router} = this.props;

    router.get('*', this.showNotFound);
    router.get('/', this.showHome);
    router.get('/retros/:retroId', this.showRetro);
    router.get('/retros/:retroId/archives', this.listRetroArchives);
    router.get('/retros/:retroId/archives/:archiveId', this.showRetroArchive);
    router.get('/retros/:retroId/login', this.loginToRetro);
    router.get('/retros/:retroId/relogin', this.reloginToRetro);
    router.get('/retros/:retroId/settings', this.showRetroSettings);
    router.get('/retros/:retroId/settings/password', this.showRetroPasswordSettings);
    router.get('/terms', this.showTerms);
    router.get('/registration/:accessToken/:email/:fullName', this.showRegistration);

    Actions.retrieveConfig();
  }

  componentWillReceiveProps(nextProps) {
    const {api_server_not_found, retro_not_found, not_found} = nextProps;
    if (api_server_not_found) {
      this.setState({Page: ApiServerNotFoundPage});
    }
    if (retro_not_found) {
      this.setState({Page: RetroNotFoundPage});
    }
    if (not_found) {
      this.setState({Page: NotFoundPage});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.Page !== prevState.Page) {
      Actions.hideAlert();
    }
  }

  showRetro = (req) => {
    const {retroId} = req.params;
    if (retroId === 'new') {
      this.setState({Page: RetroCreatePage});
      return;
    }

    Actions.retroIdRouted(retroId);
    this.setState({Page: ShowRetroPage, additionalProps: {retroId, archives: false}});
  };

  listRetros = () => {
    this.setState({Page: ListRetrosPage});
  };

  listRetroArchives = (req) => {
    const {retroId} = req.params;
    Actions.retroIdRouted(retroId);
    this.setState({Page: ListRetroArchivesPage, additionalProps: {retroId}});
  };

  showRetroArchive = (req) => {
    const {retroId, archiveId} = req.params;
    Actions.retroIdRouted(retroId);
    this.setState({
      Page: ShowRetroPage,
      additionalProps: {retroId, archives: true, archiveId},
    });
  };

  showRetroSettings = (req) => {
    const {retroId} = req.params;
    Actions.retroIdRouted(retroId);
    this.setState({Page: ShowRetroSettingsPage, additionalProps: {retroId}});
  };

  showRetroPasswordSettings = (req) => {
    const {retroId} = req.params;
    Actions.retroIdRouted(retroId);
    this.setState({Page: ShowRetroPasswordSettingsPage, additionalProps: {retroId}});
  };

  showNotFound = () => {
    this.setState({Page: NotFoundPage});
  };

  showTerms = () => {
    this.setState({Page: NewTermsPage});
  };

  loginToRetro = (req) => {
    const {retroId} = req.params;
    this.setState({Page: LoginToRetroPage, additionalProps: {retroId}});
  };

  reloginToRetro = (req) => {
    const {retroId} = req.params;
    this.setState({Page: LoginToRetroPage, additionalProps: {retroId, force_relogin: true}});
  };

  showHome = () => {
    if (this.isUserLoggedIn()) {
      this.listRetros();
    } else {
      this.setState({Page: HomePage});
    }
  };

  showRegistration = (req) => {
    const {accessToken, email, fullName} = req.params;
    this.setState({
      Page: RegistrationPage,
      additionalProps: {accessToken, email, fullName},
    });
  };

  render() {
    const {Page, additionalProps} = this.state;
    const {alert} = this.props;

    return (
      <div>
        <Alert alert={alert}/>
        <Page {...this.props} {...additionalProps}/>
      </div>
    );
  }

  isUserLoggedIn() {
    return localStorage.getItem('authToken');
  }
}

export default useRouter(Router);
