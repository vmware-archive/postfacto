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
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {SpyDispatcher} from '../../spec_helper';
import 'jasmine_dom_matchers';
import '../../test_support/jquery_simulate_react';

import RetroColumnInput from './retro_column_input';

const retroId = 'retro-slug-123';

describe('inputting a retro item', () => {
  beforeEach(() => {
    ReactDOM.render(<RetroColumnInput retroId={retroId} category="happy"/>, root);
  });
  it('adds an retro item when pressing enter', () => {
    const textarea = $('textarea');
    expect(textarea.attr('placeholder')).toEqual('I\'m glad that...');
    textarea.val('a new retro item').simulate('change');
    textarea.simulate('keyPress', {key: 'a'});
    expect('textarea').toHaveValue('a new retro item');
    textarea.simulate('keyPress', {key: 'Enter'});
    expect(SpyDispatcher).toHaveReceived({
      type: 'createRetroItem',
      data: {retro_id: retroId, category: 'happy', description: 'a new retro item'},
    });
    expect('textarea').toHaveValue('');
  });

  it('adds an retro item when clicking button', () => {
    $('textarea').val('a new retro item').simulate('change').simulate('focus');
    $('.input-button').simulate('click');
    expect(SpyDispatcher).toHaveReceived({
      type: 'createRetroItem',
      data: {retro_id: retroId, category: 'happy', description: 'a new retro item'},
    });
    expect('textarea').toHaveValue('');
  });

  it('doesn\'t add an item when pressing enter on an empty input field', () => {
    $('textarea').val('').simulate('change').simulate('keyPress', {key: 'Enter'});
    expect(SpyDispatcher).not.toHaveReceived('createRetroItem');
  });
});

describe('inputting an action item', () => {
  let subject;
  beforeEach(() => {
    subject = ReactDOM.render(<RetroColumnInput retroId={retroId} category="action"/>, root);
  });

  it('adds an action item when pressing enter', () => {
    const textarea = $('textarea');
    expect(textarea.attr('placeholder')).toEqual('Add an action item');
    textarea.val('a new action item').simulate('change').simulate('keyPress', {key: 'a'});
    expect('textarea').toHaveValue('a new action item');
    textarea.simulate('keyPress', {key: 'Enter'});
    expect(SpyDispatcher).toHaveReceived({
      type: 'createRetroActionItem',
      data: {retro_id: retroId, description: 'a new action item'},
    });
    expect('textarea').toHaveValue('');
  });

  it('does not submit when pressing shift + enter so new line is added', () => {
    $('textarea').val('a new action item').simulate('change').simulate('keyPress', {key: 'Enter', shiftKey: true});
    expect(SpyDispatcher).not.toHaveReceived('createRetroActionItem');
  });

  it('doesn\'t add an item when pressing enter on an empty input field', () => {
    $('textarea').val('').simulate('change').simulate('keyPress', {key: 'Enter'});
    expect(SpyDispatcher).not.toHaveReceived('createRetroActionItem');
  });

  describe('when the textarea is resized', () => {
    it('adds moves the submit button to the next line', () => {
      $('textarea').val('a new action item').simulate('change');
      const mockEvent = {target: {value: 'a new action items'}};
      subject.onResize(mockEvent); // resize event could not be simulated, so working around this

      expect($('.input-box').attr('class')).toContain('multiline');
      expect($('.input-button-wrapper').attr('class')).toContain('multiline');
    });
  });
});
