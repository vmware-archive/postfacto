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
      dialog: null,
      alert: null,
      not_found: {
        retro_not_found: false,
        not_found: false,
        api_server_not_found: false,
      },
    });
  });

  describe('errors', () => {
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

  describe('dialog', () => {
    describe('SHOW_DIALOG', () => {
      it('sets the dialog state', () => {
        const dialog = {
          message: 'hi',
        };

        const action = {
          type: 'SHOW_DIALOG',
          payload: dialog,
        };

        const state = messageReducer(undefined, action);

        expect(state.dialog).toEqual(dialog);
      });
    });

    describe('CLEAR_DIALOG', () => {
      it('clears the dialog', () => {
        const state = {
          dialog: {
            message: 'hi',
          },
        };

        const action = {
          type: 'CLEAR_DIALOG',
        };

        const updatedState = messageReducer(state, action);

        expect(updatedState.dialog).toEqual(null);
      });
    });
  });

  describe('alert', () => {
    describe('SHOW_ALERT', () => {
      it('sets the alert state', () => {
        const alert = {
          message: 'hi',
        };

        const action = {
          type: 'SHOW_ALERT',
          payload: alert,
        };

        const state = messageReducer(undefined, action);

        expect(state.alert).toEqual(alert);
      });
    });

    describe('CLEAR_ALERT', () => {
      it('clears the alert', () => {
        const state = {
          alert: {
            message: 'hi',
          },
        };

        const action = {
          type: 'CLEAR_ALERT',
        };

        const updatedState = messageReducer(state, action);

        expect(updatedState.alert).toEqual(null);
      });
    });
  });

  describe('not found', () => {
    describe('SET_NOT_FOUND', () => {
      it('clears the alert', () => {
        const state = {
          not_found: {
            retro_not_found: false,
          },
        };

        const action = {
          type: 'SET_NOT_FOUND',
          payload: {retro_not_found: true},
        };

        const updatedState = messageReducer(state, action);

        expect(updatedState.not_found).toEqual({retro_not_found: true});
      });
    });
  });
});
