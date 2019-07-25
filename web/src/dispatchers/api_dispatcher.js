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


export default function (apiBoundActions) {
  return {
    retroCreate({data}) {
      apiBoundActions.retroCreate(data);
    },
    getRetro({data: {id}}) {
      apiBoundActions.getRetro(id);
    },
    getRetroSettings({data: {id}}) {
      apiBoundActions.getRetroSettings(id);
    },
    getRetroLogin({data: {retro_id}}) {
      apiBoundActions.getRetroLogin(retro_id);
    },
    loginToRetro({data}) {
      apiBoundActions.loginToRetro(data.retro_id, data.password);
    },
    createRetroItem({data: {retro_id, category, description}}) {
      apiBoundActions.createRetroItem(retro_id, category, description);
    },
    updateRetroItem({data: {retro_id, item, description}}) {
      apiBoundActions.updateRetroItem(retro_id, item, description);
    },
    deleteRetroItem({data: {retro_id, item}}) {
      apiBoundActions.deleteRetroItem(retro_id, item);
    },
    voteRetroItem({data: {retro_id, item}}) {
      apiBoundActions.voteRetroItem(retro_id, item);
    },
    nextRetroItem({data: {retro}}) {
      apiBoundActions.nextRetroItem(retro);
    },
    highlightRetroItem({data: {retro_id, item}}) {
      apiBoundActions.highlightRetroItem(retro_id, item);
    },
    unhighlightRetroItem({data: {retro_id}}) {
      apiBoundActions.unhighlightRetroItem(retro_id);
    },
    doneRetroItem({data: {retroId, item}}) {
      apiBoundActions.doneRetroItem(retroId, item);
    },
    undoneRetroItem({data: {retroId, item}}) {
      apiBoundActions.undoneRetroItem(retroId, item);
    },
    extendTimer({data: {retro_id}}) {
      apiBoundActions.extendTimer(retro_id);
    },
    archiveRetro({data: {retro}}) {
      apiBoundActions.archiveRetro(retro);
    },
    createRetroActionItem({data: {retro_id, description}}) {
      apiBoundActions.createRetroActionItem(retro_id, description);
    },
    doneRetroActionItem({data: {retro_id, action_item_id, done}}) {
      apiBoundActions.doneRetroActionItem(retro_id, action_item_id, done);
    },
    deleteRetroActionItem({data: {retro_id, action_item}}) {
      apiBoundActions.deleteRetroActionItem(retro_id, action_item);
    },
    editRetroActionItem({data: {retro_id, action_item_id, description}}) {
      apiBoundActions.editRetroActionItem(retro_id, action_item_id, description);
    },
    getRetroArchive({data: {retro_id, archive_id}}) {
      apiBoundActions.getRetroArchive(retro_id, archive_id);
    },
    getRetroArchives({data: {retro_id}}) {
      apiBoundActions.getRetroArchives(retro_id);
    },
    createUser({data: {access_token, company_name, full_name}}) {
      apiBoundActions.createUser(access_token, company_name, full_name);
    },
    createSession({data: {access_token, email, name}}) {
      apiBoundActions.createSession(access_token, email, name);
    },
    updateRetroSettings({data: {retro_id, retro_name, new_slug, old_slug, is_private, request_uuid, video_link}}) {
      apiBoundActions.updateRetroSettings(retro_id, retro_name, new_slug, old_slug, is_private, request_uuid, video_link);
    },
    updateRetroPassword({data: {retro_id, current_password, new_password, request_uuid}}) {
      apiBoundActions.updateRetroPassword(retro_id, current_password, new_password, request_uuid);
    },
    retrieveConfig() {
      apiBoundActions.retrieveConfig();
    },
  };
}
