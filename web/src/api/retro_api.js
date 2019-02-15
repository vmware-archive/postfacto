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

import {fetchJson} from '../helpers/fetch_helper';

export default {
  apiBaseUrl() {
    return global.Retro.config.api_base_url;
  },

  createRetro(data) {
    return fetchJson(`${this.apiBaseUrl()}/retros`, {
      method: 'POST',
      headers: {
        'X-AUTH-TOKEN': localStorage.getItem('authToken'),
      },
      body: JSON.stringify({
        retro: {
          name: data.name,
          slug: data.slug,
          password: data.password,
          is_private: data.isPrivate,
        },
      }),
    });
  },

  updateRetro(id, name, slug, token, is_private, request_uuid, video_link) {
    return fetchJson(`${this.apiBaseUrl()}/retros/${id}`, {
      method: 'PATCH',
      accessToken: token,
      body: JSON.stringify({
        retro: {
          name: name,
          slug: slug,
          is_private: is_private,
          video_link: video_link,
        },
        request_uuid: request_uuid,
      }),
    });
  },

  getRetro(id, token) {
    return fetchJson(`${this.apiBaseUrl()}/retros/${id}`, {accessToken: token});
  },

  getRetros() {
    return fetchJson(`${this.apiBaseUrl()}/retros`, {
      method: 'GET',
      headers: {
        'X-AUTH-TOKEN': localStorage.getItem('authToken'),
      },
    });
  },
  getRetroSettings(id, token) {
    return fetchJson(`${this.apiBaseUrl()}/retros/${id}/settings`, {accessToken: token});
  },

  getRetroLogin(id) {
    return fetchJson(`${this.apiBaseUrl()}/retros/${id}/login`);
  },

  loginToRetro({retro_id, password}) {
    return fetchJson(`${this.apiBaseUrl()}/retros/${retro_id}/login`, {
      method: 'PUT',
      body: JSON.stringify({retro: {password}}),
    });
  },

  createRetroItem(retro_id, category, description, token) {
    return fetchJson(`${this.apiBaseUrl()}/retros/${retro_id}/items`, {
      method: 'POST',
      accessToken: token,
      body: JSON.stringify({description, category}),
    });
  },

  updateRetroItem(retro_id, item_id, description, token) {
    return fetchJson(`${this.apiBaseUrl()}/retros/${retro_id}/items/${item_id}`, {
      method: 'PATCH',
      accessToken: token,
      body: JSON.stringify({description}),
    });
  },

  deleteRetroItem(retro_id, item_id, token) {
    return fetchJson(`${this.apiBaseUrl()}/retros/${retro_id}/items/${item_id}`, {
      method: 'DELETE',
      accessToken: token,
    });
  },

  voteRetroItem(retro_id, item_id, token) {
    return fetchJson(`${this.apiBaseUrl()}/retros/${retro_id}/items/${item_id}/vote`, {
      method: 'POST',
      accessToken: token,
    });
  },

  nextRetroItem(retro_id, token) {
    return fetchJson(`${this.apiBaseUrl()}/retros/${retro_id}/discussion/transitions`, {
      method: 'POST',
      accessToken: token,
      body: JSON.stringify({transition: 'NEXT'}),
    });
  },

  highlightRetroItem(retro_id, item_id, token) {
    return fetchJson(`${this.apiBaseUrl()}/retros/${retro_id}/discussion`, {
      method: 'POST',
      accessToken: token,
      body: JSON.stringify({item_id}),
    });
  },

  unhighlightRetroItem(retro_id, token) {
    return fetchJson(`${this.apiBaseUrl()}/retros/${retro_id}/discussion`, {
      method: 'DELETE',
      accessToken: token,
    });
  },

  doneRetroItem(retro_id, item_id, token) {
    return fetchJson(`${this.apiBaseUrl()}/retros/${retro_id}/items/${item_id}/done`, {
      method: 'PATCH',
      accessToken: token,
    });
  },

  undoneRetroItem(retro_id, item_id, token) {
    return fetchJson(`${this.apiBaseUrl()}/retros/${retro_id}/items/${item_id}/done`, {
      method: 'PATCH',
      accessToken: token,
      body: JSON.stringify({done: false}),
    });
  },

  extendTimer(retro_id, token) {
    return fetchJson(`${this.apiBaseUrl()}/retros/${retro_id}/discussion`, {
      method: 'PATCH',
      accessToken: token,
    });
  },

  archiveRetro(retro_id, token, send_archive_email) {
    return fetchJson(`${this.apiBaseUrl()}/retros/${retro_id}/archive`, {
      method: 'PUT',
      accessToken: token,
      body: JSON.stringify({send_archive_email}),
    });
  },

  createRetroActionItem(retro_id, description, token) {
    return fetchJson(`${this.apiBaseUrl()}/retros/${retro_id}/action_items`, {
      method: 'POST',
      accessToken: token,
      body: JSON.stringify({description}),
    });
  },

  deleteRetroActionItem(retro_id, action_item_id, token) {
    return fetchJson(`${this.apiBaseUrl()}/retros/${retro_id}/action_items/${action_item_id}`, {
      method: 'DELETE',
      accessToken: token,
    });
  },

  doneRetroActionItem(retro_id, action_item_id, done, token) {
    return fetchJson(`${this.apiBaseUrl()}/retros/${retro_id}/action_items/${action_item_id}`, {
      method: 'PATCH',
      accessToken: token,
      body: JSON.stringify({done}),
    });
  },

  editRetroActionItem(retro_id, action_item_id, description, token) {
    return fetchJson(`${this.apiBaseUrl()}/retros/${retro_id}/action_items/${action_item_id}`, {
      method: 'PATCH',
      accessToken: token,
      body: JSON.stringify({description}),
    });
  },

  getRetroArchive(retro_id, archive_id, token) {
    return fetchJson(`${this.apiBaseUrl()}/retros/${retro_id}/archives/${archive_id}`, {accessToken: token});
  },

  getRetroArchives(retro_id, token) {
    return fetchJson(`${this.apiBaseUrl()}/retros/${retro_id}/archives`, {accessToken: token});
  },

  createUser(token, company_name, full_name) {
    return fetchJson(`${this.apiBaseUrl()}/users`, {
      method: 'POST',
      body: JSON.stringify({access_token: token, company_name, full_name}),
    });
  },

  createSession(token) {
    return fetchJson(`${this.apiBaseUrl()}/sessions`, {
      method: 'POST',
      body: JSON.stringify({access_token: token}),
    });
  },

  updateRetroPassword(retro_id, current_password, new_password, request_uuid, token) {
    return fetchJson(`${this.apiBaseUrl()}/retros/${retro_id}/password`, {
      method: 'PATCH',
      accessToken: token,
      body: JSON.stringify({
        current_password,
        new_password,
        request_uuid,
      }),
    });
  },

  retrieveConfig() {
    return fetchJson(`${this.apiBaseUrl()}/config`);
  }
};
