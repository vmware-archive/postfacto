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

require('../spec_helper');

const {fetchJson} = require('../../../helpers/fetch_helper');

describe('fetchJson', () => {
  describe('errors', () => {
    it('returns empty array', () => {
      spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('some error')));
      fetchJson('http://example.com/some-url')
        .then((results) => {
          expect(results).toEqual([]);
        });

      MockPromises.tickAllTheWay();
    });

    it('dispatches apiServerNotFound', () => {
      spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('some error')));
      fetchJson('http://example.com/some-url');
      MockPromises.tickAllTheWay();
      expect('apiServerNotFound').toHaveBeenDispatched();
    });
  });

  describe('HTTP 204 no content', () => {
    it('returns the status code and empty response string', () => {
      fetchJson('http://example.com/some-url')
        .then((results) => {
          expect(results).toEqual([204, '']);
        });

      const request = jasmine.Ajax.requests.mostRecent();
      request.noContent();
      MockPromises.tickAllTheWay();
    });

    it('does not dispatch apiServerNotFound', () => {
      fetchJson('http://example.com/some-url');
      const request = jasmine.Ajax.requests.mostRecent();
      request.noContent();
      MockPromises.tickAllTheWay();
      expect('apiServerNotFound').not.toHaveBeenDispatched();
    });
  });

});
