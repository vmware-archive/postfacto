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

import React from 'react';
import types from 'prop-types';

import {HotKeys} from 'react-hotkeys';
import {connect} from 'react-redux';
import RetroColumn from './retro_column';
import RetroActionPanel from './retro_action_panel';
import RetroWebsocket from './retro_websocket';
import RetroFooter from '../shared/footer';
import RetroLegalBanner from './retro_legal_banner';
import RetroHeading from './retro_heading';

import EmptyPage from '../shared/empty_page';

import {
  archiveRetro,
  createRetroActionItem,
  createRetroItem,
  deleteRetroActionItem,
  deleteRetroItem,
  doneRetroActionItem,
  doneRetroItem,
  editRetroActionItem,
  extendTimer,
  getRetro,
  getRetroArchive,
  highlightRetroItem,
  nextRetroItem,
  undoneRetroItem,
  unhighlightRetroItem,
  updateRetroItem,
  voteRetroItem,
} from '../../redux/actions/api_actions';
import {
  clearDialog,
  currentRetroSendArchiveEmailUpdated,
  currentRetroUpdated,
  forceRelogin,
  showDialog,
  signOut,
} from '../../redux/actions/main_actions';
import {retroArchives, retroLogin, retroSettings} from '../../redux/actions/router_actions';
import {websocketUrl} from '../../helpers/websockets';
import ArchiveRetroDialog from './archive_retro_dialog';
import ShareRetroDialog from './share_retro_dialog';
import {
  copiedMagicLink,
  viewedMagicLink,
} from '../../redux/actions/analytics_actions';

function getItemArchiveTime(item) {
  if (!item.archived_at) {
    return null;
  }
  return new Date(item.archived_at).getTime();
}

class ShowRetroPage extends React.Component {
  static propTypes = {
    retro: types.object.isRequired,
    retro_archives: types.object,
    retroId: types.string.isRequired,
    config: types.object.isRequired,
    archives: types.bool.isRequired,
    archiveId: types.string,
    featureFlags: types.object.isRequired,
    dialog: types.shape({
      title: types.string,
      message: types.string,
      type: types.string,
    }),
    environment: types.shape({
      isMobile640: types.bool,
    }).isRequired,
    getRetroArchive: types.func.isRequired,
    getRetro: types.func.isRequired,
    nextRetroItem: types.func.isRequired,
    archiveRetro: types.func.isRequired,
    hideDialog: types.func.isRequired,
    toggleSendArchiveEmail: types.func.isRequired,
    routeToRetroArchives: types.func.isRequired,
    routeToRetroSettings: types.func.isRequired,
    requireRetroLogin: types.func.isRequired,
    showDialog: types.func.isRequired,
    signOut: types.func.isRequired,
    voteRetroItem: types.func.isRequired,
    doneRetroItem: types.func.isRequired,
    undoneRetroItem: types.func.isRequired,
    highlightRetroItem: types.func.isRequired,
    unhighlightRetroItem: types.func.isRequired,
    updateRetroItem: types.func.isRequired,
    deleteRetroItem: types.func.isRequired,
    createRetroActionItem: types.func.isRequired,
    createRetroItem: types.func.isRequired,
    doneRetroActionItem: types.func.isRequired,
    deleteRetroActionItem: types.func.isRequired,
    editRetroActionItem: types.func.isRequired,
    viewedMagicLink: types.func.isRequired,
    copiedMagicLink: types.func.isRequired,
    extendTimer: types.func.isRequired,
    websocketRetroDataReceived: types.func.isRequired,
  };

  static defaultProps = {
    retro_archives: null,
    archiveId: null,
    dialog: null,
  };

  // Component Lifecycle

  constructor(props) {
    super(props);
    this.state = {
      currentMobileCategory: 'happy',
      filtered_retro_archive: {},
    };

    this.handleArchiveRetroConfirmation = this.handleArchiveRetroConfirmation.bind(this);
    this.handleArchiveEmailPreferenceChange = this.handleArchiveEmailPreferenceChange.bind(this);
    this.moveToNextItem = this.moveToNextItem.bind(this);
  }

  UNSAFE_componentWillMount() {
    const {retroId, archiveId, retro_archives, archives} = this.props;

    this.fetchRetros(retroId, archives, archiveId);
    this.initializeArchivesState(retro_archives, archives);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {retroId, archiveId, retro_archives, archives} = nextProps;

    if (archives !== this.props.archives) {
      this.fetchRetros(retroId, archives, archiveId);
    }
    this.initializeArchivesState(retro_archives, archives);
  }

  // Calculate if mobile

  // Fetch Retro or archive data

  fetchRetros(retroId, archives, archiveId) {
    if (archives) {
      this.props.getRetroArchive(retroId, archiveId);
    } else {
      this.props.getRetro(retroId);
    }
  }

  // Filter archive data
  initializeArchivesState(retro_archives, archives) {
    if (archives) {
      this.setState({filtered_retro_archive: this.filterRetroArchives(retro_archives)});
    }
  }

  filterRetroArchives(retro) {
    const {items = [], action_items = []} = retro;
    const archivesTimestamps = [...items, ...action_items]
      .map(getItemArchiveTime)
      .filter((time) => (time !== null));

    if (archivesTimestamps.length === 0) {
      return retro;
    }

    const latestTimestamp = Math.max(...archivesTimestamps);
    return Object.assign({}, retro, {
      items: this.filterItemByTimestamp(items, latestTimestamp),
      action_items: this.filterItemByTimestamp(action_items, latestTimestamp),
    });
  }

  filterItemByTimestamp(items, timestamp) {
    return items.filter((item) => getItemArchiveTime(item) === timestamp);
  }

  moveToNextItem(event) {
    if (event.target.type === 'textarea') {
      return;
    }
    const {retro} = this.props;
    this.props.nextRetroItem(retro);
  }

  // Handle events
  onMobileTabClick(category) {
    this.setState({currentMobileCategory: category});
  }

  handleArchiveRetroConfirmation() {
    this.props.archiveRetro(this.props.retro);
    this.props.hideDialog();
  }

  handleArchiveEmailPreferenceChange() {
    this.props.toggleSendArchiveEmail(!this.props.retro.send_archive_email);
  }

  renderColumnMobile(retro) {
    const {archives, retroId} = this.props;
    const {currentMobileCategory} = this.state;

    if (currentMobileCategory === 'action') {
      return (
        <RetroActionPanel
          retro={retro}
          retroId={retroId}
          isMobile
          archives={archives}
          createRetroItem={this.props.createRetroItem}
          createRetroActionItem={this.props.createRetroActionItem}
          doneRetroActionItem={this.props.doneRetroActionItem}
          deleteRetroActionItem={this.props.deleteRetroActionItem}
          editRetroActionItem={this.props.editRetroActionItem}
        />
      );
    }
    return (
      <RetroColumn
        category={currentMobileCategory}
        retro={retro}
        retroId={retroId}
        archives={archives}
        isMobile
        voteRetroItem={this.props.voteRetroItem}
        doneRetroItem={this.props.doneRetroItem}
        undoneRetroItem={this.props.undoneRetroItem}
        highlightRetroItem={this.props.highlightRetroItem}
        unhighlightRetroItem={this.props.unhighlightRetroItem}
        updateRetroItem={this.props.updateRetroItem}
        deleteRetroItem={this.props.deleteRetroItem}
        createRetroItem={this.props.createRetroItem}
        createRetroActionItem={this.props.createRetroActionItem}
        extendTimer={this.props.extendTimer}
      />
    );
  }

  renderDialog() {
    const dialogType = this.props.dialog ? this.props.dialog.type : '';

    switch (dialogType) {
      case 'ARCHIVE_RETRO':
        return (
          <ArchiveRetroDialog
            title={this.props.dialog.title}
            message={this.props.dialog.message}
            retro={this.props.retro}
            featureFlags={this.props.featureFlags}
            toggleSendArchiveEmail={this.props.toggleSendArchiveEmail}
            archiveRetro={this.props.archiveRetro}
            onClose={this.props.hideDialog}
          />
        );
      case 'SHARE_RETRO':
        return (
          <ShareRetroDialog
            retro={this.props.retro}
            retroId={this.props.retroId}
            onClose={this.props.hideDialog}
            copiedMagicLink={this.props.copiedMagicLink}
          />
        );
      default:
        return null;
    }
  }

  renderMobile(retro) {
    const {config, retroId, archives} = this.props;

    return (
      <span>
        <RetroWebsocket url={websocketUrl(config)} retro_id={retroId} websocketRetroDataReceived={this.props.websocketRetroDataReceived}/>
        {this.renderDialog()}
        <div className={archives ? 'mobile-display archived' : 'mobile-display'}>

          <RetroLegalBanner retroId={retroId} isPrivate={retro.is_private} config={config}/>

          <RetroHeading
            retro={retro}
            retroId={retroId}
            isMobile
            archives={archives}
            routeToRetroArchives={this.props.routeToRetroArchives}
            routeToRetroSettings={this.props.routeToRetroSettings}
            requireRetroLogin={this.props.requireRetroLogin}
            showDialog={this.props.showDialog}
            signOut={this.props.signOut}
            viewedMagicLink={this.props.viewedMagicLink}
          />

          <div className="mobile-tabs">
            <div className="mobile-tabs-list">
              <div
                className="mobile-tab-happy"
                onClick={() => this.onMobileTabClick('happy')}
              >
                Happy
              </div>
              <div
                className="mobile-tab-meh"
                onClick={() => this.onMobileTabClick('meh')}
              >
                Meh
              </div>
              <div
                className="mobile-tab-sad"
                onClick={() => this.onMobileTabClick('sad')}
              >
                Sad
              </div>
              <div
                className="mobile-tab-action"
                onClick={() => this.onMobileTabClick('action')}
              >
                Action
              </div>
            </div>
          </div>
          {this.renderColumnMobile(retro)}
          <RetroFooter config={config}/>
        </div>
      </span>
    );
  }

  renderDesktop(retro) {
    const {config, retroId, archives} = this.props;

    let retroContainerClasses = 'full-height full-height-retro';

    if (archives) {
      retroContainerClasses += ' archived';
    }

    const keyMap = {
      'next': 'right',
    };

    const keyHandlers = {
      'next': this.moveToNextItem,
    };

    return (
      <HotKeys keyMap={keyMap} handlers={keyHandlers}>
        <span>
          <RetroWebsocket url={websocketUrl(config)} retro_id={retroId} websocketRetroDataReceived={this.props.websocketRetroDataReceived}/>
          {this.renderDialog()}
          <div className={retroContainerClasses}>

            <RetroLegalBanner retroId={retroId} isPrivate={retro.is_private} config={config}/>

            <RetroHeading
              retro={retro}
              retroId={retroId}
              isMobile={false}
              archives={archives}
              routeToRetroArchives={this.props.routeToRetroArchives}
              routeToRetroSettings={this.props.routeToRetroSettings}
              requireRetroLogin={this.props.requireRetroLogin}
              showDialog={this.props.showDialog}
              signOut={this.props.signOut}
              viewedMagicLink={this.props.viewedMagicLink}
            />
            <div className="retro-item-list">
              <RetroColumn
                category="happy"
                retro={retro}
                retroId={retroId}
                archives={archives}
                isMobile={false}
                voteRetroItem={this.props.voteRetroItem}
                doneRetroItem={this.props.doneRetroItem}
                undoneRetroItem={this.props.undoneRetroItem}
                highlightRetroItem={this.props.highlightRetroItem}
                unhighlightRetroItem={this.props.unhighlightRetroItem}
                updateRetroItem={this.props.updateRetroItem}
                deleteRetroItem={this.props.deleteRetroItem}
                createRetroItem={this.props.createRetroItem}
                createRetroActionItem={this.props.createRetroActionItem}
                extendTimer={this.props.extendTimer}
              />
              <RetroColumn
                category="meh"
                retro={retro}
                retroId={retroId}
                archives={archives}
                isMobile={false}
                voteRetroItem={this.props.voteRetroItem}
                doneRetroItem={this.props.doneRetroItem}
                undoneRetroItem={this.props.undoneRetroItem}
                highlightRetroItem={this.props.highlightRetroItem}
                unhighlightRetroItem={this.props.unhighlightRetroItem}
                updateRetroItem={this.props.updateRetroItem}
                deleteRetroItem={this.props.deleteRetroItem}
                createRetroItem={this.props.createRetroItem}
                createRetroActionItem={this.props.createRetroActionItem}
                extendTimer={this.props.extendTimer}
              />
              <RetroColumn
                category="sad"
                retro={retro}
                retroId={retroId}
                archives={archives}
                isMobile={false}
                voteRetroItem={this.props.voteRetroItem}
                doneRetroItem={this.props.doneRetroItem}
                undoneRetroItem={this.props.undoneRetroItem}
                highlightRetroItem={this.props.highlightRetroItem}
                unhighlightRetroItem={this.props.unhighlightRetroItem}
                updateRetroItem={this.props.updateRetroItem}
                deleteRetroItem={this.props.deleteRetroItem}
                createRetroItem={this.props.createRetroItem}
                createRetroActionItem={this.props.createRetroActionItem}
                extendTimer={this.props.extendTimer}
              />
            </div>
            <RetroActionPanel
              retro={retro}
              retroId={retroId}
              isMobile={false}
              archives={archives}
              createRetroItem={this.props.createRetroItem}
              createRetroActionItem={this.props.createRetroActionItem}
              doneRetroActionItem={this.props.doneRetroActionItem}
              deleteRetroActionItem={this.props.deleteRetroActionItem}
              editRetroActionItem={this.props.editRetroActionItem}
            />
            <RetroFooter config={config}/>
          </div>
        </span>
      </HotKeys>
    );
  }

  render() {
    const {retro, archives, environment} = this.props;
    const {filtered_retro_archive} = this.state;
    const retro_object = archives ? filtered_retro_archive : retro;
    if (!(retro_object && retro_object.id)) {
      return (<EmptyPage/>);
    }
    if (environment.isMobile640) {
      return this.renderMobile(retro_object);
    }
    return this.renderDesktop(retro_object);
  }
}

const mapStateToProps = (state) => ({
  retro: state.retro.currentRetro,
  retro_archives: state.retro.currentArchivedRetro,
  dialog: state.messages.dialog,
  featureFlags: state.config.featureFlags,
  environment: state.config.environment,
});

const mapDispatchToProps = (dispatch) => ({
  getRetroArchive: (retroId, archiveId) => dispatch(getRetroArchive(retroId, archiveId)),
  getRetro: (retroId) => dispatch(getRetro(retroId)),
  nextRetroItem: (retro) => dispatch(nextRetroItem(retro)),
  archiveRetro: (retro) => dispatch(archiveRetro(retro)),
  hideDialog: () => dispatch(clearDialog()),
  toggleSendArchiveEmail: (send) => dispatch(currentRetroSendArchiveEmailUpdated(send)),
  routeToRetroArchives: (retroId) => dispatch(retroArchives(retroId)),
  routeToRetroSettings: (retroId) => dispatch(retroSettings(retroId)),
  requireRetroLogin: (retroId) => dispatch(retroLogin(retroId)),
  showDialog: (dialog) => dispatch(showDialog(dialog)),
  signOut: () => dispatch(signOut()),
  voteRetroItem: (retroId, item) => dispatch(voteRetroItem(retroId, item)),
  doneRetroItem: (retroId, item) => dispatch(doneRetroItem(retroId, item)),
  undoneRetroItem: (retroId, item) => dispatch(undoneRetroItem(retroId, item)),
  highlightRetroItem: (retroId, item) => dispatch(highlightRetroItem(retroId, item)),
  unhighlightRetroItem: (retroId) => dispatch(unhighlightRetroItem(retroId)),
  updateRetroItem: (retroId, item, description) => dispatch(updateRetroItem(retroId, item, description)),
  deleteRetroItem: (retroId, item) => dispatch(deleteRetroItem(retroId, item)),
  createRetroActionItem: (retroId, description) => dispatch(createRetroActionItem(retroId, description)),
  createRetroItem: (retroId, category, description) => dispatch(createRetroItem(retroId, category, description)),
  doneRetroActionItem: (retroId, actionItemId, done) => dispatch(doneRetroActionItem(retroId, actionItemId, done)),
  deleteRetroActionItem: (retroId, actionItem) => dispatch(deleteRetroActionItem(retroId, actionItem)),
  editRetroActionItem: (retroId, actionItemId, description) => dispatch(editRetroActionItem(retroId, actionItemId, description)),
  viewedMagicLink: (retroId) => dispatch(viewedMagicLink(retroId)),
  copiedMagicLink: (retroId) => dispatch(copiedMagicLink(retroId)),
  extendTimer: (retroId) => dispatch(extendTimer(retroId)),
  websocketRetroDataReceived: (data) => {
    if (data.command === 'force_relogin') {
      dispatch(forceRelogin(data.payload.originator_id, data.payload.retro.slug));
    } else {
      dispatch(currentRetroUpdated(data.retro));
    }
  },
});

const ConnectedShowRetroPage = connect(mapStateToProps, mapDispatchToProps)(ShowRetroPage);
export {ShowRetroPage, ConnectedShowRetroPage};
