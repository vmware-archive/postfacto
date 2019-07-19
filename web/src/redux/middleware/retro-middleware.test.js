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

import PromiseMock from 'promise-mock';
import RetroMiddleware from './retro-middleware';
import MockFetch from '../../test_support/fetch_matchers';
import {retrosUpdated, signOut} from '../../dispatchers/redux-action-dispatcher';
import RetroClient from '../../api/retro_client';

describe('RetroMiddleware', () => {
  const client = new RetroClient(() => 'https://example.com', () => 'the-auth-token');

  beforeEach(() => {
    PromiseMock.install();
    MockFetch.install();
  });

  afterEach(() => {
    PromiseMock.uninstall();
    MockFetch.uninstall();
  });

  it('calls next with action if action type not recognised', () => {
    const action = {
      type: 'OTHER',
    };

    const next = jest.fn();
    const store = {dispatch: jest.fn()};
    RetroMiddleware(client)(store)(next)(action);

    expect(next).toHaveBeenCalledWith(action);
  });

  describe('getRetros', () => {
    let store;
    beforeEach(() => {
      const action = {
        type: 'GET_RETROS',
      };

      const next = jest.fn();
      store = {dispatch: jest.fn()};
      RetroMiddleware(client)(store)(next)(action);
    });

    it('makes an API GET to /retros', () => {
      expect(MockFetch).toHaveRequested('/retros', {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'x-auth-token': 'the-auth-token',
        },
      });

      const retros = [{id: 1}];

      const request = MockFetch.latestRequest();
      request.ok({retros});

      Promise.runAll();
      expect(store.dispatch).toHaveBeenCalledWith(retrosUpdated(retros));
    });

    describe('when forbidden is received', () => {
      it('dispatches signOut', () => {
        const request = MockFetch.latestRequest();
        request.forbidden();
        Promise.runAll();
        expect(store.dispatch).toHaveBeenCalledWith(signOut());
      });
    });
  });
});
