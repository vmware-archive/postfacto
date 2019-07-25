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
import {completedRetroItem} from '../actions/analytics_actions';

const ArchiveMiddleware = () => (store) => (next) => (action) => {
  if (action.type === 'CURRENT_RETRO_ITEM_DONE_UPDATED') {
    const {itemId, done} = action.payload;

    let allDone = false;

    if (done) {
      const currentRetro = store.getState().retro.currentRetro;
      allDone = currentRetro.items
        .filter((item) => item.id !== itemId)
        .every((i) => i.done);

      const item = currentRetro.items.find((i) => i.id === itemId);

      store.dispatch(completedRetroItem(currentRetro.id, item.category));
    }

    if (allDone) {
      store.dispatch({
        type: 'SHOW_DIALOG',
        payload: {
          title: 'Archive this retro?',
          message: 'The board will be cleared ready for your next retro and incomplete action items will be carried across.',
        },
      });
    }
  }
  next(action);
};

export default ArchiveMiddleware;
