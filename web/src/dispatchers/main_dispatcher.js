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

/*
 * TODO
 *  4. Pull functions up to api dispatcher where possible
 *  5. Remove main_dispatcher and analytics_dispatcher
 *  6. Move api-dispatcher to middleware
 */
export default function (retroActionCreators, routerActionDispatcher, analyticsDispatcher) {
  return {
    redirectToHome() {
      routerActionDispatcher.home();
    },
    requireRetroLogin({data}) {
      routerActionDispatcher.retroLogin(data.retro_id);
    },
    redirectToRetroCreatePage() {
      routerActionDispatcher.newRetro();
    },
    retroSettingsSuccessfullyUpdated({data: {retro}}) {
      retroActionCreators.currentRetroUpdated(retro);
      retroActionCreators.clearErrors();
      routerActionDispatcher.showRetro(retro);
    },
    routeToRetroArchives({data}) {
      routerActionDispatcher.retroArchives(data.retro_id);
    },
    routeToRetroArchive({data}) {
      routerActionDispatcher.retroArchive(data.retro_id, data.archive_id);
    },
    routeToRetroSettings({data}) {
      routerActionDispatcher.retroSettings(data.retro_id);
    },
    routeToRetroPasswordSettings({data}) {
      routerActionDispatcher.retroPasswordSettings(data.retro_id);
    },
    backPressedFromArchives({data}) {
      routerActionDispatcher.showRetroForId(data.retro_id);
    },
    loggedInSuccessfully({data}) {
      localStorage.setItem('authToken', data.auth_token);
      if (data.new_user) {
        routerActionDispatcher.newRetro();
      } else {
        routerActionDispatcher.home();
      }
    },
    signOut() {
      window.localStorage.clear();
      routerActionDispatcher.home();
    },
    backPressedFromSettings({data}) {
      routerActionDispatcher.showRetroForId(data.retro_id);
    },
    backPressedFromPasswordSettings({data}) {
      routerActionDispatcher.retroSettings(data.retro_id);
    },
    redirectToRegistration({data}) {
      routerActionDispatcher.registration(data.access_token, data.email, data.name);
    },
    retroNotFound() {
      retroActionCreators.setNotFound({retro_not_found: true});
    },
    resetRetroNotFound() {
      retroActionCreators.setNotFound({retro_not_found: false});
    },
    notFound() {
      retroActionCreators.setNotFound({not_found: true});
    },
    resetNotFound() {
      retroActionCreators.setNotFound({not_found: false});
    },
    apiServerNotFound() {
      retroActionCreators.setNotFound({api_server_not_found: true});
    },
    resetApiServerNotFound() {
      retroActionCreators.setNotFound({api_server_not_found: false});
    },
    retroItemSuccessfullyUndone({data}) {
      retroActionCreators.currentRetroItemDoneUpdated(data.item.id, false);
    },
    extendTimerSuccessfullyDone({data}) {
      retroActionCreators.currentRetroUpdated(data.retro);
    },
    archiveRetroSuccessfullyDone({data}) {
      retroActionCreators.currentRetroUpdated(data.retro);
      analyticsDispatcher.archivedRetro(data.retro.id);
      retroActionCreators.showAlert({message: 'Archived!'});
    },
    websocketRetroDataReceived({data}) {
      if (data.command === 'force_relogin') {
        retroActionCreators.forceRelogin(data.payload.originator_id, data.payload.retro.slug);
      } else {
        retroActionCreators.currentRetroUpdated(data.retro);
      }
    },
    websocketSessionDataReceived({data}) {
      retroActionCreators.updateWebsocketSession(data.payload);
    },
    retroActionItemSuccessfullyDeleted({data}) {
      retroActionCreators.currentRetroActionItemDeleted(data.action_item);
    },
    retroActionItemSuccessfullyEdited({data}) {
      retroActionCreators.currentRetroActionItemUpdated(data.action_item);
    },
    doneRetroActionItemSuccessfullyToggled({data}) {
      retroActionCreators.currentRetroActionItemUpdated(data.action_item);

      if (data.action_item.done) {
        analyticsDispatcher.doneActionItem(data.retro_id);
      } else {
        analyticsDispatcher.undoneActionItem(data.retro_id);
      }
    },
    toggleSendArchiveEmail({data: {currentSendArchiveEmail}}) {
      retroActionCreators.currentRetroSendArchiveEmailUpdated(!currentSendArchiveEmail);
    },
    retroArchiveSuccessfullyFetched({data}) {
      retroActionCreators.updateCurrentArchivedRetro(data.retro);
    },
    retroArchivesSuccessfullyFetched({data}) {
      retroActionCreators.updateRetroArchives(data.archives);
    },
    showAlert({data}) {
      retroActionCreators.showAlert(data);
    },
    hideAlert() {
      retroActionCreators.clearAlert();
    },
    showDialog({data}) {
      retroActionCreators.showDialog(data);
    },
    hideDialog() {
      retroActionCreators.clearDialog();
    },
    retroSettingsUnsuccessfullyUpdated({data}) {
      retroActionCreators.errorsUpdated(data.errors);
    },
    retroPasswordSuccessfullyUpdated({data}) {
      retroActionCreators.clearErrors();
      window.localStorage.setItem(`apiToken-${data.retro_id}`, data.token);
    },
    retroPasswordUnsuccessfullyUpdated({data}) {
      retroActionCreators.errorsUpdated(data.errors);
    },
    clearErrors() {
      retroActionCreators.clearErrors();
    },
    setConfig(action) {
      retroActionCreators.updateFeatureFlags({
        archiveEmails: action.data.archive_emails,
      });
    },
  };
}
