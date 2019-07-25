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

export default function (mainBoundActions, routerBoundActions) {
  return {
    redirectToHome() {
      routerBoundActions.home();
    },
    requireRetroLogin({data}) {
      routerBoundActions.retroLogin(data.retro_id);
    },
    redirectToRetroCreatePage() {
      routerBoundActions.newRetro();
    },
    routeToRetroArchives({data}) {
      routerBoundActions.retroArchives(data.retro_id);
    },
    routeToRetroArchive({data}) {
      routerBoundActions.retroArchive(data.retro_id, data.archive_id);
    },
    routeToRetroSettings({data}) {
      routerBoundActions.retroSettings(data.retro_id);
    },
    routeToRetroPasswordSettings({data}) {
      routerBoundActions.retroPasswordSettings(data.retro_id);
    },
    backPressedFromArchives({data}) {
      routerBoundActions.showRetroForId(data.retro_id);
    },
    signOut() {
      window.localStorage.clear();
      routerBoundActions.home();
    },
    backPressedFromSettings({data}) {
      routerBoundActions.showRetroForId(data.retro_id);
    },
    backPressedFromPasswordSettings({data}) {
      routerBoundActions.retroSettings(data.retro_id);
    },
    retroNotFound() {
      mainBoundActions.setNotFound({retro_not_found: true});
    },
    resetRetroNotFound() {
      mainBoundActions.setNotFound({retro_not_found: false});
    },
    notFound() {
      mainBoundActions.setNotFound({not_found: true});
    },
    resetNotFound() {
      mainBoundActions.setNotFound({not_found: false});
    },
    apiServerNotFound() {
      mainBoundActions.setNotFound({api_server_not_found: true});
    },
    resetApiServerNotFound() {
      mainBoundActions.setNotFound({api_server_not_found: false});
    },
    websocketRetroDataReceived({data}) {
      if (data.command === 'force_relogin') {
        mainBoundActions.forceRelogin(data.payload.originator_id, data.payload.retro.slug);
      } else {
        mainBoundActions.currentRetroUpdated(data.retro);
      }
    },
    websocketSessionDataReceived({data}) {
      mainBoundActions.updateWebsocketSession(data.payload);
    },
    toggleSendArchiveEmail({data: {currentSendArchiveEmail}}) {
      mainBoundActions.currentRetroSendArchiveEmailUpdated(!currentSendArchiveEmail);
    },
    hideAlert() {
      mainBoundActions.clearAlert();
    },
    showDialog({data}) {
      mainBoundActions.showDialog(data);
    },
    hideDialog() {
      mainBoundActions.clearDialog();
    },
    clearErrors() {
      mainBoundActions.clearErrors();
    },
  };
}
