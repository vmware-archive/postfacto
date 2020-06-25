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
import Toggle from 'material-ui/Toggle';
import Dialog from 'material-ui/Dialog';
import {DEFAULT_TOGGLE_STYLE} from '../shared/constants';

export default class ArchiveRetroDialog extends React.Component {
  static propTypes = {
    title: types.string.isRequired,
    message: types.string.isRequired,
    retro: types.object.isRequired,
    onClose: types.func.isRequired,
    featureFlags: types.object.isRequired,
    toggleSendArchiveEmail: types.func.isRequired,
    archiveRetro: types.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleArchiveEmailPreferenceChange = this.handleArchiveEmailPreferenceChange.bind(this);
    this.handleArchiveRetroConfirmation = this.handleArchiveRetroConfirmation.bind(this);
  }

  handleArchiveEmailPreferenceChange() {
    this.props.toggleSendArchiveEmail(!this.props.retro.send_archive_email);
  }

  handleArchiveRetroConfirmation() {
    this.props.archiveRetro(this.props.retro);
    this.props.onClose();
  }

  render() {
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
        onClick={this.props.onClose}
      >
        Cancel
      </button>
    );

    return (
      <Dialog
        title={this.props.title}
        actions={[cancelButton, archiveButton]}
        open
        onRequestClose={this.props.onClose}
        actionsContainerClassName="archive-dialog__actions"
        contentClassName="archive-dialog"
      >
        <p>{this.props.message}</p>
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
}
