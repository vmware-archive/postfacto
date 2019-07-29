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
import RetroItemEditView from './retro_item_edit_view';
import actionTickCheckedSvg from '../../images/action-tick-checked.svg';
import actionTickUncheckedSvg from '../../images/action-tick-unchecked.svg';

export default class RetroActionsColumnItem extends React.Component {
  static propTypes = {
    retroId: types.string.isRequired,
    action_item: types.object.isRequired,
    archives: types.bool,
    doneRetroActionItem: types.func.isRequired,
    deleteRetroActionItem: types.func.isRequired,
    editRetroActionItem: types.func.isRequired,
  };

  static defaultProps = {
    archives: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
    };

    this.onActionTickClicked = this.onActionTickClicked.bind(this);
    this.onActionEditClicked = this.onActionEditClicked.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.saveActionItem = this.saveActionItem.bind(this);
  }

  renderTick() {
    const {action_item} = this.props;

    const tick = action_item.done ?
      <img className="action-tick-checked" src={actionTickCheckedSvg} alt="Done"/> :
      <img className="action-tick-unchecked" src={actionTickUncheckedSvg} alt="Not done"/>;
    return (
      <div className="action-tick" onClick={this.onActionTickClicked}>
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
      <div className="action-edit" onClick={this.onActionEditClicked}>
        <i className="fa fa-pencil"/>
      </div>
    );
  }

  onActionTickClicked() {
    const {retroId, action_item} = this.props;
    this.props.doneRetroActionItem(retroId, action_item.id, !action_item.done);
  }

  onActionEditClicked() {
    this.setState({isEditing: true});
  }

  deleteItem() {
    const {retroId, action_item} = this.props;
    this.props.deleteRetroActionItem(retroId, action_item);
  }

  saveActionItem(editedText) {
    const {retroId, action_item} = this.props;

    this.setState({isEditing: false});
    this.props.editRetroActionItem(retroId, action_item.id, editedText);
  }

  render() {
    let actionContent;
    if (this.state.isEditing) {
      actionContent = (
        <RetroItemEditView
          originalText={this.props.action_item.description}
          deleteItem={this.deleteItem}
          saveItem={this.saveActionItem}
        />
      );
    } else {
      actionContent = (
        <div className="action-content">
          {this.renderTick()}
          <div className="action-text">
            {this.props.action_item.description}
          </div>
          {this.renderEditButton()}
        </div>
      );
    }

    return (
      <div className={`retro-action ${this.state.isEditing ? 'retro-action-edit' : ''}`}>
        {actionContent}
      </div>
    );
  }
}
