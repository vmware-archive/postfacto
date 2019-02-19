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
import {Actions} from 'p-flux';
import moment from 'moment';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import types from 'prop-types';
import RetroMenu from './retro_menu';
import RetroFooter from './footer';

export default class ListRetroArchivesPage extends React.Component {
  static propTypes = {
    archives: types.array,
    retroId: types.string.isRequired,
  };

  static defaultProps = {
    archives: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isMobile: false,
    };

    this.handleResize = this.handleResize.bind(this);
    this.onCurrentRetroClicked = this.onCurrentRetroClicked.bind(this);
  }

  componentWillMount() {
    const {retroId} = this.props;
    Actions.getRetroArchives({retro_id: retroId});
    this.handleResize();
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  onArchiveClicked(archiveId, e) {
    e.preventDefault();
    const {retroId} = this.props;
    Actions.routeToRetroArchive({retro_id: retroId, archive_id: archiveId});
  }

  sortedArchives(archives) {
    return archives.sort((a, b) => (moment(b.created_at) - moment(a.created_at)));
  }

  onCurrentRetroClicked() {
    const {retroId} = this.props;
    Actions.backPressedFromArchives({retro_id: retroId});
  }

  handleResize() {
    this.setState({isMobile: this.getIsMobile()});
  }

  getIsMobile() {
    return window.innerWidth <= 1030;
  }

  getMenuItems() {
    const items = [
      {title: 'Sign out', callback: Actions.signOut, isApplicable: window.localStorage.length > 0},
    ];

    return items.filter((item) => item.isApplicable);
  }

  render() {
    const {archives, retroId} = this.props;
    if (!archives) {
      return <div>Loading archives...</div>;
    }
    const {isMobile} = this.state;
    const menuItems = this.getMenuItems();

    return (
      <div className={'retro-archives full-height' + (isMobile ? ' mobile-display' : '')}>
        <div className="retro-heading row">
          <div className="small-2 columns back-button">
            <FlatButton
              className="retro-back"
              onClick={this.onCurrentRetroClicked}
              label="Current retro"
              labelStyle={isMobile ? {'display': 'none'} : {}}
              icon={<FontIcon className="fa fa-chevron-left"/>}
            />
          </div>
          <h1 className="small-8 text-center retro-name">
            Archives
          </h1>
          <div className="small-2 menu end">
            <RetroMenu isMobile={false} items={menuItems}/>
          </div>
        </div>

        <div className="archives">
          <div className="row">
            {
              this.sortedArchives(archives).map((a) => (
                <div className="archive-row medium-6 medium-offset-3 columns end text-center" key={a.id}>
                  <div className="archive-link" onClick={(e) => this.onArchiveClicked(a.id, e)}>
                    <a href={`/retros/${retroId}/archives/${a.id}`}>
                      {moment(a.created_at).local().format('DD MMMM YYYY')}
                    </a>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
        <RetroFooter/>
      </div>
    );
  }
}
