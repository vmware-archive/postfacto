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
import {Actions} from 'p-flux';
import RetroItemEditView from './retro_item_edit_view';

export default class RetroActionsColumnItem extends React.Component {
  static propTypes = {
    retro: types.object.isRequired,
    retroId: types.string.isRequired,
    action_item: types.object.isRequired,
    archives: types.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      isEditing: false
    };
  }

  renderTick() {
    const {action_item} = this.props;

    let tick = action_item.done ?
      <img className="action-tick-checked" src={require('../images/action-tick-checked.svg')}/>
      : <img className="action-tick-unchecked" src={require('../images/action-tick-unchecked.svg')}/>;
    return (
      <div className="action-tick" onClick={this.onActionTickClicked.bind(this)}>
        {tick}
      </div>
    );
  }

  renderEditButton() {
    const {archives} = this.props;
    if (archives) {
      return null;
    }
    return (
      <div className="action-edit" onClick={this.onActionEditClicked.bind(this)}>
        <i className="fa fa-pencil"/>
      </div>
    );
  }

  onActionTickClicked() {
    const {retroId, action_item} = this.props;
    Actions.doneRetroActionItem({retro_id: retroId, action_item_id: action_item.id, done: !action_item.done});
  }

  onActionEditClicked() {
    const {action_item} = this.props;
    this.setState({isEditing: true, editedText: action_item.description});
  }

  deleteItem() {
    const {retroId, action_item} = this.props;
    Actions.deleteRetroActionItem({retro_id: retroId, action_item: action_item});
  }

  saveActionItem(editedText) {
    const {retroId, action_item} = this.props;

    this.setState({isEditing: false});
    Actions.editRetroActionItem({retro_id: retroId, action_item_id: action_item.id, description: editedText});
  }

  render() {
    let actionContent;
    if (this.state.isEditing) {
      actionContent = (
        <RetroItemEditView
          originalText={this.props.action_item.description}
          deleteItem={this.deleteItem.bind(this)}
          saveItem={this.saveActionItem.bind(this)}
        />
      );
    } else {
      actionContent = (
        <div className="action-content">
          { this.renderTick() }
          <div className="action-text">
            {this.props.action_item.description}
          </div>
          { this.renderEditButton() }
        </div>
      );
    }

    return (
      <div className={`retro-action ${this.state.isEditing ? 'retro-action-edit' : '' }`}>
        { actionContent }
      </div>
    );
  }
}
