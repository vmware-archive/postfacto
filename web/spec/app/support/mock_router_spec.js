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

describe('MockRouter', () => {
  let route1Spy, route2Spy, router;
  beforeEach(() => {
    const {Router} = require('../../../app/components/use_router');
    router = new Router({pushState: true});
    route1Spy = jasmine.createSpy('route1');
    route2Spy = jasmine.createSpy('route2');
    router.get('foo', route1Spy);
    router.get('foo/:bar/:baz', route2Spy);
  });

  describe('#navigate', () => {
    it('works for a route without params', () => {
      router.navigate('foo');
      expect(route1Spy).toHaveBeenCalledWith({params: {}});
    });

    it('works for routes with params', () => {
      router.navigate('foo/abc/456');
      expect(route2Spy).toHaveBeenCalledWith({params: {bar: 'abc', baz: '456'}});
    });

    it('works with query params', () => {
      router.navigate('foo?bar=abc');
      expect(route1Spy).toHaveBeenCalledWith({params: {bar: 'abc'}});
    });

    it('works for routes with params with query params', () => {
      router.navigate('foo/abc/456?name=bob');
      expect(route2Spy).toHaveBeenCalledWith({params: {bar: 'abc', baz: '456', name: 'bob'}});
    });
  });
});
