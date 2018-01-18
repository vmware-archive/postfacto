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

const Url = require('url');
const Qs = require('qs');

let routes = {};

let OldRouter;
let RouterContainer;

const MockRouter = function() {
  return MockRouter;
};

function getParamsFromRoute(route, routeName) {
  const valueRegex = new RegExp('^' + routeName.replace(/\/:[^\/]*/g, '/([^\/]*)') + '$');
  const keys = (routeName.match(/:([^\/]*)/g) || []).map(key => key.replace(':', ''));
  let matches = route.match(valueRegex) || [];
  return {keys, matches};
}

function zip(keys, values) {
  return keys.reduce((memo, key, i) => {
    memo[key] = values[i];
    return memo;
  }, {});
}

Object.assign(MockRouter, {
  install(_RouterContainer) {
    RouterContainer = _RouterContainer;
    OldRouter = RouterContainer.Router;
    RouterContainer.Router = MockRouter;
  },

  uninstall() {
    RouterContainer.Router = OldRouter;
  },

  get(route, callback) {
    routes[route] = callback;
  },

  navigate: jasmine.createSpy('navigate').and.callFake(function(route) {
    const url = Url.parse(route);
    const queryParams = url.query ? Qs.parse(url.query) : {};
    const newRoute = Url.format({...url, query: null, search: null});

    const routedWithId = Object.keys(routes).find(function(routeName){
      let {keys, matches} = getParamsFromRoute(newRoute, routeName);
      if (matches.length > 1) {
        matches = matches.slice(1);
        const req = {params: {...queryParams, ...zip(keys, matches)}};
        routes[routeName](req);
        return true;
      }
    });
    if(!routedWithId) routes[newRoute]({params: {...queryParams}});
  })
});

module.exports = MockRouter;
