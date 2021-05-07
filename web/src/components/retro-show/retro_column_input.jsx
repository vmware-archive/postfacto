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

function inputHasContent(target) {
  return target.value.trim().length !== 0;
}

export default class RetroColumnInput extends React.Component {
    static propTypes = {
      category: types.string.isRequired,
      retroId: types.string.isRequired,
      createRetroItem: types.func.isRequired,
      createRetroActionItem: types.func.isRequired,
    };

    constructor(props) {
      super(props);
      this.textarea = React.createRef();
      this.state = {
        inputText: '',
        isFocused: false,
        multiline: '',
      };

      this.submitRetroItem = this.submitRetroItem.bind(this);
      this.inputFocus = this.inputFocus.bind(this);
      this.inputBlur = this.inputBlur.bind(this);
      this.onChange = this.onChange.bind(this);
      this.onKeyPress = this.onKeyPress.bind(this);
      this.onResize = this.onResize.bind(this);
    }

    resolvePlaceholder() {
      const {category} = this.props;
      if (category === 'happy') {
        return 'I\'m glad that...';
      }
      if (category === 'meh') {
        return 'I\'m wondering about...';
      }
      if (category === 'sad') {
        return 'It wasn\'t so great that...';
      }
      return 'Add an action item';
    }

    onKeyPress(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        if (event.target.value !== '') {
          this.submitRetroItem();
        }
        event.preventDefault();
      }
    }

    submitRetroItem() {
      const {retroId, category} = this.props;
      const {inputText} = this.state;
      if (category === 'action') {
        this.props.createRetroActionItem(retroId, inputText);
      } else {
        this.props.createRetroItem(retroId, category, inputText);
      }
      this.setState({inputText: '', multiline: ''});
    }

    onChange(event) {
      if (!inputHasContent(event.target)) {
        this.setState({multiline: ''});
      }

      this.setState({inputText: event.target.value});
    }

    onResize(event) {
      // store value as well to work around https://github.com/buildo/react-autosize-textarea/issues/109

      const multiline = inputHasContent(event.target) ? 'multiline' : '';
      this.setState({multiline, inputText: event.target.value});
    }

    inputFocus() {
      this.setState({isFocused: true});
    }

    inputBlur() {
      this.setState({
        isFocused: false,
        isSelectingEmoji: false,
      });
    }

    renderDoneButton() {
      if (this.state.inputText) {
        return (
          <div className={'input-button-wrapper ' + this.state.multiline}>
            <div
              className="input-button"
              onClick={this.submitRetroItem}
            >
              <i className="fa fa-check" aria-hidden="true"/>
            </div>
          </div>
        );
      }
      return null;
    }

    onEmojiButtonClick(event) {
      event.preventDefault();
      const {isSelectingEmoji} = this.state;
      this.setState({isSelectingEmoji: !isSelectingEmoji});
      this.textarea.current.focus();
    }

    onEmojiSelect(event, emoji) {
      event.preventDefault();
      this.setState(({inputText, ...oldState}) => {
        const start = this.textarea.current.selectionStart;
        const end = this.textarea.current.selectionEnd;
        const newInputText = inputText.substring(0, start) + emoji + inputText.substring(end, inputText.length);
        this.textarea.current.focus();
        return ({
          ...oldState,
          inputText: newInputText,
          isSelectingEmoji: false,
        });
      });
    }

    renderEmojiButton() {
      return (
        <div className={'input-button-wrapper ' + this.state.multiline}>
          <div className="emoji-button" onClick={(...args) => this.onEmojiButtonClick(...args)}>
            <i className="fa fa-smile-o" aria-hidden="true"/>
          </div>
        </div>
      );
    }

    renderEmojiSelector() {
      const {isSelectingEmoji} = this.state;
      if (!isSelectingEmoji) {
        return null;
      }
      return <EmojiSelector hidden={!isSelectingEmoji} onSelect={(event, emoji) => this.onEmojiSelect(event, emoji)}/>;
    }

    resolveInputBoxClass() {
      const {multiline, isFocused, isSelectingEmoji} = this.state;
      let classes = 'input-box ' + multiline;

      if (isFocused || isSelectingEmoji) {
        classes += ' focused';
      }

      if (isSelectingEmoji) {
        classes += ' emoji-selector-focus';
      }
      return classes;
    }

    render() {
      const {category} = this.props;

      const classNames = 'retro-item-add-input';

      return (
        <div className="retro-item-list-input">
          <div className={this.resolveInputBoxClass()}>
            <TextareaAutosize
              type="text"
              className={classNames}
              placeholder={this.resolvePlaceholder(category)}
              onFocus={this.inputFocus}
              onBlur={this.inputBlur}
              onChange={this.onChange}
              value={this.state.inputText}
              onKeyPress={this.onKeyPress}
              onResize={this.onResize}
              required
              autoComplete="off"
              ref={this.textarea}
            />
            <div className="input-buttons">
              {this.renderEmojiButton()}
              {this.renderDoneButton()}
            </div>
          </div>
          {this.renderEmojiSelector()}
        </div>
      );
    }
}
