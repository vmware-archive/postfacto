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
import RetroActionsColumn from './retro_actions_column';
import RetroColumnInput from './retro_column_input';

export default class RetroActionPanel extends React.Component {
  static propTypes = {
    retro: types.object.isRequired,
    retroId: types.string.isRequired,
    isMobile: types.bool.isRequired,
    archives: types.bool.isRequired,
    createRetroActionItem: types.func.isRequired,
    createRetroItem: types.func.isRequired,
    doneRetroActionItem: types.func.isRequired,
    deleteRetroActionItem: types.func.isRequired,
    editRetroActionItem: types.func.isRequired,
  };

  renderActionColumnTitle() {
    const {isMobile} = this.props;
    if (isMobile) {
      return null;
    }
    return <h2>Action items</h2>;
  }

  renderInput() {
    const {retroId, archives} = this.props;
    if (archives) {
      return null;
    }
    return (
      <RetroColumnInput
        retroId={retroId}
        category="action"
        createRetroItem={this.props.createRetroItem}
        createRetroActionItem={this.props.createRetroActionItem}
      />
    );
  }

  render() {
    const {retro, retroId, isMobile, archives} = this.props;

    const columns = ['current', 'last-week', 'older'].map((col) => (
      <RetroActionsColumn
        key={col}
        category={col}
        retro={retro}
        retroId={retroId}
        archives={archives}
        doneRetroActionItem={this.props.doneRetroActionItem}
        deleteRetroActionItem={this.props.deleteRetroActionItem}
        editRetroActionItem={this.props.editRetroActionItem}
      />
    ));
    return (
      <div className={isMobile ? 'column-action' : 'retro-action-panel'}>
        <div className="retro-action-header">
          {
            this.renderActionColumnTitle()
          }
          {
            this.renderInput()
          }
        </div>

        <div className="retro-action-list">
          {columns}
        </div>
      </div>
    );
  }
}
