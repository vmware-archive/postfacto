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

const ALERT_DURATION = 3500;
let alertTimeout = null;

export default function (retroActionCreators, store) {
  return {
    setRoute({data}) {
      this.router.navigate(data);
    },
    requireRetroLogin({data}) {
      this.dispatch({type: 'setRoute', data: `/retros/${data.retro_id}/login`});
    },
    requireRetroRelogin({data}) {
      this.dispatch({type: 'setRoute', data: `/retros/${data.retro.slug}/relogin`});
    },
    retroSuccessfullyCreated({data}) {
      retroActionCreators.clearErrors();
      this.dispatch({type: 'setRoute', data: `/retros/${data.retro.slug}`});
      this.dispatch({type: 'createdRetroAnalytics', data: {retroId: data.retro.id}});
    },
    retroUnsuccessfullyCreated({data}) {
      retroActionCreators.errorsUpdated(data.errors);
    },
    retroSuccessfullyLoggedIn({data}) {
      this.dispatch({type: 'setRoute', data: `/retros/${data.retro_id}`});
    },
    retroLoginFailed() {
      retroActionCreators.errorsUpdated({login_error_message: 'Oops, wrong password!'});
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
    redirectToRetroCreatePage() {
      this.dispatch({type: 'setRoute', data: '/retros/new'});
    },
    retrosSuccessfullyFetched({data}) {
      retroActionCreators.retrosUpdated(data.retros);
    },
    retroSuccessfullyFetched({data}) {
      retroActionCreators.currentRetroUpdated(data.retro);
      this.dispatch({type: 'visitedRetroAnalytics', data: {retroId: data.retro.id}});
    },
    getRetroSettingsSuccessfullyReceived({data}) {
      retroActionCreators.currentRetroUpdated(data.retro);
    },
    getRetroLoginSuccessfullyReceived({data}) {
      retroActionCreators.currentRetroUpdated(data.retro);
    },
    retroItemSuccessfullyCreated({data}) {
      retroActionCreators.currentRetroItemUpdated(data.item);
      this.dispatch({type: 'createdRetroItemAnalytics', data: {retroId: data.retroId, category: data.item.category}});
    },
    retroItemSuccessfullyDeleted({data}) {
      retroActionCreators.currentRetroItemDeleted(data.item);
    },
    retroItemSuccessfullyVoted({data}) {
      retroActionCreators.currentRetroItemUpdated(data.item);
    },
    retroItemSuccessfullyDone({data}) {
      retroActionCreators.currentRetroItemDoneUpdated(data.itemId, true);
    },
    retroItemSuccessfullyUndone({data}) {
      retroActionCreators.currentRetroItemDoneUpdated(data.item.id, false);
    },
    retroItemSuccessfullyHighlighted({data}) {
      retroActionCreators.currentRetroUpdated(data.retro);
    },
    retroItemSuccessfullyUnhighlighted() {
      retroActionCreators.currentRetroHighlightCleared();
    },
    extendTimerSuccessfullyDone({data}) {
      retroActionCreators.currentRetroUpdated(data.retro);
    },
    archiveRetroSuccessfullyDone({data}) {
      retroActionCreators.currentRetroUpdated(data.retro);
      this.dispatch({
        type: 'archivedRetroAnalytics',
        data: {retroId: data.retro.id},
      });
      this.dispatch({
        type: 'showAlert',
        data: {message: 'Archived!'},
      });
    },
    websocketRetroDataReceived({data}) {
      if (data.command === 'force_relogin') {
        const session = store.getState().user.websocketSession;
        if (session.request_uuid !== data.payload.originator_id) {
          this.dispatch({type: 'requireRetroRelogin', data: {retro: data.payload.retro}});
        }
      } else {
        retroActionCreators.currentRetroUpdated(data.retro);
      }
    },
    websocketSessionDataReceived({data}) {
      retroActionCreators.updateWebsocketSession(data.payload);
    },
    retroSettingsSuccessfullyUpdated({data: {retro}}) {
      retroActionCreators.currentRetroUpdated(retro);
      retroActionCreators.clearErrors();
      this.dispatch({type: 'setRoute', data: `/retros/${retro.slug}`});
    },
    retroActionItemSuccessfullyDeleted({data}) {
      retroActionCreators.currentRetroActionItemDeleted(data.action_item);
    },
    retroActionItemSuccessfullyEdited({data}) {
      retroActionCreators.currentRetroActionItemUpdated(data.action_item);
    },
    doneRetroActionItemSuccessfullyToggled({data}) {
      retroActionCreators.currentRetroActionItemUpdated(data.action_item);

      const analyticsType = data.action_item.done ? 'doneActionItemAnalytics' : 'undoneActionItemAnalytics';
      this.dispatch({type: analyticsType, data: {retroId: data.retro_id}});
    },
    toggleSendArchiveEmail({data: {currentSendArchiveEmail}}) {
      retroActionCreators.currentRetroSendArchiveEmailUpdated(!currentSendArchiveEmail);
    },
    routeToHome() {
      this.dispatch({type: 'setRoute', data: '/'});
    },
    routeToShowRetro({data}) {
      this.dispatch({type: 'setRoute', data: `/retros/${data.slug}/`});
    },
    routeToNewRetro() {
      this.dispatch({type: 'setRoute', data: '/retros/new'});
    },
    routeToRetroArchives({data}) {
      this.dispatch({type: 'setRoute', data: `/retros/${data.retro_id}/archives`});
    },
    routeToRetroArchive({data}) {
      this.dispatch({type: 'setRoute', data: `/retros/${data.retro_id}/archives/${data.archive_id}`});
    },
    routeToRetroSettings({data}) {
      this.dispatch({type: 'setRoute', data: `/retros/${data.retro_id}/settings`});
    },
    routeToRetroPasswordSettings({data}) {
      this.dispatch({type: 'setRoute', data: `/retros/${data.retro_id}/settings/password`});
    },
    retroArchiveSuccessfullyFetched({data}) {
      retroActionCreators.updateCurrentArchivedRetro(data.retro);
    },
    retroArchivesSuccessfullyFetched({data}) {
      retroActionCreators.updateRetroArchives(data.archives);
    },
    backPressedFromArchives({data}) {
      this.dispatch({type: 'setRoute', data: `/retros/${data.retro_id}`});
    },
    showAlert({data}) {
      clearTimeout(alertTimeout);
      alertTimeout = setTimeout(() => retroActionCreators.clearAlert(), ALERT_DURATION);

      retroActionCreators.showAlert(data);
    },
    hideAlert() {
      clearTimeout(alertTimeout);
      alertTimeout = null;

      retroActionCreators.clearAlert();
    },
    showDialog({data}) {
      retroActionCreators.showDialog(data);
    },
    hideDialog() {
      retroActionCreators.clearDialog();
    },
    loggedInSuccessfully({data}) {
      localStorage.setItem('authToken', data.auth_token);
      if (data.new_user) {
        this.dispatch({type: 'setRoute', data: '/retros/new'});
      } else {
        this.dispatch({type: 'setRoute', data: '/'});
      }
    },
    signOut() {
      window.localStorage.clear();
      this.dispatch({type: 'setRoute', data: '/'});
    },
    retroSettingsUnsuccessfullyUpdated({data}) {
      retroActionCreators.errorsUpdated(data.errors);
    },
    backPressedFromSettings({data}) {
      this.dispatch({type: 'setRoute', data: `/retros/${data.retro_id}`});
    },
    backPressedFromPasswordSettings({data}) {
      this.dispatch({type: 'setRoute', data: `/retros/${data.retro_id}/settings`});
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
    redirectToRegistration({data}) {
      this.dispatch({type: 'setRoute', data: `/registration/${data.access_token}/${data.email}/${data.name}`});
    },
    setConfig({data}) {
      this.$store.refine('featureFlags').merge({
        archiveEmails: data.archive_emails,
      });
    },
  };
}
