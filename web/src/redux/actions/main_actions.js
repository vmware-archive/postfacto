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
export function currentRetroUpdated(retro) {
  return {
    type: 'CURRENT_RETRO_UPDATED',
    payload: retro,
  };
}

export function currentRetroItemUpdated(item) {
  return {
    type: 'CURRENT_RETRO_ITEM_UPDATED',
    payload: item,
  };
}


export function currentRetroActionItemUpdated(actionItem) {
  return {
    type: 'CURRENT_RETRO_ACTION_ITEM_UPDATED',
    payload: actionItem,
  };
}

export function currentRetroActionItemDeleted(actionItem) {
  return {
    type: 'CURRENT_RETRO_ACTION_ITEM_DELETED',
    payload: actionItem,
  };
}

export function currentRetroItemDeleted(item) {
  return {
    type: 'CURRENT_RETRO_ITEM_DELETED',
    payload: item,
  };
}

export function currentRetroItemDoneUpdated(itemId, done) {
  return {
    type: 'CURRENT_RETRO_ITEM_DONE_UPDATED',
    payload: {itemId, done},
  };
}


export function currentRetroSendArchiveEmailUpdated(status) {
  return {
    type: 'CURRENT_RETRO_SEND_ARCHIVE_EMAIL_UPDATED',
    payload: status,
  };
}

export function currentRetroHighlightCleared() {
  return {
    type: 'CURRENT_RETRO_HIGHLIGHT_CLEARED',
  };
}

export function retrosUpdated(retros) {
  return {
    type: 'RETROS_UPDATED',
    payload: retros,
  };
}

export function getRetros() {
  return {
    type: 'GET_RETROS',
  };
}

export function errorsUpdated(errors) {
  return {
    type: 'ERRORS_UPDATED',
    payload: errors,
  };
}

export function clearErrors() {
  return {
    type: 'CLEAR_ERRORS',
  };
}

export function showDialog(dialog) {
  return {
    type: 'SHOW_DIALOG',
    payload: dialog,
  };
}

export function clearDialog() {
  return {
    type: 'CLEAR_DIALOG',
  };
}


export function showAlert(alert) {
  return {
    type: 'SHOW_ALERT',
    payload: alert,
  };
}

export function clearAlert() {
  return {
    type: 'CLEAR_ALERT',
  };
}

export function setNotFound(notFound) {
  return {
    type: 'SET_NOT_FOUND',
    payload: notFound,
  };
}

export function updateWebsocketSession(session) {
  return {
    type: 'WEBSOCKET_SESSION_UPDATED',
    payload: session,
  };
}

export function updateCurrentArchivedRetro(retro) {
  return {
    type: 'CURRENT_ARCHIVED_RETRO_UPDATED',
    payload: retro,
  };
}

export function updateRetroArchives(retros) {
  return {
    type: 'RETRO_ARCHIVES_UPDATED',
    payload: retros,
  };
}

export function updateFeatureFlags(featureFlags) {
  return {
    type: 'FEATURE_FLAGS_UPDATED',
    payload: featureFlags,
  };
}

export function signOut() {
  return {
    type: 'SIGN_OUT',
  };
}

export function forceRelogin(originatorId, retroId) {
  return {
    type: 'FORCE_RELOGIN',
    payload: {
      originatorId,
      retroId,
    },
  };
}
