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

const React = require('react');
const types = React.PropTypes;
const {Actions} = require('p-flux');
const TextareaAutosize = require('react-autosize-textarea');

class RetroColumnInput extends React.Component {
  static propTypes = {
    category: types.string.isRequired,
    retro: types.object.isRequired,
    retroId: types.string.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      inputText: '',
      isFocused: false,
      multiline: ''
    };
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
      if(event.target.value !== '') {
        this.submitRetroItem();
      }
      event.preventDefault();
    }
  }

  submitRetroItem() {
    const {retroId, category} = this.props;
    const {inputText} = this.state;
    if (category === 'action') {
      Actions.createRetroActionItem({retro_id: retroId, description: inputText});
    }
    else {
      Actions.createRetroItem({retro_id: retroId, category: category, description: inputText});
    }
    this.setState({inputText: '', multiline: ''});
  }

  onChange(event) {
    if(event.target.value.trim().length === 0) {
      this.setState({multiline: ''});
    }

    this.setState({inputText: event.target.value});
  }

  onResize(event) {
      this.setState({multiline: 'multiline', inputText: event.target.value});
  }

  inputFocus() {
    this.setState({isFocused: true});
  }

  inputBlur() {
    this.setState({isFocused: false});
  }

  renderButton() {
    if (this.state.inputText) {
      return (
        <div className={'input-button-wrapper ' + this.state.multiline}>
          <div className="input-button"
               onClick={this.submitRetroItem.bind(this)}>
            <i className="fa fa-check" aria-hidden="true"/>
          </div>
        </div>
      );
    }
    return null;
  }

  resolveInputBoxClass() {
    const {multiline, isFocused} = this.state;
    let classes = 'input-box ' + multiline;

    if (isFocused) {
      classes += ' focused';
    }
    return classes;
  }

  render() {
    const {category} = this.props;

    let classNames = 'retro-item-add-input';

    return (
      <div className="retro-item-list-input">
        <div className={this.resolveInputBoxClass()}>
          <TextareaAutosize type="text" className={classNames} placeholder={this.resolvePlaceholder(category)}
                            onFocus={this.inputFocus.bind(this)}
                            onBlur={this.inputBlur.bind(this)}
                            onChange={this.onChange.bind(this)}
                            value={this.state.inputText}
                            onKeyPress={this.onKeyPress.bind(this)}
                            onResize={this.onResize.bind(this)}
                            required={true}
                            autoComplete={false}/>
          {
            this.renderButton()
          }
        </div>
      </div>
    );
  }
}

module.exports = RetroColumnInput;
