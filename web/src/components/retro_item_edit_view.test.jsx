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
import '../spec_helper';

import RetroItemEditView from './retro_item_edit_view';

describe('RetroItemEditView', () => {
  let deleteSpy;
  let saveSpy;

  beforeEach(() => {
    deleteSpy = jasmine.createSpy('delete');
    saveSpy = jasmine.createSpy('save');
    ReactDOM.render(
      <RetroItemEditView
        originalText="item text"
        deleteItem={deleteSpy}
        saveItem={saveSpy}
      />, root,
    );
  });

  it('should display edit view', () => {
    expect('textarea').toHaveValue('item text');
    expect('.edit-delete').toExist();
    expect('.edit-save').toExist();
  });

  describe('when typing in the text field ', () => {
    const sharedUpdateActionBehavior = () => {
      it('updates the action item', () => {
        expect(saveSpy).toHaveBeenCalledWith('some other value');
      });
    };

    describe('when save button is clicked', () => {
      beforeEach(() => {
        $('textarea').val('some other value').simulate('change');
        $('.edit-save').simulate('click');
      });

      sharedUpdateActionBehavior();
    });

    describe('when enter key is pressed', () => {
      beforeEach(() => {
        $('textarea').val('some other value').simulate('change').simulate('keyPress', {key: 'Enter'});
      });

      sharedUpdateActionBehavior();
    });

    it('does not submit when pressing shift + enter so new line is added', () => {
      $('textarea').val('a new action item').simulate('change').simulate('keyPress', {key: 'Enter', shiftKey: true});
      expect(saveSpy).not.toHaveBeenCalled();
    });

    it('does not allow editing if value is empty', () => {
      $('textarea').val('').simulate('change');
      $('.edit-save').simulate('click');
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  describe('when clicking on delete ', () => {
    it('should remove the action item', () => {
      $('.edit-delete').simulate('click');
      expect(deleteSpy).toHaveBeenCalled();
    });
  });
});
