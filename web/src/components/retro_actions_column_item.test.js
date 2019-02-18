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

import RetroActionsColumnItem from './retro_actions_column_item';

const retroId = 'retro-slug-123';
const retro = {
  id: 123,
  name: 'the retro name',
  video_link: 'http://the/video/link',
  items: [
    {
      id: 1,
      description: 'the happy retro item',
      category: 'happy',
      created_at: '2016-07-19T00:00:00.000Z',
      vote_count: 10,
    },
  ],
  action_items: [
    {
      id: 1,
      description: 'action item 1',
      done: true,
    },
    {
      id: 2,
      description: 'action item 2',
      done: false,
    },
    {
      id: 3,
      description: 'action item 3',
      archived_at: '2016-07-19T00:00:00.000Z',
      done: true,
    },
  ],
};
describe('RetroActionsColumnItem', () => {
  beforeEach(() => {
    ReactDOM.render(<RetroActionsColumnItem retroId={retroId} retro={retro} action_item={retro.action_items[0]}/>, root);
  });

  describe('when retro has action items', () => {
    it('should render each item', () => {
      expect('.retro-action .action-text').toContainText('action item 1');
    });
  });

  describe('when action item is done', () => {
    it('should be checked', () => {
      expect('.action-tick .action-tick-checked').toExist();
    });
  });

  describe('when clicking on tick ', () => {
    it('should mark as not done when clicking on the action item which is ticked', () => {
      $('.retro-action .action-tick').simulate('click');
      expect('doneRetroActionItem').toHaveBeenDispatchedWith({
        type: 'doneRetroActionItem',
        data: {retro_id: retroId, action_item_id: 1, done: false},
      });
    });
  });

  describe('when clicking on edit ', () => {
    beforeEach(() => {
      $('.retro-action .action-edit').simulate('click');
    });

    it('should display the edit view', () => {
      expect('.edit-content').toExist();
    });

    describe('when typing in the text field ', () => {
      const sharedUpdateActionBehavior = () => {
        it('updates the action item', () => {
          expect('.retro-action.retro-action-edit').not.toExist();
          expect('editRetroActionItem').toHaveBeenDispatchedWith(
            {
              type: 'editRetroActionItem',
              data: {retro_id: retroId, action_item_id: 1, description: 'some other value'},
            },
          );
        });
      };

      describe('when save button is clicked', () => {
        beforeEach(() => {
          $('.retro-action textarea').val('some other value').simulate('change');
          $('.retro-action .edit-save').simulate('click');
        });

        sharedUpdateActionBehavior();
      });

      describe('when enter key is pressed', () => {
        beforeEach(() => {
          $('.retro-action textarea').val('some other value').simulate('change');
          $('.retro-action textarea').simulate('keyPress', {key: 'Enter'});
        });

        sharedUpdateActionBehavior();
      });

      it('does not allow editing if value is empty', () => {
        $('.retro-action textarea').val('').simulate('change');
        $('.retro-action .edit-save').simulate('click');
        expect('editRetroActionItem').not.toHaveBeenDispatched();
      });
    });

    describe('when clicking on delete ', () => {
      it('should remove the action item', () => {
        $('.retro-action .edit-delete').simulate('click');
        expect('deleteRetroActionItem').toHaveBeenDispatchedWith({
          type: 'deleteRetroActionItem',
          data: {retro_id: retroId, action_item: retro.action_items[0]},
        });
      });
    });
  });

  describe('when description is changed upstream', () => {
    // Test that componentWillUpdateProps is triggered
    // See http://stackoverflow.com/a/30616091
    it('updates displayed text value', () => {
      retro.action_items[0].description = 'changed';
      ReactDOM.render(<RetroActionsColumnItem retroId={retroId} retro={retro} action_item={retro.action_items[0]}/>, root);

      expect('.retro-action .action-text').toContainText('changed');
    });
  });

  describe('when action item is not done', () => {
    beforeEach(() => {
      ReactDOM.render(<RetroActionsColumnItem retroId={retroId} retro={retro} action_item={retro.action_items[1]}/>, root);
    });
    it('should not be checked', () => {
      expect('.action-tick .action-tick-unchecked').toExist();
    });
  });

  describe('when archived', () => {
    beforeEach(() => {
      ReactDOM.render(<RetroActionsColumnItem retroId={retroId} retro={retro} action_item={retro.action_items[2]} archives={true}/>, root);
    });
    it('should not have a edit', () => {
      expect('.action-edit').toHaveLength(0);
    });
  });
});
