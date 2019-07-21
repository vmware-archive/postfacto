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

import ArchiveMiddleware from './archive_retro_middleware';
import {completedRetroItem} from '../actions/analytics_actions';

describe('ArchiveMiddleware', () => {
  beforeEach(() => {
  });

  it('calls next with action if action type not recognised', () => {
    const doneAction = {
      type: 'OTHER',
    };

    const next = jest.fn();
    const store = {dispatch: jest.fn()};
    const actionDispatcher = jest.fn();
    ArchiveMiddleware(actionDispatcher)(store)(next)(doneAction);

    expect(next).toHaveBeenCalledWith(doneAction);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('fires SHOW_DIALOG before CURRENT_RETRO_ITEM_DONE_UPDATED if all items are done', () => {
    const existingItem = {id: 2, category: 'happy', done: false};
    const retro = {
      name: 'retro1',
      id: 5,
      video_link: 'video',
      items: [{id: 1, category: 'happy', done: true}, existingItem],
      action_items: [{}],
      is_private: true,
      send_archive_email: false,
      highlighted_item_id: 2,
    };

    const store = {
      getState: () => ({retro: {currentRetro: retro}}),
      dispatch: jest.fn(),
    };

    const doneAction = {
      type: 'CURRENT_RETRO_ITEM_DONE_UPDATED',
      payload: {itemId: 2, done: true},
    };

    const next = jest.fn();
    const actionDispatcher = {completedRetroItemAnalytics: jest.fn()};
    ArchiveMiddleware(actionDispatcher)(store)(next)(doneAction);

    expect(next).toHaveBeenCalledWith(doneAction);
    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'SHOW_DIALOG',
      payload: {
        title: 'Archive this retro?',
        message: 'The board will be cleared ready for your next retro and incomplete action items will be carried across.',
      },
    });
  });

  it('does not fire SHOW_DIALOG if all items are not done', () => {
    const existingItem = {id: 2, category: 'happy', done: false};
    const retro = {
      name: 'retro1',
      id: 5,
      video_link: 'video',
      items: [{id: 1, category: 'happy', done: false}, existingItem],
      action_items: [{}],
      is_private: true,
      send_archive_email: false,
      highlighted_item_id: 2,
    };

    const store = {
      getState: () => ({retro: {currentRetro: retro}}),
      dispatch: jest.fn(),
    };

    const doneAction = {
      type: 'CURRENT_RETRO_ITEM_DONE_UPDATED',
      payload: {itemId: 2, done: true},
    };

    const next = jest.fn();
    ArchiveMiddleware()(store)(next)(doneAction);

    expect(next).toHaveBeenCalledWith(doneAction);
    expect(store.dispatch).toHaveBeenCalledWith(completedRetroItem(5, 'happy'));
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('does not fire SHOW_DIALOG if the updating item is not done', () => {
    const existingItem = {id: 2, category: 'happy', done: false};
    const retro = {
      name: 'retro1',
      id: 5,
      video_link: 'video',
      items: [{id: 1, category: 'happy', done: true}, existingItem],
      action_items: [{}],
      is_private: true,
      send_archive_email: false,
      highlighted_item_id: 2,
    };

    const store = {
      getState: () => ({retro: {currentRetro: retro}}),
      dispatch: jest.fn(),
    };

    const doneAction = {
      type: 'CURRENT_RETRO_ITEM_DONE_UPDATED',
      payload: {itemId: 2, done: false},
    };

    const next = jest.fn();
    ArchiveMiddleware()(store)(next)(doneAction);

    expect(next).toHaveBeenCalledWith(doneAction);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('Fires analytics event when item done', () => {
    const existingItem = {id: 2, category: 'happy', done: true};
    const retro = {
      name: 'retro1',
      id: 5,
      video_link: 'video',
      items: [{id: 1, category: 'happy', done: false}, existingItem],
      action_items: [{}],
      is_private: true,
      send_archive_email: false,
      highlighted_item_id: 2,
    };

    const store = {
      getState: () => ({retro: {currentRetro: retro}}),
      dispatch: jest.fn(),
    };

    const doneAction = {
      type: 'CURRENT_RETRO_ITEM_DONE_UPDATED',
      payload: {itemId: 2, done: true},
    };

    const next = jest.fn();
    ArchiveMiddleware()(store)(next)(doneAction);

    expect(store.dispatch).toHaveBeenCalledWith(completedRetroItem(5, 'happy'));
  });
  it('Does not fires analytics event when item is undone', () => {
    const existingItem = {id: 2, category: 'happy', done: true};
    const retro = {
      name: 'retro1',
      id: 5,
      video_link: 'video',
      items: [{id: 1, category: 'happy', done: false}, existingItem],
      action_items: [{}],
      is_private: true,
      send_archive_email: false,
      highlighted_item_id: 2,
    };

    const store = {
      getState: () => ({retro: {currentRetro: retro}}),
      dispatch: jest.fn(),
    };

    const doneAction = {
      type: 'CURRENT_RETRO_ITEM_DONE_UPDATED',
      payload: {itemId: 2, done: false},
    };

    const next = jest.fn();
    const actionDispatcher = {completedRetroItemAnalytics: jest.fn()};
    ArchiveMiddleware(actionDispatcher)(store)(next)(doneAction);

    expect(actionDispatcher.completedRetroItemAnalytics).not.toHaveBeenCalled();
  });
});
