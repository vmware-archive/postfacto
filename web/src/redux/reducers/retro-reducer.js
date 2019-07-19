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
const initialState = {
  currentRetro: {
    name: '',
    video_link: '',
    items: [],
    action_items: [],
    is_private: false,
    send_archive_email: true,
  },
  retroArchives: [],
  currentArchivedRetro: {
    name: '',
    video_link: '',
    items: [],
    action_items: [],
    is_private: false,
    send_archive_email: true,
  },
  retros: [],
};

const RetroReducer = () => (state = initialState, action) => {
  if (action.type === 'CURRENT_RETRO_UPDATED') {
    return Object.assign({}, state, {currentRetro: action.payload});
  }

  if (action.type === 'CURRENT_RETRO_SEND_ARCHIVE_EMAIL_UPDATED') {
    return Object.assign({}, state, {currentRetro: {...state.currentRetro, send_archive_email: action.payload}});
  }

  if (action.type === 'CURRENT_RETRO_HIGHLIGHT_CLEARED') {
    return Object.assign({}, state, {currentRetro: {...state.currentRetro, highlighted_item_id: null}});
  }

  if (action.type === 'CURRENT_RETRO_ITEM_DELETED') {
    const item = action.payload;
    const updatedItems = state.currentRetro.items.filter((i) => i.id !== item.id);

    return Object.assign({}, state, {currentRetro: {...state.currentRetro, items: updatedItems}});
  }

  if (action.type === 'CURRENT_RETRO_ITEM_UPDATED') {
    const item = action.payload;
    const existingItems = state.currentRetro.items;

    const position = existingItems.findIndex((i) => i.id === item.id);

    const updatedItems = [].concat(existingItems);
    if (position === -1) {
      updatedItems.push(item);
    } else {
      updatedItems[position] = item;
    }

    return Object.assign({}, state, {currentRetro: {...state.currentRetro, items: updatedItems}});
  }

  if (action.type === 'CURRENT_RETRO_ITEM_DONE_UPDATED') {
    const {itemId, done} = action.payload;
    const existingItems = state.currentRetro.items;

    const position = existingItems.findIndex((i) => i.id === itemId);
    const updatedItems = [].concat(existingItems);
    const item = updatedItems[position];
    item.done = done;

    return Object.assign({}, state, {
      currentRetro: {
        ...state.currentRetro,
        highlighted_item_id: null,
        items: updatedItems,
      },
    });
  }

  if (action.type === 'CURRENT_RETRO_ACTION_ITEM_UPDATED') {
    const actionItem = action.payload;
    const existingActionItems = state.currentRetro.action_items;

    const position = existingActionItems.findIndex((i) => i.id === actionItem.id);

    const updatedItems = [].concat(existingActionItems);
    if (position === -1) {
      updatedItems.push(actionItem);
    } else {
      updatedItems[position] = actionItem;
    }

    return Object.assign({}, state, {currentRetro: {...state.currentRetro, action_items: updatedItems}});
  }

  if (action.type === 'CURRENT_RETRO_ACTION_ITEM_DELETED') {
    const actionItem = action.payload;
    const updatedActionItems = state.currentRetro.action_items.filter((i) => i.id !== actionItem.id);

    return Object.assign({}, state, {currentRetro: {...state.currentRetro, action_items: updatedActionItems}});
  }

  if (action.type === 'RETROS_UPDATED') {
    const retros = action.payload;

    return Object.assign({}, state, {retros});
  }

  if (action.type === 'CURRENT_ARCHIVED_RETRO_UPDATED') {
    return Object.assign({}, state, {currentArchivedRetro: action.payload});
  }

  if (action.type === 'RETRO_ARCHIVES_UPDATED') {
    const retroArchives = action.payload;

    return Object.assign({}, state, {retroArchives});
  }

  return state;
};

export default RetroReducer;
