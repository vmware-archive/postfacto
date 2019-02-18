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

expect.extend({
  toHaveBeenDispatched(actual) {
    const allDispatchers = Dispatcher.dispatch.calls.all()
      .map((dispatchCall) => dispatchCall.args[0].type);
    const pass = allDispatchers.includes(actual);

    let message;
    if (pass) {
      message = `Expected ${actual} not to have been dispatched, but it was`;
    } else {
      message = `Expected ${actual} to have been dispatched, but it was not. \n Actual dispatch calls are ${allDispatchers.join(', ')}`;
    }

    return {pass, message: () => message};
  },

  toHaveBeenDispatchedWith(actual, expected) {
    const observed = Dispatcher.dispatch.calls.all()
      .map((dispatchCall) => dispatchCall.args[0])
      .filter(({type}) => type === actual);

    const pass = observed.some((params) => this.equals(params, expected));

    const filtered = observed.map((o) => this.utils.printReceived(o));

    return {
      pass,
      message: () => `Expected ${actual} to have been dispatched with:\n${this.utils.printExpected(expected)}\nAll dispatches of type ${actual}:\n${filtered.join('\n')}`,
    };
  },
});
