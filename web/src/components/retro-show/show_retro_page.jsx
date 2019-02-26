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

import Dialog from 'material-ui/Dialog';
import Toggle from 'material-ui/Toggle';

import React from 'react';
import types from 'prop-types';
import {Actions} from 'p-flux';

import {HotKeys} from 'react-hotkeys';
import RetroColumn from './retro_column';
import RetroActionPanel from './retro_action_panel';
import RetroWebsocket from './retro_websocket';
import RetroFooter from '../shared/footer';
import RetroLegalBanner from './retro_legal_banner';
import RetroHeading from './retro_heading';

import EmptyPage from '../shared/empty_page';

import {DEFAULT_TOGGLE_STYLE} from '../shared/constants';

function getItemArchiveTime(item) {
  if (!item.archived_at) {
    return null;
  }
  return new Date(item.archived_at).getTime();
}

export default class ShowRetroPage extends React.Component {
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
    }),
    environment: types.shape({
      isMobile640: types.bool,
    }).isRequired,
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

  componentWillMount() {
    const {retroId, archiveId, retro_archives, archives} = this.props;

    this.fetchRetros(retroId, archives, archiveId);
    this.initializeArchivesState(retro_archives, archives);
  }

  componentWillReceiveProps(nextProps) {
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
      Actions.getRetroArchive({retro_id: retroId, archive_id: archiveId});
    } else {
      Actions.getRetro({id: retroId});
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
    const {retroId} = this.props;
    Actions.nextRetroItem({retro_id: retroId});
  }

  // Handle events
  onMobileTabClick(category) {
    this.setState({currentMobileCategory: category});
  }

  handleArchiveRetroConfirmation() {
    Actions.archiveRetro({retro: this.props.retro});
    Actions.hideDialog();
  }

  handleArchiveEmailPreferenceChange() {
    Actions.toggleSendArchiveEmail({
      currentSendArchiveEmail: this.props.retro.send_archive_email,
    });
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
      />
    );
  }

  renderArchiveConfirmationDialog() {
    const title = this.props.dialog ? this.props.dialog.title : '';
    const message = this.props.dialog ? this.props.dialog.message : '';
    const toggle = DEFAULT_TOGGLE_STYLE;

    const archiveButton = (
      <button
        className="archive-dialog__actions--archive"
        type="button"
        onClick={this.handleArchiveRetroConfirmation}
      >
        {this.props.retro.send_archive_email && this.props.featureFlags.archiveEmails ? 'Archive & send email' : 'Archive'}
      </button>
    );

    const cancelButton = (
      <button
        className="archive-dialog__actions--cancel"
        type="button"
        onClick={Actions.hideDialog}
      >
        Cancel
      </button>
    );

    return (
      <Dialog
        title={title}
        actions={[cancelButton, archiveButton]}
        open={!!this.props.dialog}
        onRequestClose={Actions.hideDialog}
        actionsContainerClassName="archive-dialog__actions"
        contentClassName="archive-dialog"
      >
        <p>{message}</p>
        {
          this.props.featureFlags.archiveEmails ? (
            <div>
              <label className="label" htmlFor="send_archive_email">Send action items to the team via email?</label>

              <Toggle
                id="send_archive_email"
                name="sendArchiveEmail"
                label={this.props.retro.send_archive_email ? 'Yes' : 'No'}
                toggled={this.props.retro.send_archive_email}
                labelPosition="right"
                onToggle={this.handleArchiveEmailPreferenceChange}
                trackStyle={toggle.trackStyle}
                trackSwitchedStyle={toggle.trackSwitchedStyle}
                labelStyle={toggle.labelStyle}
                thumbStyle={toggle.thumbStyle}
                thumbSwitchedStyle={toggle.thumbSwitchedStyle}
                iconStyle={toggle.iconStyle}
              />
            </div>
          ) : null
        }
      </Dialog>
    );
  }

  renderMobile(retro) {
    const {config, retroId, archives} = this.props;

    return (
      <span>
        <RetroWebsocket url={config.websocket_url} retro_id={retroId}/>
        {this.renderArchiveConfirmationDialog()}
        <div className={archives ? 'mobile-display archived' : 'mobile-display'}>

          <RetroLegalBanner retroId={retroId} isPrivate={retro.is_private} config={config}/>

          <RetroHeading retro={retro} retroId={retroId} isMobile archives={archives}/>

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
          <RetroWebsocket url={config.websocket_url} retro_id={retroId}/>
          {this.renderArchiveConfirmationDialog()}
          <div className={retroContainerClasses}>

            <RetroLegalBanner retroId={retroId} isPrivate={retro.is_private} config={config}/>

            <RetroHeading
              retro={retro}
              retroId={retroId}
              isMobile={false}
              archives={archives}
              showVideoButton={!archives}
            />
            <div className="retro-item-list">
              <RetroColumn
                category="happy"
                retro={retro}
                retroId={retroId}
                archives={archives}
                isMobile={false}
              />
              <RetroColumn
                category="meh"
                retro={retro}
                retroId={retroId}
                archives={archives}
                isMobile={false}
              />
              <RetroColumn
                category="sad"
                retro={retro}
                retroId={retroId}
                archives={archives}
                isMobile={false}
              />
            </div>
            <RetroActionPanel
              retro={retro}
              retroId={retroId}
              isMobile={false}
              archives={archives}
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
