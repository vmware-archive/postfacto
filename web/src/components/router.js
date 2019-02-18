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
import RetroCreatePage from './retro_create_page';
import ListRetrosPage from './list_retros_page';
import ShowRetroPage from './show_retro_page';
import ShowRetroSettingsPage from './show_retro_settings_page';
import ShowRetroPasswordSettingsPage from './show_retro_password_settings_page';
import LoginToRetroPage from './login_to_retro_page';
import ApiServerNotFoundPage from './api_server_not_found_page';
import RetroNotFoundPage from './retro_not_found_page';
import NotFoundPage from './not_found_page';
import NewTermsPage from './new_terms_page';
import EmptyPage from './empty_page';
import HomePage from './home_page';
import ListRetroArchivesPage from './list_retro_archives_page';
import Alert from './alert';
import RegistrationPage from './registration_page';

function isObject(obj) {
  return typeof obj === 'object';
}
function toFlattenedRoutes(routesHash) {
  /* eslint-disable no-param-reassign */
  return Object.keys(routesHash).reduce((paths, parent) => {
    if (isObject(routesHash[parent])) {
      const children = toFlattenedRoutes(routesHash[parent]);
      Object.keys(children).forEach(child => {
        paths[parent + child] = children[child];
      });
    } else {
      paths[parent] = routesHash[parent];
    }
    return paths;
  }, {});
  /* eslint-enable no-param-reassign */
}

const routes = {
  '*': 'showNotFound',
  '/': 'showHome',
  '/retros/:retroId': 'showRetro',
  '/retros/:retroId/archives': 'listRetroArchives',
  '/retros/:retroId/archives/:archiveId': 'showRetroArchive',
  '/retros/:retroId/login': 'loginToRetro',
  '/retros/:retroId/relogin': 'reloginToRetro',
  '/retros/:retroId/settings': 'showRetroSettings',
  '/retros/:retroId/settings/password': 'showRetroPasswordSettings',
  '/retros/new': 'createRetro',
  '/terms': 'showTerms',
  '/registration/:accessToken/:email/:fullName': 'showRegistration',
};

export default class Router extends React.Component {
  static propTypes = {
    router: types.oneOfType([types.object, types.func]),
    retro: types.object,
    config: types.object,
    alert: types.object,
    featureFlags: types.object,
  };

  constructor(props, context) {
    super(props, context);
    const {state} = this;
    this.state = {...state, Page: EmptyPage};
  }

  componentDidMount() {
    const {router} = this.props;
    Object.entries(toFlattenedRoutes(routes)).forEach(([path, callbackName]) => {
      router.get(path, this[callbackName]);
    });

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

  createRetro = () => {
    this.setState({Page: RetroCreatePage});
  };

  showRetro = (req) => {
    if (req.params.retroId !== 'new') {
      Actions.retroIdRouted(req.params.retroId);
      this.setState({Page: ShowRetroPage, additionalProps: {retroId: req.params.retroId, archives: false}});
    }
  };

  listRetros = () => {
    this.setState({Page: ListRetrosPage});
  };

  listRetroArchives = (req) => {
    Actions.retroIdRouted(req.params.retroId);
    this.setState({Page: ListRetroArchivesPage, additionalProps: {retroId: req.params.retroId}});
  };

  showRetroArchive = (req) => {
    Actions.retroIdRouted(req.params.retroId);
    this.setState({
      Page: ShowRetroPage,
      additionalProps: {retroId: req.params.retroId, archives: true, archiveId: req.params.archiveId},
    });
  };

  showRetroSettings = (req) => {
    Actions.retroIdRouted(req.params.retroId);
    this.setState({Page: ShowRetroSettingsPage, additionalProps: {retroId: req.params.retroId}});
  };

  showRetroPasswordSettings = (req) => {
    Actions.retroIdRouted(req.params.retroId);
    this.setState({Page: ShowRetroPasswordSettingsPage, additionalProps: {retroId: req.params.retroId}});
  };

  showNotFound = () => {
    this.setState({Page: NotFoundPage});
  };

  showTerms = () => {
    this.setState({Page: NewTermsPage});
  };

  loginToRetro = (req) => {
    this.setState({Page: LoginToRetroPage, additionalProps: {retroId: req.params.retroId}});
  };

  reloginToRetro = (req) => {
    this.setState({Page: LoginToRetroPage, additionalProps: {retroId: req.params.retroId, force_relogin: true}});
  };

  showHome = () => {
    if (this.isUserLoggedIn()) {
      this.listRetros();
    } else {
      this.setState({Page: HomePage});
    }
  };

  showRegistration = (req) => {
    this.setState({
      Page: RegistrationPage,
      additionalProps: {accessToken: req.params.accessToken, email: req.params.email, fullName: req.params.fullName},
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
