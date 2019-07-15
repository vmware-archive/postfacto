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

import '../spec_helper';
import RetroReducer from './retro-reducer';

describe('RetroReducer', () => {
  let actionDispatcher;
  let retroReducer;
  beforeEach(() => {
    actionDispatcher = {
      showDialog: jest.fn(),
      completedRetroItemAnalytics: jest.fn(),
    };
    retroReducer = RetroReducer(actionDispatcher);
  });

  it('sets initial state', () => {
    const state = retroReducer(undefined, {});

    expect(state).toEqual({
      currentRetro: {
        name: '',
        video_link: '',
        items: [],
        action_items: [],
        is_private: false,
        send_archive_email: true,
      },
    });
  });

  describe('RETRO_UPDATED', () => {
    it('replaces the current retro', () => {
      const retro = {
        name: 'retro1',
        video_link: 'video',
        items: [{}],
        action_items: [{}],
        is_private: true,
        send_archive_email: false,
      };

      const action = {
        type: 'RETRO_UPDATED',
        payload: retro,
      };

      const state = retroReducer(undefined, action);

      expect(state).toEqual({
        currentRetro: retro,
      });
    });
  });

  describe('RETRO_SEND_ARCHIVE_EMAIL_UPDATED', () => {
    it('updates send_archive_email the current retro', () => {
      const retro = {
        name: 'retro1',
        video_link: 'video',
        items: [{}],
        action_items: [{}],
        is_private: true,
        send_archive_email: false,
      };

      const action = {
        type: 'RETRO_SEND_ARCHIVE_EMAIL_UPDATED',
        payload: true,
      };

      const state = retroReducer(retro, action);

      expect(state.currentRetro.send_archive_email).toEqual(true);
    });
  });


  describe('RETRO_HIGHLIGHT_CLEARED', () => {
    it('clears the current highlighed item', () => {
      const retro = {
        name: 'retro1',
        video_link: 'video',
        items: [{}],
        action_items: [{}],
        is_private: true,
        send_archive_email: false,
        highlighted_item_id: 1,
      };

      const action = {
        type: 'RETRO_HIGHLIGHT_CLEARED',
        payload: retro,
      };

      const state = retroReducer({currentRetro: retro}, action);

      expect(state.currentRetro.highlighted_item_id).toEqual(null);
    });
  });

  describe('RETRO_ITEM_DELETED', () => {
    it('removes item from state', () => {
      const existingItem = {id: 2, category: 'happy', done: false};
      const retro = {
        name: 'retro1',
        video_link: 'video',
        items: [existingItem],
        action_items: [{}],
        is_private: true,
        send_archive_email: false,
        highlighted_item_id: 2,
      };

      const action = {
        type: 'RETRO_ITEM_DELETED',
        payload: existingItem,
      };

      const state = retroReducer({currentRetro: retro}, action);
      expect(state.currentRetro.items).toHaveLength(0);
    });
  });

  describe('RETRO_ITEM_UPDATED', () => {
    it('Adds a new item if if has a unique ID', () => {
      const existingItem = {id: 2, category: 'happy'};
      const retro = {
        name: 'retro1',
        video_link: 'video',
        items: [existingItem],
        action_items: [{}],
        is_private: true,
        send_archive_email: false,
      };

      const uniqueItem = {id: 3, category: 'happy'};
      const uniqueAction = {
        type: 'RETRO_ITEM_UPDATED',
        payload: uniqueItem,
      };

      const state = retroReducer({currentRetro: retro}, uniqueAction);
      expect(state.currentRetro.name).toEqual('retro1');
      expect(state.currentRetro.items).toHaveLength(2);
      expect(state.currentRetro.items).toEqual([existingItem, uniqueItem]);
    });

    it('Updates existing item if there is already on with that ID', () => {
      const existingItem = {item: {id: 2, category: 'happy'}};
      const retro = {
        name: 'retro1',
        video_link: 'video',
        items: [existingItem],
        action_items: [{}],
        is_private: true,
        send_archive_email: false,
      };

      const uppdatedItem = {item: {id: 2, category: 'meh'}};
      const updatedAction = {
        type: 'RETRO_ITEM_UPDATED',
        payload: uppdatedItem,
      };

      const state = retroReducer({currentRetro: retro}, updatedAction);
      expect(state.currentRetro.name).toEqual('retro1');
      expect(state.currentRetro.items).toHaveLength(1);
      expect(state.currentRetro.items[0]).toEqual(uppdatedItem);
    });

    describe('RETRO_ITEM_DONE_UPDATED', () => {
      it('sets done state of item with id to given value and clears highlighed item id', () => {
        const existingItem = {id: 2, category: 'happy', done: false};
        const retro = {
          name: 'retro1',
          video_link: 'video',
          items: [existingItem],
          action_items: [{}],
          is_private: true,
          send_archive_email: false,
          highlighted_item_id: 2,
        };

        const uniqueAction = {
          type: 'RETRO_ITEM_DONE_UPDATED',
          payload: {itemId: 2, done: true},
        };

        const state = retroReducer({currentRetro: retro}, uniqueAction);
        expect(state.currentRetro.name).toEqual('retro1');
        expect(state.currentRetro.items[0].done).toEqual(true);
        expect(state.currentRetro.highlighted_item_id).toEqual(null);
      });

      it('fires analytics event', () => {
        const existingItem = {id: 2, category: 'happy', done: false};
        const retro = {
          retroId: 5,
          name: 'retro1',
          video_link: 'video',
          items: [existingItem],
          action_items: [{}],
          is_private: true,
          send_archive_email: false,
          highlighted_item_id: 2,
        };

        const doneAction = {
          type: 'RETRO_ITEM_DONE_UPDATED',
          payload: {itemId: 2, done: true},
        };

        retroReducer({currentRetro: retro}, doneAction);

        expect(actionDispatcher.completedRetroItemAnalytics).toHaveBeenCalledWith({
          data: {retroId: 5, category: 'happy'},
        });
      });
    });

    it('fires archive dialog when all items complete', () => {
      const existingItem = {id: 2, category: 'happy', done: false};
      const retro = {
        name: 'retro1',
        video_link: 'video',
        items: [{id: 1, category: 'happy', done: true}, existingItem],
        action_items: [{}],
        is_private: true,
        send_archive_email: false,
        highlighted_item_id: 2,
      };

      const doneAction = {
        type: 'RETRO_ITEM_DONE_UPDATED',
        payload: {itemId: 2, done: true},
      };

      retroReducer({currentRetro: retro}, doneAction);

      expect(actionDispatcher.showDialog).toHaveBeenCalledWith({
        title: 'Archive this retro?',
        message: 'The board will be cleared ready for your next retro and incomplete action items will be carried across.',
      });
    });

    it('fires does not fire archive dialog when not all items complete', () => {
      const existingItem = {id: 2, category: 'happy', done: false};
      const retro = {
        name: 'retro1',
        video_link: 'video',
        items: [{id: 1, category: 'happy', done: false}, existingItem],
        action_items: [{}],
        is_private: true,
        send_archive_email: false,
        highlighted_item_id: 2,
      };

      const doneAction = {
        type: 'RETRO_ITEM_DONE_UPDATED',
        payload: {itemId: 2, done: true},
      };

      retroReducer({currentRetro: retro}, doneAction);

      expect(actionDispatcher.showDialog).not.toHaveBeenCalled();
    });
  });

  describe('RETRO_ACTION_ITEM_UPDATED', () => {
    it('Adds a new item if if has a unique ID', () => {
      const existingActionItem = {id: 1, description: 'description', done: true};
      const retro = {
        name: 'retro1',
        video_link: 'video',
        items: [],
        action_items: [existingActionItem],
        is_private: true,
        send_archive_email: false,
        highlighted_item_id: 2,
      };

      const newActionItem = {id: 2, description: 'new description', done: false};
      const action = {
        type: 'RETRO_ACTION_ITEM_UPDATED',
        payload: newActionItem,
      };

      const state = retroReducer({currentRetro: retro}, action);
      expect(state.currentRetro.name).toEqual('retro1');
      expect(state.currentRetro.action_items).toHaveLength(2);
      expect(state.currentRetro.action_items[0]).toEqual(existingActionItem);
      expect(state.currentRetro.action_items[1]).toEqual(newActionItem);
    });

    it('Updates existing item if there is already on with that ID', () => {
      const existingActionItem = {id: 1, description: 'description', done: true};
      const retro = {
        name: 'retro1',
        video_link: 'video',
        items: [],
        action_items: [existingActionItem],
        is_private: true,
        send_archive_email: false,
        highlighted_item_id: 2,
      };

      const action = {
        type: 'RETRO_ACTION_ITEM_UPDATED',
        payload: {id: 1, description: 'new description', done: false},
      };

      const state = retroReducer({currentRetro: retro}, action);
      expect(state.currentRetro.name).toEqual('retro1');
      expect(state.currentRetro.action_items[0]).toEqual({id: 1, description: 'new description', done: false});
    });
  });

  describe('RETRO_ACTION_ITEM_DELETED', () => {
    it('removes action item from state', () => {
      const existingActionItem = {id: 2, done: false};
      const retro = {
        name: 'retro1',
        video_link: 'video',
        items: [],
        action_items: [existingActionItem],
        is_private: true,
        send_archive_email: false,
        highlighted_item_id: 2,
      };

      const action = {
        type: 'RETRO_ACTION_ITEM_DELETED',
        payload: existingActionItem,
      };

      const state = retroReducer({currentRetro: retro}, action);
      expect(state.currentRetro.action_items).toHaveLength(0);
    });
  });
});
