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

import Logger from '../helpers/logger';

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

export default function (retroClient, mainBoundActions, routerBoundActions, analyticsBoundActions) {
  return {
    retroCreate(request) {
      Logger.info('retroCreate');
      return retroClient.createRetro(request.data).then(([status, data]) => {
        if (status >= 200 && status < 400) {
          const token = data.token;
          if (token) {
            setApiToken(data.retro.slug, token);
          }

          mainBoundActions.clearErrors();
          routerBoundActions.showRetro(data.retro);
          analyticsBoundActions.createdRetro(data.retro.id);
        } else if (status === 422) {
          mainBoundActions.errorsUpdated(data.errors);
        }
      });
    },
    getRetro({data: {id}}) {
      Logger.info('getRetro');
      return retroClient.getRetro(id, getApiToken(id)).then(([status, data]) => {
        if (status >= 200 && status < 400) {
          mainBoundActions.currentRetroUpdated(data.retro);
          analyticsBoundActions.visitedRetro(data.retro.id);
        } else if (status === 403) {
          routerBoundActions.retroLogin(id);
        } else if (status === 404) {
          Logger.warn(`getRetro: Retro not found, retroId=${id}`);
          mainBoundActions.setNotFound({retro_not_found: true});
        }
      });
    },
    getRetroSettings({data: {id}}) {
      Logger.info('getRetroSettings');
      return retroClient.getRetroSettings(id, getApiToken(id)).then(([status, data]) => {
        if (status >= 200 && status < 400) {
          mainBoundActions.currentRetroUpdated(data.retro);
        } else if (status === 403) {
          routerBoundActions.retroLogin(id);
        } else if (status === 404) {
          Logger.warn(`getRetro: Retro not found, retroId=${id}`);
          mainBoundActions.setNotFound({retro_not_found: true});
        }
      });
    },
    getRetroLogin({data: {retro_id}}) {
      Logger.info('getRetroLogin');
      return retroClient.getRetroLogin(retro_id).then(([status, data]) => {
        if (status >= 200 && status < 400) {
          mainBoundActions.currentRetroUpdated(data.retro);
        } else if (status === 404) {
          Logger.warn(`getRetro: Retro not found, retroId=${retro_id}`);
          mainBoundActions.setNotFound({retro_not_found: true});
        }
      });
    },
    loginToRetro({data}) {
      Logger.info('loginToRetro');
      return retroClient.loginToRetro(data).then(([status, response]) => {
        if (status >= 200 && status < 400) {
          const token = response.token;
          if (token) {
            setApiToken(data.retro_id, token);
          }
          routerBoundActions.showRetroForId(data.retro_id);
        } else {
          mainBoundActions.errorsUpdated({login_error_message: 'Oops, wrong password!'});
        }
      });
    },
    createRetroItem({data: {retro_id, category, description}}) {
      Logger.info('createRetroItem');
      return retroClient.createRetroItem(retro_id, category, description, getApiToken(retro_id)).then(([, data]) => {
        mainBoundActions.currentRetroItemUpdated(data.item);
        analyticsBoundActions.createdRetroItem(retro_id, data.item.category);
      });
    },
    updateRetroItem({data: {retro_id, item, description}}) {
      Logger.info('updateRetroItem');
      return retroClient.updateRetroItem(retro_id, item.id, description, getApiToken(retro_id));
    },
    deleteRetroItem({data: {retro_id, item}}) {
      Logger.info('deleteRetroItem');
      retroClient.deleteRetroItem(retro_id, item.id, getApiToken(retro_id));
      mainBoundActions.currentRetroItemDeleted(item);
    },
    voteRetroItem({data: {retro_id, item}}) {
      Logger.info('voteRetroItem');
      retroClient.voteRetroItem(retro_id, item.id, getApiToken(retro_id)).then(([, data]) => {
        mainBoundActions.currentRetroItemUpdated(data.item);
      });
    },
    nextRetroItem({data: {retro}}) {
      Logger.info('nextRetroItem');
      if (retro.highlighted_item_id !== null) {
        mainBoundActions.currentRetroItemDoneUpdated(retro.highlighted_item_id, true);
      }
      retroClient.nextRetroItem(retro.slug, getApiToken(retro.slug));
    },
    highlightRetroItem({data: {retro_id, item}}) {
      Logger.info('highlightRetroItem');
      retroClient.highlightRetroItem(retro_id, item.id, getApiToken(retro_id)).then(([, data]) => {
        mainBoundActions.currentRetroUpdated(data.retro);
      });
    },
    unhighlightRetroItem({data: {retro_id}}) {
      Logger.info('unhighlightRetroItem');
      retroClient.unhighlightRetroItem(retro_id, getApiToken(retro_id));
      mainBoundActions.currentRetroHighlightCleared();
    },
    doneRetroItem({data: {retroId, item}}) {
      Logger.info('doneRetroItem');
      retroClient.doneRetroItem(retroId, item.id, getApiToken(retroId));

      mainBoundActions.currentRetroItemDoneUpdated(item.id, true);
    },
    undoneRetroItem({data: {retroId, item}}) {
      Logger.info('undoneRetroItem');
      retroClient.undoneRetroItem(retroId, item.id, getApiToken(retroId));
      mainBoundActions.currentRetroItemDoneUpdated(item.id, false);
    },
    extendTimer({data: {retro_id}}) {
      Logger.info('extendTimer');
      retroClient.extendTimer(retro_id, getApiToken(retro_id)).then(([, data]) => {
        mainBoundActions.currentRetroUpdated(data.retro);
      });
    },
    archiveRetro({data: {retro}}) {
      Logger.info('archiveRetro');
      retroClient.archiveRetro(retro.slug, getApiToken(retro.slug), retro.send_archive_email).then(([status, data]) => {
        if (status >= 200 && status < 400) {
          mainBoundActions.currentRetroUpdated(data.retro);
          analyticsBoundActions.archivedRetro(data.retro.id);
          mainBoundActions.showAlert({message: 'Archived!'});
        } else if (status === 403) {
          routerBoundActions.retroLogin(retro.slug);
        }
      });
    },
    createRetroActionItem({data: {retro_id, description}}) {
      Logger.info('createRetroActionItem');
      return retroClient.createRetroActionItem(retro_id, description, getApiToken(retro_id));
    },
    doneRetroActionItem({data: {retro_id, action_item_id, done}}) {
      Logger.info('doneRetroActionItem');
      retroClient.doneRetroActionItem(retro_id, action_item_id, done, getApiToken(retro_id)).then(([, data]) => {
        mainBoundActions.currentRetroActionItemUpdated(data.action_item);

        if (data.action_item.done) {
          analyticsBoundActions.doneActionItem(retro_id);
        } else {
          analyticsBoundActions.undoneActionItem(retro_id);
        }
      });
    },
    deleteRetroActionItem({data: {retro_id, action_item}}) {
      Logger.info('deleteRetroActionItem');
      retroClient.deleteRetroActionItem(retro_id, action_item.id, getApiToken(retro_id));
      mainBoundActions.currentRetroActionItemDeleted(action_item);
    },
    editRetroActionItem({data: {retro_id, action_item_id, description}}) {
      Logger.info('editRetroActionItem');
      retroClient.editRetroActionItem(retro_id, action_item_id, description, getApiToken(retro_id)).then(([, data]) => {
        mainBoundActions.currentRetroActionItemUpdated(data.action_item);
      });
    },
    getRetroArchive({data: {retro_id, archive_id}}) {
      Logger.info('getRetroArchive');
      return retroClient.getRetroArchive(retro_id, archive_id, getApiToken(retro_id)).then(([status, data]) => {
        if (status >= 200 && status < 400) {
          mainBoundActions.updateCurrentArchivedRetro(data.retro);
        } else if (status === 403) {
          routerBoundActions.retroLogin(retro_id);
        } else if (status === 404) {
          mainBoundActions.setNotFound({not_found: true});
        }
      });
    },
    getRetroArchives({data: {retro_id}}) {
      Logger.info('getRetroArchives');
      return retroClient.getRetroArchives(retro_id, getApiToken(retro_id)).then(([status, data]) => {
        if (status >= 200 && status < 400) {
          mainBoundActions.updateRetroArchives(data.archives);
        } else if (status === 403) {
          routerBoundActions.retroLogin(retro_id);
        } else if (status === 404) {
          mainBoundActions.setNotFound({retro_not_found: true});
        }
      });
    },
    createUser({data: {access_token, company_name, full_name}}) {
      Logger.info('createUser');
      return retroClient.createUser(access_token, company_name, full_name).then(([, response]) => {
        localStorage.setItem('authToken', response.auth_token);
        routerBoundActions.newRetro();
      });
    },
    createSession({data: {access_token, email, name}}) {
      return retroClient.createSession(access_token).then(([status, data]) => {
        if (status === 200) {
          localStorage.setItem('authToken', data.auth_token);
          if (data.new_user) {
            routerBoundActions.newRetro();
          } else {
            routerBoundActions.home();
          }
        } else if (status === 404) {
          routerBoundActions.registration(access_token, email, name);
        }
      });
    },
    updateRetroSettings({data: {retro_id, retro_name, new_slug, old_slug, is_private, request_uuid, video_link}}) {
      Logger.info('updateRetroSettings');
      return retroClient.updateRetro(retro_id, retro_name, new_slug, getApiToken(retro_id), is_private, request_uuid, video_link).then(([status, data]) => {
        if (status >= 200 && status < 400) {
          resetApiToken(old_slug, new_slug);
          const retro = {name: retro_name, slug: new_slug, is_private: data.retro.is_private};
          mainBoundActions.currentRetroUpdated(retro);
          mainBoundActions.clearErrors();

          routerBoundActions.showRetro(retro);
          mainBoundActions.showAlert({checkIcon: true, message: 'Settings saved!', className: 'alert-with-back-button'});
        } else if (status === 403) {
          routerBoundActions.retroLogin(retro_id);
        } else if (status === 422) {
          mainBoundActions.errorsUpdated(data.errors);
        }
      });
    },
    updateRetroPassword({data: {retro_id, current_password, new_password, request_uuid}}) {
      Logger.info('updateRetroPassword');
      return retroClient.updateRetroPassword(retro_id, current_password, new_password, request_uuid, getApiToken(retro_id))
        .then(([status, data]) => {
          if (status >= 200 && status < 400) {
            mainBoundActions.clearErrors();
            window.localStorage.setItem(`apiToken-${retro_id}`, data.token);

            routerBoundActions.retroSettings(retro_id);
            mainBoundActions.showAlert({checkIcon: true, message: 'Password changed'});
          } else if (status === 422) {
            mainBoundActions.errorsUpdated(data.errors);
          }
        });
    },
    retrieveConfig() {
      Logger.info('retrieveConfig');
      return retroClient.retrieveConfig().then(([status, data]) => {
        if (status >= 200 && status < 400) {
          mainBoundActions.updateFeatureFlags({
            archiveEmails: data.archive_emails,
          });
        } else if (status === 404) {
          mainBoundActions.setNotFound({not_found: true});
        }
      });
    },
  };
}
