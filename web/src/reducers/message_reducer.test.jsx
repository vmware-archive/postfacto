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
import MessageReducer from './message_reducer';

describe('MessageReducer', () => {
  let messageReducer;
  beforeEach(() => {
    messageReducer = MessageReducer();
  });

  it('sets initial state', () => {
    const state = messageReducer(undefined, {});

    expect(state).toEqual({
      errors: {},
    });
  });

  describe('ERRORS_UPDATED', () => {
    it('replaces the error message', () => {
      const error = {
        slug: 'slug in use',
      };

      const action = {
        type: 'ERRORS_UPDATED',
        payload: error,
      };

      const state = messageReducer(undefined, action);

      expect(state.errors).toEqual(error);
    });
  });

  describe('CLEAR_ERRORS', () => {
    it('removes the error message', () => {
      const state = {
        errors: {
          slug: 'slug in use',
        },
      };

      const action = {
        type: 'CLEAR_ERRORS',
      };

      const updatedState = messageReducer(state, action);

      expect(updatedState.errors).toEqual({});
    });
  });
});
