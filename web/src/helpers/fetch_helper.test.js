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

import {Dispatcher} from 'p-flux';
import fetchJson from './fetch_helper';
import '../spec_helper';

describe('fetchJson', () => {
  describe('errors', () => {
    beforeEach(() => {
      jest.spyOn(window, 'fetch').mockRejectedValue(new Error('some error'));
    });

    it('returns empty array', async () => {
      const results = await fetchJson('http://example.com/some-url');
      expect(results).toEqual([]);
    });

    it('dispatches apiServerNotFound', async () => {
      await fetchJson('http://example.com/some-url');
      expect(Dispatcher).toHaveReceived('apiServerNotFound');
    });
  });

  describe('HTTP 204 no content', () => {
    beforeEach(() => {
      jest.spyOn(window, 'fetch').mockResolvedValue({status: 204, json: () => Promise.resolve('ignored content')});
    });

    it('returns the status code and empty response string', async () => {
      const results = await fetchJson('http://example.com/some-url');
      expect(results).toEqual([204, '']);
    });

    it('does not dispatch apiServerNotFound', async () => {
      await fetchJson('http://example.com/some-url');
      expect(Dispatcher).not.toHaveReceived('apiServerNotFound');
    });
  });
});
