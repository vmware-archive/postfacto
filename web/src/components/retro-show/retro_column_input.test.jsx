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
import {mount} from 'enzyme';
import TextareaAutosize from 'react-autosize-textarea';
import '../../spec_helper';

import RetroColumnInput from './retro_column_input';
import EmojiSelector from './emoji_selector';

const retroId = 'retro-slug-123';

describe('inputting a retro item', () => {
  let dom;
  let createRetroItem;
  let createRetroActionItem;
  beforeEach(() => {
    createRetroItem = jest.fn();
    createRetroActionItem = jest.fn();
    dom = mount(<RetroColumnInput
      retroId={retroId}
      category="happy"
      createRetroItem={createRetroItem}
      createRetroActionItem={createRetroActionItem}
    />);
  });

  it('does not display submit button until text is entered', () => {
    expect(dom.find('.input-button')).not.toExist();

    dom.find('textarea').simulate('change', {target: {value: 'a new retro item'}});

    expect(dom.find('.input-button')).toExist();
  });

  it('adds a retro item when pressing enter', () => {
    const textarea = dom.find('textarea');
    expect(textarea.prop('placeholder')).toEqual('I\'m glad that...');

    textarea.simulate('change', {target: {value: 'a new retro item'}});
    textarea.simulate('keyPress', {key: 'a'});

    expect(dom.find('textarea')).toHaveValue('a new retro item');

    textarea.simulate('keyPress', {key: 'Enter'});

    expect(createRetroItem).toHaveBeenCalledWith(retroId, 'happy', 'a new retro item');

    expect(dom.find('textarea')).toHaveValue('');
  });

  it('adds a retro item when clicking button', () => {
    const textarea = dom.find('textarea');
    textarea.simulate('change', {target: {value: 'a new retro item'}});
    textarea.simulate('focus');

    dom.find('.input-button').simulate('click');

    expect(createRetroItem).toHaveBeenCalledWith(retroId, 'happy', 'a new retro item');

    expect(dom.find('textarea')).toHaveValue('');
  });

  it('does not add empty items', () => {
    const textarea = dom.find('textarea');
    textarea.simulate('change', {target: {value: ''}});
    textarea.simulate('keyPress', {key: 'Enter'});

    expect(createRetroItem).not.toHaveBeenCalled();
  });
});

describe('inputting an action item', () => {
  let subject;
  let createRetroItem;
  let createRetroActionItem;

  beforeEach(() => {
    createRetroItem = jest.fn();
    createRetroActionItem = jest.fn();
    subject = mount(<RetroColumnInput
      retroId={retroId}
      category="action"
      createRetroItem={createRetroItem}
      createRetroActionItem={createRetroActionItem}
    />);
  });

  it('does not display submit button until text is entered', () => {
    expect(subject.find('.input-button')).not.toExist();

    const textarea = subject.find('textarea');
    textarea.simulate('change', {target: {value: 'a new retro item'}});

    expect(subject.find('.input-button')).toExist();
  });

  it('adds an action item when pressing enter', () => {
    const textarea = subject.find('textarea');
    expect(textarea.prop('placeholder')).toEqual('Add an action item');

    textarea.simulate('change', {target: {value: 'a new action item'}});
    textarea.simulate('keyPress', {key: 'a'});

    expect(subject.find('textarea')).toHaveValue('a new action item');

    textarea.simulate('keyPress', {key: 'Enter'});

    expect(createRetroActionItem).toHaveBeenCalledWith(retroId, 'a new action item');

    expect(subject.find('textarea')).toHaveValue('');
  });

  it('allows entering literal newlines using shift+enter', () => {
    const textarea = subject.find('textarea');
    textarea.simulate('change', {target: {value: 'a new action item'}});
    textarea.simulate('keyPress', {key: 'Enter', shiftKey: true});

    expect(createRetroActionItem).not.toHaveBeenCalled();
  });

  it('does not allow empty items', () => {
    const textarea = subject.find('textarea');
    textarea.simulate('change', {target: {value: ''}});
    textarea.simulate('keyPress', {key: 'Enter'});

    expect(createRetroActionItem).not.toHaveBeenCalled();
  });

  it('moves submit button when textarea is resized', () => {
    const event = {target: {value: 'anything'}};

    subject.find('textarea').simulate('change', event);
    subject.find(TextareaAutosize).prop('onResize')(event);
    subject.update();

    expect(subject.find('.input-box')).toHaveClassName('multiline');
    expect(subject.find('.input-button-wrapper')).toHaveClassName('multiline');
  });

  it('removes multiline after resizing after submit', () => {
    const event = {target: {value: ''}};

    subject.find(TextareaAutosize).prop('onResize')(event);
    subject.update();

    expect(subject.find('.input-box')).not.toHaveClassName('multiline');
    expect(subject.find('.input-button-wrapper')).not.toHaveClassName('multiline');
  });

  it('shows the emoji button on button click', () => {
    expect(subject.find(EmojiSelector)).not.toExist();

    const textarea = subject.find('textarea');
    textarea.simulate('focus');
    subject.find('.emoji-button').simulate('click', {});

    expect(subject.find(EmojiSelector)).toExist();
  });

  it('adds the selected emoji to the selected position in text', () => {
    const textarea = subject.find('textarea');

    textarea.simulate('change', {target: {value: 'anything'}});

    expect(textarea).toHaveText('anything');

    subject.find('.emoji-button').simulate('click', {});
    subject.find('.emoji-selector-option').first().simulate('mouseDown', {});

    expect(textarea).toHaveText(String.fromCodePoint(0x1F600) + 'anything');
  });

  it('hides the emoji selector on blur', () => {
    expect(subject.find(EmojiSelector)).not.toExist();

    const textarea = subject.find('textarea');
    textarea.simulate('focus');
    subject.find('.emoji-button').simulate('click', {});

    expect(subject.find(EmojiSelector)).toExist();

    textarea.simulate('blur');

    expect(subject.find(EmojiSelector)).not.toExist();
  });
});
