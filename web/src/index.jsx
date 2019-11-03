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
import ReactDOM from 'react-dom';
import './stylesheets/application.scss';
import EnhancedApplication from './Application';

const {config} = global.Retro;

if (process.env.REACT_APP_USE_MOCK_GOOGLE === 'true') {
  // Mock Google auth (mock-google-server)
  config.mock_google_auth = true;
  config.google_oauth_client_id = null;
  window.mock_google_auth = 'expected-valid-access-token_manual-testing';
} else if (process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID) {
  // Real Google auth
  config.mock_google_auth = false;
  config.google_oauth_client_id = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID;
} else if (!config.google_oauth_client_id) {
  // No login (must create retros via admin interface)
  config.mock_google_auth = false;
  config.google_oauth_client_id = null;
}

window.Retro = {config};

ReactDOM.render(<EnhancedApplication {...{config}}/>, document.getElementById('root'));
