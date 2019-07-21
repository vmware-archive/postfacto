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
import Logger from '../../helpers/logger';
import {
  clearErrors,
  currentRetroActionItemDeleted,
  currentRetroActionItemUpdated,
  currentRetroHighlightCleared, currentRetroItemDeleted,
  currentRetroItemDoneUpdated, currentRetroItemUpdated,
  currentRetroUpdated,
  errorsUpdated, retrosUpdated,
  setNotFound,
  showAlert, signOut,
  updateCurrentArchivedRetro,
  updateFeatureFlags,
  updateRetroArchives,
} from '../actions/main_actions';
import {
  archivedRetro,
  createdRetro,
  createdRetroItem,
  doneActionItem,
  undoneActionItem, visitedRetro,
} from '../actions/analytics_actions';
import {
  home,
  newRetro,
  registration,
  retroLogin,
  retroSettings,
  showRetro,
  showRetroForId,
} from '../actions/router_actions';

export function getApiToken(retroId) {
  return localStorage.getItem('apiToken-' + retroId);
}

function setApiToken(retroId, token) {
  localStorage.setItem('apiToken-' + retroId, token);
}

function resetApiToken(oldRetroId, newRetroId) {
  if (oldRetroId === newRetroId) {
    return;
  }

  localStorage.setItem('apiToken-' + newRetroId, localStorage.getItem('apiToken-' + oldRetroId));
  localStorage.removeItem('apiToken-' + oldRetroId);
}

const ApiMiddleware = (retroClient) => (store) => (next) => (action) => {
  if (action.type === 'RETRO_CREATE') {
    Logger.info('retroCreate');
    retroClient.createRetro(action.payload).then(([status, data]) => {
      if (status >= 200 && status < 400) {
        const token = data.token;
        if (token) {
          setApiToken(data.retro.slug, token);
        }

        store.dispatch(clearErrors());
        store.dispatch(showRetro(data.retro));
        store.dispatch(createdRetro(data.retro.id));
      } else if (status === 422) {
        store.dispatch(errorsUpdated(data.errors));
      }
    });
    return;
  }

  if (action.type === 'UPDATE_RETRO_SETTINGS') {
    Logger.info('updateRetroSettings');

    const {retroId, retroName, newSlug, oldSlug, isPrivate, requestUuid, videoLink} = action.payload;
    retroClient.updateRetro(retroId, retroName, newSlug, getApiToken(retroId), isPrivate, requestUuid, videoLink).then(([status, data]) => {
      if (status >= 200 && status < 400) {
        resetApiToken(oldSlug, newSlug);
        const retro = {name: retroName, slug: newSlug, is_private: data.retro.is_private};
        store.dispatch(currentRetroUpdated(retro));
        store.dispatch(clearErrors());
        store.dispatch(showRetro(retro));
        store.dispatch(showAlert({
          checkIcon: true,
          message: 'Settings saved!',
          className: 'alert-with-back-button',
        }));
      } else if (status === 403) {
        store.dispatch(retroLogin(retroId));
      } else if (status === 422) {
        store.dispatch(errorsUpdated(data.errors));
      }
    });
    return;
  }

  if (action.type === 'UPDATE_RETRO_PASSWORD') {
    Logger.info('updateRetroPassword');
    const {retroId, currentPassword, newPassword, requestUuid} = action.payload;
    retroClient.updateRetroPassword(retroId, currentPassword, newPassword, requestUuid, getApiToken(retroId))
      .then(([status, data]) => {
        if (status >= 200 && status < 400) {
          store.dispatch(clearErrors());
          window.localStorage.setItem(`apiToken-${retroId}`, data.token);

          store.dispatch(retroSettings(retroId));
          store.dispatch(showAlert({checkIcon: true, message: 'Password changed'}));
        } else if (status === 422) {
          store.dispatch(errorsUpdated(data.errors));
        }
      });
    return;
  }

  if (action.type === 'GET_RETROS') {
    retroClient.getRetros().then(([status, data]) => {
      if (status === 403) {
        store.dispatch(signOut());
      } else {
        store.dispatch(retrosUpdated(data.retros));
      }
    });

    return;
  }

  if (action.type === 'GET_RETRO') {
    Logger.info('getRetro');
    const retroId = action.payload;
    retroClient.getRetro(retroId, getApiToken(retroId)).then(([status, data]) => {
      if (status >= 200 && status < 400) {
        store.dispatch(currentRetroUpdated(data.retro));
        store.dispatch(visitedRetro(data.retro.id));
      } else if (status === 403) {
        store.dispatch(retroLogin(retroId));
      } else if (status === 404) {
        Logger.warn(`getRetro: Retro not found, retroId=${retroId}`);
        store.dispatch(setNotFound({retro_not_found: true}));
      }
    });
    return;
  }

  if (action.type === 'GET_RETRO_LOGIN') {
    Logger.info('getRetroLogin');
    const retroId = action.payload;
    retroClient.getRetroLogin(retroId).then(([status, data]) => {
      if (status >= 200 && status < 400) {
        store.dispatch(currentRetroUpdated(data.retro));
      } else if (status === 404) {
        Logger.warn(`getRetro: Retro not found, retroId=${retroId}`);
        store.dispatch(setNotFound({retro_not_found: true}));
      }
    });
    return;
  }

  if (action.type === 'GET_RETRO_SETTINGS') {
    Logger.info('getRetroSettings');
    const id = action.payload;
    retroClient.getRetroSettings(id, getApiToken(id)).then(([status, data]) => {
      if (status >= 200 && status < 400) {
        store.dispatch(currentRetroUpdated(data.retro));
      } else if (status === 403) {
        store.dispatch(retroLogin(id));
      } else if (status === 404) {
        Logger.warn(`getRetro: Retro not found, retroId=${id}`);
        store.dispatch(setNotFound({retro_not_found: true}));
      }
    });
    return;
  }

  if (action.type === 'LOGIN_TO_RETRO') {
    Logger.info('loginToRetro');
    const {retroId, password} = action.payload;
    retroClient.loginToRetro({retro_id: retroId, password}).then(([status, response]) => {
      if (status >= 200 && status < 400) {
        const token = response.token;
        if (token) {
          setApiToken(retroId, token);
        }
        store.dispatch(showRetroForId(retroId));
      } else {
        store.dispatch(errorsUpdated({login_error_message: 'Oops, wrong password!'}));
      }
    });
    return;
  }

  if (action.type === 'DELETE_RETRO_ITEM') {
    Logger.info('deleteRetroItem');
    const {retroId, item} = action.payload;
    retroClient.deleteRetroItem(retroId, item.id, getApiToken(retroId));
    store.dispatch(currentRetroItemDeleted(item));
    return;
  }

  if (action.type === 'CREATE_RETRO_ITEM') {
    Logger.info('createRetroItem');
    const {retroId, category, description} = action.payload;
    retroClient.createRetroItem(retroId, category, description, getApiToken(retroId)).then(([, data]) => {
      store.dispatch(currentRetroItemUpdated(data.item));
      store.dispatch(createdRetroItem(retroId, data.item.category));
    });
    return;
  }

  if (action.type === 'UPDATE_RETRO_ITEM') {
    Logger.info('updateRetroItem');
    const {retroId, item, description} = action.payload;
    retroClient.updateRetroItem(retroId, item.id, description, getApiToken(retroId));
    return;
  }

  if (action.type === 'VOTE_RETRO_ITEM') {
    const {retroId, item} = action.payload;
    Logger.info('voteRetroItem');
    retroClient.voteRetroItem(retroId, item.id, getApiToken(retroId)).then(([, data]) => {
      store.dispatch(currentRetroItemUpdated(data.item));
    });
    return;
  }
  if (action.type === 'NEXT_RETRO_ITEM') {
    Logger.info('nextRetroItem');
    const retro = action.payload;
    if (retro.highlighted_item_id !== null) {
      store.dispatch(currentRetroItemDoneUpdated(retro.highlighted_item_id, true));
    }
    retroClient.nextRetroItem(retro.slug, getApiToken(retro.slug));
    return;
  }

  if (action.type === 'HIGHLIGHT_RETRO_ITEM') {
    Logger.info('highlightRetroItem');
    const {retroId, item} = action.payload;
    retroClient.highlightRetroItem(retroId, item.id, getApiToken(retroId)).then(([, data]) => {
      store.dispatch(currentRetroUpdated(data.retro));
    });
    return;
  }

  if (action.type === 'UNHIGHLIGHT_RETRO_ITEM') {
    Logger.info('unhighlightRetroItem');
    const retroId = action.payload;
    retroClient.unhighlightRetroItem(retroId, getApiToken(retroId));
    store.dispatch(currentRetroHighlightCleared());
    return;
  }

  if (action.type === 'DONE_RETRO_ITEM') {
    Logger.info('doneRetroItem');
    const {retroId, item} = action.payload;
    retroClient.doneRetroItem(retroId, item.id, getApiToken(retroId));
    store.dispatch(currentRetroItemDoneUpdated(item.id, true));
    return;
  }

  if (action.type === 'UNDONE_RETRO_ITEM') {
    Logger.info('undoneRetroItem');
    const {retroId, item} = action.payload;
    retroClient.undoneRetroItem(retroId, item.id, getApiToken(retroId));
    store.dispatch(currentRetroItemDoneUpdated(item.id, false));
    return;
  }

  if (action.type === 'EXTEND_TIMER') {
    Logger.info('extendTimer');
    const retroId = action.payload;
    retroClient.extendTimer(retroId, getApiToken(retroId)).then(([, data]) => {
      store.dispatch(currentRetroUpdated(data.retro));
    });
    return;
  }

  if (action.type === 'ARCHIVE_RETRO') {
    Logger.info('archiveRetro');
    const retro = action.payload;
    retroClient.archiveRetro(retro.slug, getApiToken(retro.slug), retro.send_archive_email).then(([status, data]) => {
      if (status >= 200 && status < 400) {
        store.dispatch(currentRetroUpdated(data.retro));
        store.dispatch(archivedRetro(data.retro.id));
        store.dispatch(showAlert({message: 'Archived!'}));
      } else if (status === 403) {
        store.dispatch(retroLogin(retro.slug));
      }
    });
    return;
  }

  if (action.type === 'CREATE_RETRO_ACTION_ITEM') {
    Logger.info('createRetroActionItem');
    const {retroId, description} = action.payload;
    retroClient.createRetroActionItem(retroId, description, getApiToken(retroId));
    return;
  }

  if (action.type === 'DONE_RETRO_ACTION_ITEM') {
    const {retroId, actionItemId, done} = action.payload;
    Logger.info('doneRetroActionItem');
    retroClient.doneRetroActionItem(retroId, actionItemId, done, getApiToken(retroId)).then(([, data]) => {
      store.dispatch(currentRetroActionItemUpdated(data.action_item));

      if (data.action_item.done) {
        store.dispatch(doneActionItem(retroId));
      } else {
        store.dispatch(undoneActionItem(retroId));
      }
    });
    return;
  }

  if (action.type === 'DELETE_RETRO_ACTION_ITEM') {
    const {retroId, actionItem} = action.payload;
    Logger.info('deleteRetroActionItem');
    retroClient.deleteRetroActionItem(retroId, actionItem.id, getApiToken(retroId));
    store.dispatch(currentRetroActionItemDeleted(actionItem));
    return;
  }

  if (action.type === 'EDIT_RETRO_ACTION_ITEM') {
    Logger.info('editRetroActionItem');
    const {retroId, actionItemId, description} = action.payload;
    retroClient.editRetroActionItem(retroId, actionItemId, description, getApiToken(retroId)).then(([, data]) => {
      store.dispatch(currentRetroActionItemUpdated(data.action_item));
    });
    return;
  }

  if (action.type === 'GET_RETRO_ARCHIVES') {
    const retroId = action.payload;
    Logger.info('getRetroArchives');
    retroClient.getRetroArchives(retroId, getApiToken(retroId)).then(([status, data]) => {
      if (status >= 200 && status < 400) {
        store.dispatch(updateRetroArchives(data.archives));
      } else if (status === 403) {
        store.dispatch(retroLogin(retroId));
      } else if (status === 404) {
        store.dispatch(setNotFound({retro_not_found: true}));
      }
    });
    return;
  }

  if (action.type === 'GET_RETRO_ARCHIVE') {
    Logger.info('getRetroArchive');
    const {retroId, archiveId} = action.payload;
    retroClient.getRetroArchive(retroId, archiveId, getApiToken(retroId)).then(([status, data]) => {
      if (status >= 200 && status < 400) {
        store.dispatch(updateCurrentArchivedRetro(data.retro));
      } else if (status === 403) {
        store.dispatch(retroLogin(retroId));
      } else if (status === 404) {
        store.dispatch(setNotFound({not_found: true}));
      }
    });
    return;
  }

  if (action.type === 'CREATE_USER') {
    Logger.info('createUser');
    const {accessToken, companyName, fullName} = action.payload;
    retroClient.createUser(accessToken, companyName, fullName).then(([, response]) => {
      localStorage.setItem('authToken', response.auth_token);
      store.dispatch(newRetro());
    });
    return;
  }

  if (action.type === 'CREATE_SESSION') {
    const {accessToken, email, name} = action.payload;
    retroClient.createSession(accessToken).then(([status, data]) => {
      if (status === 200) {
        localStorage.setItem('authToken', data.auth_token);
        if (data.new_user) {
          store.dispatch(newRetro());
        } else {
          store.dispatch(home());
        }
      } else if (status === 404) {
        store.dispatch(registration(accessToken, email, name));
      }
    });
    return;
  }

  if (action.type === 'RETRIEVE_CONFIG') {
    Logger.info('retrieveConfig');
    retroClient.retrieveConfig().then(([status, data]) => {
      if (status >= 200 && status < 400) {
        store.dispatch(updateFeatureFlags({
          archiveEmails: data.archive_emails,
        }));
      } else if (status === 404) {
        store.dispatch(setNotFound({not_found: true}));
      }
    });
    return;
  }


  next(action);
};

export default ApiMiddleware;
