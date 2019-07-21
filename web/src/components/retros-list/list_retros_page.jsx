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
import {RaisedButton} from 'material-ui';
import types from 'prop-types';
import {connect} from 'react-redux';
import RetroFooter from '../shared/footer';
import RetroTile from './retro_tile';
import {newRetro, showRetro} from '../../redux/actions/router_actions';
import {signOut, getRetros} from '../../redux/actions/main_actions';

class ListRetrosPage extends React.Component {
  static propTypes = {
    retros: types.array.isRequired,
    config: types.object.isRequired,
    navigateTo: types.func.isRequired,
    getRetros: types.func.isRequired,
    signOut: types.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleNewRetroButtonClicked = this.handleNewRetroButtonClicked.bind(this);
    this.handleSignOutButtonClicked = this.handleSignOutButtonClicked.bind(this);
  }

  componentWillMount() {
    this.props.getRetros();
  }

  handleRetroListItemClicked(retro) {
    this.props.navigateTo(showRetro(retro));
  }

  handleNewRetroButtonClicked() {
    this.props.navigateTo(newRetro());
  }

  handleSignOutButtonClicked() {
    this.props.signOut();
  }

  render() {
    const {config, retros} = this.props;

    const retroListItems = retros.map((retro) => (
      <RetroTile key={retro.slug} callback={() => this.handleRetroListItemClicked(retro)} retro={retro}/>
    ));

    return (
      <div className="list-retros-page full-height">
        <div className="retro-heading">
          <span className="retro-heading-content">
            <div className="retro-name">
              <h1>My Retros</h1>
            </div>
            <div className="retro-heading-buttons">
              <RaisedButton
                className="new-retro"
                backgroundColor="#2574a9"
                labelColor="#f8f8f8"
                label="NEW RETRO"
                onClick={this.handleNewRetroButtonClicked}
              />

              <RaisedButton
                className="sign-out"
                backgroundColor="#2574a9"
                labelColor="#f8f8f8"
                label="SIGN OUT"
                onClick={this.handleSignOutButtonClicked}
              />
            </div>
          </span>
        </div>

        <div className="retro-tiles-container">
          <div className="retro-tiles">
            {retroListItems}
          </div>
        </div>

        <RetroFooter config={config}/>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  retros: state.retro.retros,
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location) => dispatch(location),
  signOut: () => dispatch(signOut()),
  getRetros: () => dispatch(getRetros()),
});

const ConnectedListRetrosPage = connect(mapStateToProps, mapDispatchToProps)(ListRetrosPage);
export {ListRetrosPage, ConnectedListRetrosPage};
