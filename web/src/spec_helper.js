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

import 'jasmine_dom_matchers';
import './test_support/dispatcher_matchers';
import './test_support/react_helper';
import {Dispatcher} from 'p-flux';
import jQuery from 'jquery';
import ReactDOM from 'react-dom';
import Application from './components/Application'; // Load dispatchers (sets global state in p-flux Actions)

global.$ = jQuery;

export const SpyDispatcher = Dispatcher;

export function combineElementsContent(className) {
  let message = '';
  $(className).each((i, e) => {
    message += e.textContent;
  });
  return message;
}

jest.useFakeTimers();

beforeEach(() => {
  global.Retro = {config: {title: 'Retro', api_base_url: 'https://example.com', websocket_url: 'ws://websocket/url'}};

  global.root = jQuery('<div id="root"></div>').get(0);
  jQuery('body')
    .find('#root')
    .remove()
    .end()
    .append(global.root);

  Application.reset(); // set global state such as p-flux.Actions

  // Capture original dispatch so that we can selectively call it later
  const nonFakeDispatch = Dispatcher.dispatch.bind(Dispatcher);
  spyOn(Dispatcher, 'dispatch');
  Dispatcher.nonFakeDispatch = nonFakeDispatch;

  global.localStorage.clear();

  jest.clearAllTimers();
});

afterEach(() => {
  ReactDOM.unmountComponentAtNode(global.root);
  Dispatcher.reset();
});
