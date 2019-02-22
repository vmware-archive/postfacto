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
import TextareaAutosize from 'react-autosize-textarea';
import EmojiSelector from './emoji_selector';

export default class RetroItemEditView extends React.Component {
    static propTypes = {
      originalText: types.string.isRequired,
      deleteItem: types.func.isRequired,
      saveItem: types.func.isRequired,
    };

    constructor(props) {
      super(props);
      this.state = {
        editedText: '',
        saveDisabled: '',
      };

      this.onTextChanged = this.onTextChanged.bind(this);
      this.onKeyPress = this.onKeyPress.bind(this);
      this.onDeleteClicked = this.onDeleteClicked.bind(this);
      this.onSaveClicked = this.onSaveClicked.bind(this);
      this.onEmojiButtonClicked = this.onEmojiButtonClicked.bind(this);
      this.onEmojiSelected = this.onEmojiSelected.bind(this);
    }

    componentDidMount() {
      // this is not in constructor so that the cursor aligns to end of textarea in Safari
      this.setState({editedText: this.props.originalText});
    }

    onTextChanged(event) {
      const value = event.target.value;

      this.setState({editedText: value, saveDisabled: value.length === 0 ? 'disabled' : ''});
    }

    onSaveClicked(event) {
      event.stopPropagation();
      const {editedText} = this.state;

      if (editedText.trim().length > 0) {
        this.props.saveItem(editedText);
      }
    }

    onDeleteClicked(event) {
      event.stopPropagation();
      this.props.deleteItem();
    }

    onEmojiButtonClicked() {
      const {isSelectingEmoji} = this.state;
      this.setState({isSelectingEmoji: !isSelectingEmoji});
      this.textarea.focus();
    }

    onEmojiSelected(event, emoji) {
      this.setState(({editedText, ...oldState}) => {
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        const newInputText = editedText.substring(0, start) + emoji + editedText.substring(end, editedText.length);
        this.textarea.focus();
        return ({
          ...oldState,
          editedText: newInputText,
          isSelectingEmoji: false,
        });
      });
    }

    onKeyPress(event) {
      const {editedText} = this.state;
      const value = event.target.value;
      if (event.key === 'Enter' && !event.shiftKey && value && value.trim().length > 0) {
        this.props.saveItem(editedText);
      }
    }

    renderTextInput() {
      return (
        <div className="edit-text">
          <TextareaAutosize
            type="text"
            name="edit-text-field"
            autoFocus
            value={this.state.editedText}
            onChange={this.onTextChanged}
            onKeyPress={this.onKeyPress}
            innerRef={(ref) => { this.textarea = ref; }}
          />
        </div>
      );
    }

    renderDeleteButton() {
      return (
        <div className="edit-delete" onClick={this.onDeleteClicked}>
          <i className="fa fa-trash-o"/>
          <span>Delete</span>
        </div>
      );
    }

    renderSaveButton() {
      const {saveDisabled} = this.state;

      return (
        <div className={'edit-save ' + saveDisabled} onClick={this.onSaveClicked}>
          <i className="fa fa-check"/>
          <span>Save</span>
        </div>
      );
    }

    renderEmojiButton() {
      return (
        <div className="emoji-button" onClick={this.onEmojiButtonClicked}>
          <i className="fa fa-smile-o" aria-hidden="true"/>
        </div>
      );
    }

    renderEmojiSelector() {
      const {isSelectingEmoji} = this.state;
      if (!isSelectingEmoji) {
        return null;
      }
      return (
        <EmojiSelector onSelect={this.onEmojiSelected}/>
      );
    }

    render() {
      return (
        <div className="edit-view">
          <div className="edit-content">
            {this.renderTextInput()}
          </div>
          {this.renderEmojiSelector()}
          <div className="edit-buttons">
            {this.renderDeleteButton()}
            {this.renderEmojiButton()}
            {this.renderSaveButton()}
          </div>
        </div>
      );
    }
}
