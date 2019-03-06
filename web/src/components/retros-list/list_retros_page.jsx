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
import {RaisedButton} from 'material-ui';
import types from 'prop-types';
import RetroFooter from '../shared/footer';
import RetroTile from './retro_tile';

export default class ListRetrosPage extends React.Component {
  static propTypes = {
    retros: types.array.isRequired,
    config: types.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleNewRetroButtonClicked = this.handleNewRetroButtonClicked.bind(this);
    this.handleSignOutButtonClicked = this.handleSignOutButtonClicked.bind(this);
  }

  componentWillMount() {
    Actions.getRetros();
  }

  handleRetroListItemClicked(retro) {
    Actions.routeToShowRetro(retro);
  }

  handleNewRetroButtonClicked() {
    Actions.routeToNewRetro();
  }

  handleSignOutButtonClicked() {
    Actions.signOut();
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
