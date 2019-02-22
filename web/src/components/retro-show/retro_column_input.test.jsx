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
import {Dispatcher} from 'p-flux';
import '../../spec_helper';

import RetroColumnInput from './retro_column_input';

const retroId = 'retro-slug-123';

describe('inputting a retro item', () => {
  let dom;

  beforeEach(() => {
    dom = mount(<RetroColumnInput retroId={retroId} category="happy"/>);
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

    expect(Dispatcher).toHaveReceived({
      type: 'createRetroItem',
      data: {retro_id: retroId, category: 'happy', description: 'a new retro item'},
    });

    expect(dom.find('textarea')).toHaveValue('');
  });

  it('adds a retro item when clicking button', () => {
    const textarea = dom.find('textarea');
    textarea.simulate('change', {target: {value: 'a new retro item'}});
    textarea.simulate('focus');

    dom.find('.input-button').simulate('click');

    expect(Dispatcher).toHaveReceived({
      type: 'createRetroItem',
      data: {retro_id: retroId, category: 'happy', description: 'a new retro item'},
    });

    expect(dom.find('textarea')).toHaveValue('');
  });

  it('does not add empty items', () => {
    const textarea = dom.find('textarea');
    textarea.simulate('change', {target: {value: ''}});
    textarea.simulate('keyPress', {key: 'Enter'});

    expect(Dispatcher).not.toHaveReceived('createRetroItem');
  });
});

describe('inputting an action item', () => {
  let subject;

  beforeEach(() => {
    subject = mount(<RetroColumnInput retroId={retroId} category="action"/>);
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

    expect(Dispatcher).toHaveReceived({
      type: 'createRetroActionItem',
      data: {retro_id: retroId, description: 'a new action item'},
    });

    expect(subject.find('textarea')).toHaveValue('');
  });

  it('allows entering literal newlines using shift+enter', () => {
    const textarea = subject.find('textarea');
    textarea.simulate('change', {target: {value: 'a new action item'}});
    textarea.simulate('keyPress', {key: 'Enter', shiftKey: true});

    expect(Dispatcher).not.toHaveReceived('createRetroActionItem');
  });

  it('does not allow empty items', () => {
    const textarea = subject.find('textarea');
    textarea.simulate('change', {target: {value: ''}});
    textarea.simulate('keyPress', {key: 'Enter'});

    expect(Dispatcher).not.toHaveReceived('createRetroActionItem');
  });

  it('moves submit button when textarea is resized', () => {
    const event = {target: {value: 'anything'}};

    subject.find('textarea').simulate('change', event);
    subject.find(TextareaAutosize).prop('onResize')(event);
    subject.update();

    expect(subject.find('.input-box')).toHaveClassName('multiline');
    expect(subject.find('.input-button-wrapper')).toHaveClassName('multiline');
  });
});
