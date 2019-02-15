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
import RetroMenu from './retro_menu';
import {FlatButton, FontIcon, RaisedButton} from 'material-ui';
import {Actions} from 'p-flux';

export default class RetroHeading extends React.PureComponent {

  onArchivesButtonClicked() {
    const {retroId} = this.props;
    Actions.routeToRetroArchives({retro_id: retroId});
  }

  renderBackButton() {
    const {archives, isMobile} = this.props;
    if (!archives) {
      return null;
    }
    return (
      <div className="small-2 columns back-button">
        <FlatButton
          className="retro-back"
          onClick={this.onArchivesButtonClicked.bind(this)}
          label="Archives"
          labelStyle={isMobile ? {'display': 'none'} : {}}
          icon={<FontIcon className="fa fa-chevron-left"/>}
        />
      </div>
    );
  }

  handleArchiveRetro() {
    Actions.showDialog({
      title: 'You\'re about to archive this retro.',
      message: 'Are you sure?',
    });
  }

  handleViewArchives() {
    const {retroId} = this.props;
    Actions.routeToRetroArchives({retro_id: retroId});
  }

  handleRetroSettings() {
    const {retroId} = this.props;

    if (window.localStorage.getItem(`apiToken-${retroId}`) !== null) {
      Actions.routeToRetroSettings({retro_id: retroId});
    } else {
      Actions.requireRetroLogin({retro_id: retroId});
    }
  }

  getMenuItems() {
    const {archives, retro} = this.props;
    let items = [
      {
        title: 'Archive this retro',
        callback: this.handleArchiveRetro.bind(this),
        isApplicable: !archives && retro.items && retro.items.length > 0,
        button: true,
      },
      {
        title: 'View archives',
        callback: this.handleViewArchives.bind(this),
        isApplicable: !archives && retro.archives && retro.archives.length > 0,
      },
      {
        title: 'Retro settings',
        callback: this.handleRetroSettings.bind(this),
        isApplicable: true,
      },
      {
        title: 'Sign out',
        callback: Actions.signOut,
        isApplicable: window.localStorage.length > 0,
      },
    ];

    return items.filter((item) => item.isApplicable);
  }

  render() {
    const {retro, isMobile, showVideoButton} = this.props;

    return (
      <div className="retro-heading">
        {this.renderBackButton()}
        <span className="retro-heading-content">
          <div className="retro-name">
            <h1>{retro.name}</h1>
          </div>
          <div className="retro-heading-buttons">
            {
              showVideoButton ?
                <RaisedButton
                  className="retro-heading-button video-button"
                  backgroundColor="#2574a9"
                  labelColor="#f8f8f8"
                  href={retro.video_link}
                  target="_blank"
                  label="VIDEO"
                /> : null
            }
            <RetroMenu isMobile={isMobile} items={this.getMenuItems()}/>
          </div>
        </span>
      </div>
    );
  }
}
