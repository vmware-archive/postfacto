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
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import types from 'prop-types';
import {connect} from 'react-redux';
import RetroMenu from '../shared/retro_menu';
import RetroFooter from '../shared/footer';
import {getRetroArchives} from '../../redux/actions/api_actions';
import {retroArchive, showRetroForId} from '../../redux/actions/router_actions';
import {signOut} from '../../redux/actions/main_actions';

function makeDateString(date) {
  const year = date.getFullYear();
  const day = date.toLocaleDateString('en', {day: '2-digit'});
  const monthName = date.toLocaleDateString('en', {month: 'long'});

  // Ensure consistent ordering in all browsers: (eventually this should just conform to user locale anyway though)
  return `${day} ${monthName} ${year}`;
}

const createdAtDesc = (a, b) => (new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

// not pure: uses window.localStorage to check login status
class ListRetroArchivesPage extends React.Component {
  static propTypes = {
    archives: types.array,
    retroId: types.string.isRequired,
    config: types.object.isRequired,
    environment: types.shape({
      isMobile1030: types.bool,
    }).isRequired,
    getRetroArchives: types.func.isRequired,
    routeToRetroArchive: types.func.isRequired,
    showRetroForId: types.func.isRequired,
    signOut: types.func.isRequired,
  };

  static defaultProps = {
    archives: null,
  };

  componentWillMount() {
    const {retroId} = this.props;
    this.props.getRetroArchives(retroId);
  }

  onArchiveClicked(archiveId, e) {
    e.preventDefault();
    const {retroId} = this.props;
    this.props.routeToRetroArchive(retroId, archiveId);
  }

  onCurrentRetroClicked = () => {
    const {retroId} = this.props;
    this.props.showRetroForId(retroId);
  };

  getMenuItems() {
    const items = [
      {title: 'Sign out', callback: this.props.signOut, isApplicable: window.localStorage.length > 0},
    ];

    return items.filter((item) => item.isApplicable);
  }

  render() {
    const {archives, retroId, config, environment} = this.props;
    if (!archives) {
      return <div>Loading archives...</div>;
    }
    const isMobile = environment.isMobile1030;
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
              archives.sort(createdAtDesc).map((a) => (
                <div className="archive-row medium-6 medium-offset-3 columns end text-center" key={a.id}>
                  <div className="archive-link" onClick={(e) => this.onArchiveClicked(a.id, e)}>
                    <a href={`/retros/${retroId}/archives/${a.id}`}>
                      {makeDateString(new Date(a.created_at))}
                    </a>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
        <RetroFooter config={config}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  archives: state.retro.retroArchives,
  environment: state.config.environment,
});


const mapDispatchToProps = (dispatch) => ({
  getRetroArchives: (retroId) => dispatch(getRetroArchives(retroId)),
  routeToRetroArchive: (retroId, archiveId) => dispatch(retroArchive(retroId, archiveId)),
  showRetroForId: (retroId) => dispatch(showRetroForId(retroId)),
  signOut: () => dispatch(signOut()),
});

const ConnectedListRetroArchivesPage = connect(mapStateToProps, mapDispatchToProps)(ListRetroArchivesPage);
export {ListRetroArchivesPage, ConnectedListRetroArchivesPage};
