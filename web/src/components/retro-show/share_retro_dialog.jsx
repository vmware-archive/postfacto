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
import Dialog from 'material-ui/Dialog';

export default class ShareRetroDialog extends React.Component {
  static propTypes = {
    retroId: types.string.isRequired,
    retro: types.shape({
      join_token: types.string,
    }).isRequired,
    onClose: types.func.isRequired,
    copiedMagicLink: types.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.retroUrl = `${window.location.origin}/retros/${this.props.retroId}/join/${this.props.retro.join_token}`;
    this.copyRetroUrl = this.copyRetroUrl.bind(this);
  }

  copyRetroUrl() {
    const textToCopy = document.querySelector('#share-retro-url');

    textToCopy.select();
    textToCopy.setSelectionRange(0, 99999); /* For mobile devices */

    document.execCommand('copy');
    this.props.copiedMagicLink(this.props.retroId);
  }

  render() {
    const closeButton = (
      <button
        className="share-dialog__actions--close"
        type="button"
        onClick={this.props.onClose}
      >
        Close
      </button>
    );

    return (
      <Dialog
        title="Invite others to this retro"
        actions={[closeButton]}
        open
        onRequestClose={this.props.onClose}
        actionsContainerClassName="share-dialog__actions"
        contentClassName="share-dialog"
      >
        Copy this link and send it to your team mates
        <div className="share-retro-url-wrapper">
          <input name="share-retro-url" readOnly id="share-retro-url" type="text" value={this.retroUrl}/>
          <div className="share-retro-url-copy" onClick={this.copyRetroUrl}>
            <i className="fa fa-copy"/>
          </div>
        </div>
      </Dialog>
    );
  }
}
