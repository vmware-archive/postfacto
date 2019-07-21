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

const retroCreate = (newRetro) => ({
  type: 'RETRO_CREATE',
  payload: newRetro,
});
const getRetro = (id) => ({
  type: 'GET_RETRO',
  payload: id,
});
const getRetroSettings = (id) => ({
  type: 'GET_RETRO_SETTINGS',
  payload: id,
});
const getRetroLogin = (retroId) => ({
  type: 'GET_RETRO_LOGIN',
  payload: retroId,
});
const loginToRetro = (retroId, password) => ({
  type: 'LOGIN_TO_RETRO',
  payload: {retroId, password},
});
const createRetroItem = (retroId, category, description) => ({
  type: 'CREATE_RETRO_ITEM',
  payload: {retroId, category, description},
});
const updateRetroItem = (retroId, item, description) => ({
  type: 'UPDATE_RETRO_ITEM',
  payload: {retroId, item, description},
});
const deleteRetroItem = (retroId, item) => ({
  type: 'DELETE_RETRO_ITEM',
  payload: {retroId, item},
});
const voteRetroItem = (retroId, item) => ({
  type: 'VOTE_RETRO_ITEM',
  payload: {retroId, item},
});
const nextRetroItem = (retro) => ({
  type: 'NEXT_RETRO_ITEM',
  payload: retro,
});
const highlightRetroItem = (retroId, item) => ({
  type: 'HIGHLIGHT_RETRO_ITEM',
  payload: {retroId, item},
});
const unhighlightRetroItem = (retroId) => ({
  type: 'UNHIGHLIGHT_RETRO_ITEM',
  payload: retroId,
});
const doneRetroItem = (retroId, item) => ({
  type: 'DONE_RETRO_ITEM',
  payload: {retroId, item},
});
const undoneRetroItem = (retroId, item) => ({
  type: 'UNDONE_RETRO_ITEM',
  payload: {retroId, item},
});
const extendTimer = (retroId) => ({
  type: 'EXTEND_TIMER',
  payload: retroId,
});
const archiveRetro = (retro) => ({
  type: 'ARCHIVE_RETRO',
  payload: retro,
});
const createRetroActionItem = (retroId, description) => ({
  type: 'CREATE_RETRO_ACTION_ITEM',
  payload: {retroId, description},
});
const doneRetroActionItem = (retroId, actionItemId, done) => ({
  type: 'DONE_RETRO_ACTION_ITEM',
  payload: {retroId, actionItemId, done},
});
const deleteRetroActionItem = (retroId, actionItem) => ({
  type: 'DELETE_RETRO_ACTION_ITEM',
  payload: {retroId, actionItem},
});
const editRetroActionItem = (retroId, actionItemId, description) => ({
  type: 'EDIT_RETRO_ACTION_ITEM',
  payload: {retroId, actionItemId, description},
});
const getRetroArchive = (retroId, archiveId) => ({
  type: 'GET_RETRO_ARCHIVE',
  payload: {retroId, archiveId},
});
const getRetroArchives = (retroId) => ({
  type: 'GET_RETRO_ARCHIVES',
  payload: retroId,
});
const createUser = (accessToken, companyName, fullName) => ({
  type: 'CREATE_USER',
  payload: {accessToken, companyName, fullName},
});
const createSession = (accessToken, email, name) => ({
  type: 'CREATE_SESSION',
  payload: {accessToken, email, name},
});
const updateRetroSettings = (retroId, retroName, newSlug, oldSlug, isPrivate, requestUuid, videoLink) => ({
  type: 'UPDATE_RETRO_SETTINGS',
  payload: {retroId, retroName, newSlug, oldSlug, isPrivate, requestUuid, videoLink},
});
const updateRetroPassword = (retroId, currentPassword, newPassword, requestUuid) => ({
  type: 'UPDATE_RETRO_PASSWORD',
  payload: {retroId, currentPassword, newPassword, requestUuid},
});
const retrieveConfig = () => ({
  type: 'RETRIEVE_CONFIG',
  payload: {},
});

export {
  retroCreate,
  getRetro,
  getRetroSettings,
  getRetroLogin,
  loginToRetro,
  createRetroItem,
  updateRetroItem,
  deleteRetroItem,
  voteRetroItem,
  nextRetroItem,
  highlightRetroItem,
  unhighlightRetroItem,
  doneRetroItem,
  undoneRetroItem,
  extendTimer,
  archiveRetro,
  createRetroActionItem,
  doneRetroActionItem,
  deleteRetroActionItem,
  editRetroActionItem,
  getRetroArchive,
  getRetroArchives,
  createUser,
  createSession,
  updateRetroSettings,
  updateRetroPassword,
  retrieveConfig,
};
