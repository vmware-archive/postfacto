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

// This file exists for backwards compatibility with old tests.
// Do not use it for new tests!

import {toHaveBeenRequestedWith} from 'pivotal-js-jasmine-matchers/lib/matchers/request_matchers';
// Make jasmine-ajax work with Jest (https://github.com/jasmine/jasmine-ajax/issues/178)
import JasmineCore from 'jasmine-core';

global.getJasmineRequireObj = () => JasmineCore;
import('jasmine-ajax');

Object.assign(XMLHttpRequest.prototype, {
  succeed(data = {}, options = {}) {
    this.respondWith(Object.assign({status: 200, responseText: data ? JSON.stringify(data) : '{}'}, options));
  },
  fail(data, options = {}) {
    this.respondWith(Object.assign({status: 400, responseText: JSON.stringify(data)}, options));
  },
  forbidden(data, options = {}) {
    this.respondWith(Object.assign({status: 403, responseText: data ? JSON.stringify(data) : '{}'}, options));
  },
  notFound() {
    this.respondWith(Object.assign({status: 404, responseText: '{}'}));
  },
  noContent() {
    this.respondWith(Object.assign({status: 204, responseText: ''}));
  },
});

// Wrap pivotal-js-jasmine-matchers to work with Jest

const jasmineToHaveBeenRequestedWith = toHaveBeenRequestedWith().compare;

expect.extend({
  toHaveBeenRequestedWith(url, options) {
    global.jasmine.matchersUtil = {
      equals: (a, b) => this.equals(a, b),
    };
    const {pass, message} = jasmineToHaveBeenRequestedWith(url, options);
    return {
      pass,
      message: () => message,
    };
  },
});
