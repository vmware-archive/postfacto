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
const initialState = {
  errors: {},
  dialog: null,
  alert: null,
  not_found: {
    retro_not_found: false,
    not_found: false,
    api_server_not_found: false,
  },
};

const MessageReducer = () => (state = initialState, action) => {
  if (action.type === 'ERRORS_UPDATED') {
    return Object.assign({}, state, {errors: action.payload});
  }

  if (action.type === 'CLEAR_ERRORS') {
    return Object.assign({}, state, {errors: {}});
  }

  if (action.type === 'SHOW_DIALOG') {
    return Object.assign({}, state, {dialog: action.payload});
  }

  if (action.type === 'CLEAR_DIALOG') {
    return Object.assign({}, state, {dialog: null});
  }

  if (action.type === 'SHOW_ALERT') {
    return Object.assign({}, state, {alert: action.payload});
  }

  if (action.type === 'CLEAR_ALERT') {
    return Object.assign({}, state, {alert: null});
  }

  if (action.type === 'SET_NOT_FOUND') {
    return Object.assign({}, state, {not_found: action.payload});
  }

  return state;
};

export default MessageReducer;
