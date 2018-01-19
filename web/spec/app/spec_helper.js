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

require('babel-polyfill');
require('jasmine-ajax');
require('jasmine_dom_matchers');
require('../support/bluebird');
require('../spec_helper');
require('pivotal-js-jasmine-matchers');
require('./support/dispatcher_matchers');


const factories = require.context('../factories', true, /\.js$/);
factories.keys().forEach(factories);

const Cursor = require('pui-cursor');
const Deferred = require('../support/deferred');
const {Dispatcher} = require('p-flux');
const jQuery = require('jquery');
const MockFetch = require('../support/mock_fetch');
const MockPromises = require('mock-promises');
const MockRouter = require('./support/mock_router');
const React = require('react');
const ReactDOM = require('react-dom');
const UseRouter = require('../../app/components/use_router');

let globals;

MockFetch.install();

beforeAll(() => {
  globals = {
    Deferred,
    Dispatcher,
    jQuery,
    MockPromises,
    Retro: {},
    React,
    ReactDOM,
    $: jQuery,
    ...require('./support/react_helper')
  };
  Object.assign(global, globals);
});

afterAll(() => {
  Object.keys(globals).forEach(key => delete global[key]);
  MockFetch.uninstall();
});

beforeEach(() => {
  global.Retro = {config: {title: 'Retro', api_base_url: 'https://example.com', websocket_url: 'ws://websocket/url'}};

  $('body').find('#root').remove().end().append('<div id="root"/>');
  Cursor.async = false;
  spyOn(require('../../app/bootstrap'), 'init');

  const Application = require('../../app/components/application');
  Application.reset();

  spyOn(Dispatcher, 'dispatch');

  MockPromises.install(Promise);
  MockRouter.install(UseRouter);

  jasmine.clock().install();
  jasmine.Ajax.install();
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
    }
  });

  global.setWindowToMobileSize = () => {
    window.innerWidth = 639;
  };

  global.setWindowToDesktopSize = () => {
    window.innerWidth = 641;
  };
});

afterEach(() => {
  ReactDOM.unmountComponentAtNode(root);
  Dispatcher.reset();
  MockPromises.uninstall();
  MockRouter.uninstall();
  jasmine.clock().uninstall();
  jasmine.Ajax.uninstall();
});
