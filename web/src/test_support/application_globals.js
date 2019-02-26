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
import jestSpyOnAugmented from './jest_spy_augmented';
import Application from '../Application'; // Load dispatchers (sets global state in p-flux Actions)

jest.useFakeTimers();

beforeEach(() => {
  global.Retro = {config: {api_base_url: 'https://example.com', enable_analytics: false}};

  Application.reset(); // set global state such as p-flux.Actions

  jestSpyOnAugmented(Dispatcher, 'dispatch').mockReturnValue(null);

  global.localStorage.clear();
});

afterEach(() => {
  jest.restoreAllMocks();
  Dispatcher.reset();
  jest.clearAllTimers();
  global.localStorage.clear();
});
