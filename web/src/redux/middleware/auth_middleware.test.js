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

import AuthMiddleware from './auth_middleware';
import {home, retroRelogin} from '../actions/router_actions';
import {forceRelogin} from '../actions/main_actions';

describe('AuthMiddleware', () => {
  beforeEach(() => {
  });

  it('calls next with action if action type not recognised', () => {
    const action = {
      type: 'OTHER',
    };

    const next = jest.fn();
    const store = {dispatch: jest.fn()};
    AuthMiddleware()(store)(next)(action);

    expect(next).toHaveBeenCalledWith(action);
  });

  describe('SIGN_OUT', () => {
    it('navigates to home and clears local storage', () => {
      const location = '/some/location';
      const doneAction = {
        type: 'SIGN_OUT',
        payload: location,
      };

      const next = jest.fn();
      const store = {dispatch: jest.fn()};
      const localStorage = {clear: jest.fn()};
      AuthMiddleware(localStorage)(store)(next)(doneAction);

      expect(store.dispatch).toHaveBeenCalledWith(home());
      expect(localStorage.clear).toHaveBeenCalled();
    });
  });

  describe('FORCE_RELOGIN', () => {
    it('navigates to login page if current user didnt trigger action requiring relogin', () => {
      const localStorage = {clear: jest.fn()};
      const next = jest.fn();
      const store = {
        dispatch: jest.fn(),
        getState: () => ({
          user: {
            websocketSession: {
              request_uuid: 'user-a',
            },
          },
        }),
      };

      AuthMiddleware(localStorage)(store)(next)(forceRelogin('user-b', 'retro-id'));

      expect(store.dispatch).toHaveBeenCalledWith(retroRelogin('retro-id'));
    });

    it('does not trigger relogin if current user triggered action requiring relogin', () => {
      const localStorage = {clear: jest.fn()};
      const next = jest.fn();
      const store = {
        dispatch: jest.fn(),
        getState: () => ({
          user: {
            websocketSession: {
              request_uuid: 'user-a',
            },
          },
        }),
      };

      AuthMiddleware(localStorage)(store)(next)(forceRelogin('user-a', 'retro-id'));

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});
