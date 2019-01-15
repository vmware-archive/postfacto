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

// import isomorphic_fetch from 'isomorphic-fetch' //TODO Check if create-react-app does this polyfill for us
import {Actions} from 'p-flux';

export function fetchJson(url, {accessToken, headers, ...options} = {}) {
  const acceptHeaders = {accept: 'application/json', 'Content-Type': 'application/json'};
  const authorizationHeaders = accessToken ? {authorization: `Bearer ${accessToken}`} : {};
  options = {credentials: 'same-origin', headers: {...acceptHeaders, ...authorizationHeaders, ...headers}, ...options};
  return fetch(url, options)
    .then((response) => {
      if (response.status === 204) { return [response.status, '']; }
      return Promise.all([Promise.resolve(response.status), response.json()]);
    })
    .catch(() => {
      Actions.apiServerNotFound();
      return [];
    });
}
