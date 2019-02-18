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

function pushIfUniqueId(newItem) {
  return (items) => {
    if (items.map(({id}) => id).includes(newItem.id)) {
      return items;
    }
    return [...items, newItem];
  };
}

export default {
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
    this.$store.refine('errors').set({});
    this.dispatch({type: 'setRoute', data: `/retros/${data.retro.slug}`});
    this.dispatch({type: 'createdRetroAnalytics', data: {retroId: data.retro.id}});
  },
  retroUnsuccessfullyCreated({data}) {
    this.$store.refine('errors').set(data.errors);
  },
  retroSuccessfullyLoggedIn({data}) {
    this.dispatch({type: 'setRoute', data: `/retros/${data.retro_id}`});
  },
  retroSuccessfullyFetched({data}) {
    this.$store.merge({retro: data.retro});
    this.dispatch({type: 'visitedRetroAnalytics', data: {retroId: data.retro.id}});
  },
  retrosSuccessfullyFetched({data}) {
    this.$store.merge({retros: data.retros});
  },
  getRetroSettingsSuccessfullyReceived({data}) {
    this.$store.merge({retro: data.retro});
  },
  getRetroLoginSuccessfullyReceived({data}) {
    this.$store.merge({retro: data.retro});
  },

  retroNotFound() {
    this.$store.merge({retro_not_found: true});
  },
  retroLoginFailed() {
    this.$store.merge({login_error_message: 'Oops, wrong password!'});
  },
  notFound() {
    this.$store.merge({not_found: true});
  },
  resetApiServerNotFound() {
    this.$store.merge({api_server_not_found: false});
  },
  resetRetroNotFound() {
    this.$store.merge({retro_not_found: false});
  },
  resetNotFound() {
    this.$store.merge({not_found: false});
  },
  redirectToRetroCreatePage() {
    this.dispatch({type: 'setRoute', data: '/retros/new'});
  },
  retroIdRouted({data}) {
    this.$store.merge({retroId: data});
  },
  retroItemSuccessfullyCreated({data}) {
    this.$store.refine('retro', 'items').apply(pushIfUniqueId(data.item));
    this.dispatch({type: 'createdRetroItemAnalytics', data: {retroId: data.retroId, category: data.item.category}});
  },
  retroItemSuccessfullyDeleted({data}) {
    this.$store.refine('retro', 'items').remove(data.item);
  },
  retroItemSuccessfullyVoted({data}) {
    const items = this.$store.refine('retro', 'items').get();
    const item = items.find((item) => item.id === data.item.id);
    this.$store.refine('retro', 'items', item).merge(data.item);
  },
  retroItemSuccessfullyDone({data}) {
    const retro = this.$store.refine('retro').get();
    const itemIndex = retro.items.findIndex((item) => item.id === data.itemId);
    this.$store.refine('retro', 'highlighted_item_id').set(null);
    this.$store.refine('retro', 'items', itemIndex, 'done').set(true);

    // Delay checking if retro items are done, otherwise the dispatcher will be invoked BEFORE p-flux updates the model
    Promise.resolve().then(() => {
      this.dispatch({type: 'checkAllRetroItemsDone'});
      this.dispatch({
        type: 'completedRetroItemAnalytics',
        data: {retroId: data.retroId, category: retro.items[itemIndex].category},
      });
    });
  },
  retroItemSuccessfullyUndone({data}) {
    this.$store.refine('retro', 'highlighted_item_id').set(null);
    this.$store.refine('retro', 'items', data.item, 'done').set(false);
  },
  retroItemSuccessfullyHighlighted({data}) {
    this.$store.refine('retro').merge({
      highlighted_item_id: data.retro.highlighted_item_id,
      retro_item_end_time: data.retro.retro_item_end_time,
    });
  },
  retroItemSuccessfullyUnhighlighted() {
    this.$store.refine('retro').merge({
      highlighted_item_id: null,
    });
  },
  extendTimerSuccessfullyDone({data}) {
    this.$store.refine('retro').merge({
      retro_item_end_time: data.retro.retro_item_end_time,
    });
  },
  archiveRetroSuccessfullyDone({data}) {
    this.$store.merge({retro: data.retro});
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
      const session = this.$store.get('session');
      if (session.request_uuid !== data.payload.originator_id) {
        this.dispatch({type: 'requireRetroRelogin', data: {retro: data.payload.retro}});
      }
    } else {
      this.$store.merge({retro: data.retro});
    }
  },
  websocketSessionDataReceived({data}) {
    this.$store.merge({session: data.payload});
  },
  retroActionItemSuccessfullyDeleted({data}) {
    this.$store.refine('retro', 'action_items').remove(data.action_item);
  },
  retroActionItemSuccessfullyEdited({data}) {
    const retro = this.$store.get('retro');
    const action_item = retro.action_items.find((item) => item.id === data.action_item.id);
    action_item.description = data.action_item.description;
    this.$store.merge({retro: retro});
  },
  doneRetroActionItemSuccessfullyToggled({data}) {
    const retro = this.$store.get('retro');
    const action_item = retro.action_items.find((item) => item.id === data.action_item.id);
    action_item.done = data.action_item.done;
    this.$store.merge({retro: retro});
    const analyticsType = data.action_item.done ? 'doneActionItemAnalytics' : 'undoneActionItemAnalytics';
    this.dispatch({type: analyticsType, data: {retroId: retro.id}});
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
    this.$store.merge({retro_archives: data.retro});
  },
  retroArchivesSuccessfullyFetched({data}) {
    this.$store.merge({archives: data.archives});
  },
  backPressedFromArchives({data}) {
    this.dispatch({type: 'setRoute', data: `/retros/${data.retro_id}`});
  },
  showAlert({data}) {
    this.$store.merge({alert: data});
  },
  hideAlert() {
    this.$store.merge({alert: null});
  },
  showDialog({data}) {
    this.$store.merge({dialog: data});
  },
  hideDialog() {
    this.$store.merge({dialog: null});
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
  retroSettingsSuccessfullyUpdated({data: {retro}}) {
    this.$store.refine('retro').set(retro);
    this.$store.refine('errors').set({});
    this.dispatch({type: 'setRoute', data: `/retros/${retro.slug}`});
  },
  retroSettingsUnsuccessfullyUpdated({data}) {
    this.$store.refine('errors').set(data.errors);
  },
  backPressedFromSettings({data}) {
    this.dispatch({type: 'setRoute', data: `/retros/${data.retro_id}`});
  },
  backPressedFromPasswordSettings({data}) {
    this.dispatch({type: 'setRoute', data: `/retros/${data.retro_id}/settings`});
  },
  retroPasswordSuccessfullyUpdated({data}) {
    this.$store.refine('errors').set({});
    window.localStorage.setItem(`apiToken-${data.retro_id}`, data.token);
  },
  retroPasswordUnsuccessfullyUpdated({data}) {
    this.$store.refine('errors').set(data.errors);
  },
  clearErrors() {
    this.$store.refine('errors').set({});
  },
  checkAllRetroItemsDone() {
    const items = this.$store.refine('retro', 'items').get();
    if (items.every((item) => item.done)) {
      this.dispatch(
        {
          type: 'showDialog',
          data: {
            title: 'Archive this retro?',
            message: 'The board will be cleared ready for your next retro and incomplete action items will be carried across.',
          },
        },
      );
    }
  },
  apiServerNotFound() {
    this.$store.merge({api_server_not_found: true});
  },
  redirectToRegistration({data}) {
    this.dispatch({type: 'setRoute', data: `/registration/${data.access_token}/${data.email}/${data.name}`});
  },
  setConfig({data}) {
    this.$store.refine('featureFlags').merge({
      archiveEmails: data.archive_emails,
    });
  },
  setCountryCode({data}) {
    this.$store.merge({
      countryCode: data.countryCode,

    });
  }, toggleSendArchiveEmail({data: {currentSendArchiveEmail}}) {
    this.$store.refine('retro', 'send_archive_email').set(!currentSendArchiveEmail);
  },
};
