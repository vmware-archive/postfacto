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
import '../../spec_helper';

import RetroItemEditView from './retro_item_edit_view';
import EmojiSelector from './emoji_selector';

describe('RetroItemEditView', () => {
  let deleteSpy;
  let saveSpy;
  let dom;

  beforeEach(() => {
    deleteSpy = jest.fn().mockName('deleteSpy');
    saveSpy = jest.fn().mockName('saveSpy');

    dom = mount((
      <RetroItemEditView
        originalText="item text"
        deleteItem={deleteSpy}
        saveItem={saveSpy}
      />
    ));
  });

  it('should display edit view', () => {
    expect(dom.find('textarea')).toHaveValue('item text');
    expect(dom.find('.edit-delete')).toExist();
    expect(dom.find('.edit-save')).toExist();
  });

  describe('when typing in the text field ', () => {
    const sharedUpdateActionBehavior = () => {
      it('updates the action item', () => {
        expect(saveSpy).toHaveBeenCalledWith('some other value');
      });
    };

    describe('when save button is clicked', () => {
      beforeEach(() => {
        dom.find('textarea').simulate('change', {target: {value: 'some other value'}});
        dom.find('.edit-save').simulate('click');
      });

      sharedUpdateActionBehavior();
    });

    describe('when enter key is pressed', () => {
      beforeEach(() => {
        dom.find('textarea').simulate('change', {target: {value: 'some other value'}});
        dom.find('textarea').simulate('keyPress', {key: 'Enter'});
      });

      sharedUpdateActionBehavior();
    });

    it('does not submit when pressing shift + enter so new line is added', () => {
      dom.find('textarea').simulate('change', {target: {value: 'a new action item'}});
      dom.find('textarea').simulate('keyPress', {key: 'Enter', shiftKey: true});
      expect(saveSpy).not.toHaveBeenCalled();
    });

    it('does not allow editing if value is empty', () => {
      dom.find('textarea').simulate('change', {target: {value: ''}});
      dom.find('.edit-save').simulate('click');
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  describe('when clicking on delete ', () => {
    it('should remove the action item', () => {
      dom.find('.edit-delete').simulate('click');
      expect(deleteSpy).toHaveBeenCalled();
    });
  });

  describe('emoji button', () => {
    it('shows the emoji button on button click', () => {
      expect(dom.find(EmojiSelector)).not.toExist();

      const textarea = dom.find('textarea');
      textarea.simulate('focus');
      dom.find('.emoji-button').simulate('click', {});

      expect(dom.find(EmojiSelector)).toExist();
    });

    it('adds the selected emoji to the selected position in text', () => {
      const textarea = dom.find('textarea');

      textarea.simulate('change', {target: {value: 'anything'}});

      expect(textarea).toHaveText('anything');

      dom.find('.emoji-button').simulate('click', {});
      dom.find('.emoji-selector-option').first().simulate('mouseDown', {});

      expect(textarea).toHaveText(String.fromCodePoint(0x1F600) + 'anything');
    });
  });
});
