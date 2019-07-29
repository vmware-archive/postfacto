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

import RetroActionsColumnItem from './retro_actions_column_item';

const retroId = 'retro-slug-123';
const itemDone = {
  id: 1,
  description: 'action item 1',
  done: true,
};
const itemNotDone = {
  id: 2,
  description: 'action item 2',
  done: false,
};

describe('RetroActionsColumnItem', () => {
  let dom;
  let doneRetroActionItem;
  let deleteRetroActionItem;
  let editRetroActionItem;

  beforeEach(() => {
    doneRetroActionItem = jest.fn();
    deleteRetroActionItem = jest.fn();
    editRetroActionItem = jest.fn();

    dom = mount(<RetroActionsColumnItem
      retroId={retroId}
      action_item={itemDone}
      doneRetroActionItem={doneRetroActionItem}
      deleteRetroActionItem={deleteRetroActionItem}
      editRetroActionItem={editRetroActionItem}
    />);
  });

  it('renders each action item', () => {
    expect(dom.find('.retro-action .action-text')).toIncludeText('action item 1');
  });

  it('shows checks by completed items', () => {
    expect(dom.find('.action-tick .action-tick-checked')).toExist();
  });

  it('marks items as not done when clicking pre-ticked box', () => {
    dom.find('.retro-action .action-tick').simulate('click');

    expect(doneRetroActionItem).toHaveBeenCalledWith(retroId, 1, false);
  });

  describe('editing', () => {
    beforeEach(() => {
      dom.find('.retro-action .action-edit').simulate('click');
    });

    it('displays the edit view', () => {
      expect(dom.find('.edit-content')).toExist();
    });

    it('updates the action item when save is clicked', () => {
      dom.find('.retro-action textarea').simulate('change', {target: {value: 'some other value'}});
      dom.find('.retro-action .edit-save').simulate('click');

      expect(dom.find('.retro-action.retro-action-edit')).not.toExist();

      expect(editRetroActionItem).toHaveBeenCalledWith(retroId, 1, 'some other value');
    });

    it('updates the action item when pressing enter', () => {
      dom.find('.retro-action textarea').simulate('change', {target: {value: 'some other value'}});
      dom.find('.retro-action textarea').simulate('keyPress', {key: 'Enter'});

      expect(dom.find('.retro-action.retro-action-edit')).not.toExist();

      expect(editRetroActionItem).toHaveBeenCalledWith(retroId, 1, 'some other value');
    });

    it('does not update if value is empty', () => {
      dom.find('.retro-action textarea').simulate('change', {target: {value: ''}});
      dom.find('.retro-action .edit-save').simulate('click');

      expect(editRetroActionItem).not.toHaveBeenCalled();
    });

    it('removes the action item when delete is clicked', () => {
      dom.find('.retro-action .edit-delete').simulate('click');

      expect(deleteRetroActionItem).toHaveBeenCalledWith(retroId, itemDone);
    });
  });

  it('updates displayed text when props change', () => {
    dom.setProps({
      action_item: {
        id: 1,
        description: 'changed',
        done: true,
      },
    });

    expect(dom.find('.retro-action .action-text')).toIncludeText('changed');
  });

  it('does not show check by items which are not done', () => {
    dom = mount(<RetroActionsColumnItem retroId={retroId} action_item={itemNotDone} doneRetroActionItem={jest.fn()} deleteRetroActionItem={jest.fn()} editRetroActionItem={jest.fn()}/>);
    expect(dom.find('.action-tick .action-tick-unchecked')).toExist();
  });

  it('does not allow editing if archived', () => {
    dom = mount(<RetroActionsColumnItem retroId={retroId} action_item={itemDone} archives doneRetroActionItem={jest.fn()} deleteRetroActionItem={jest.fn()} editRetroActionItem={jest.fn()}/>);
    expect(dom.find('.action-edit')).not.toExist();
  });
});
