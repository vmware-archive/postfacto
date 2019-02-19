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

expect.extend({
  toHaveReceived(spyDispatcher, expectedAction) {
    let expectedType;
    let expectedContent;
    if (typeof expectedAction === 'string') {
      expectedType = expectedAction;
      expectedContent = null;
    } else {
      expectedType = expectedAction.type;
      expectedContent = expectedAction;
    }

    const observedActions = spyDispatcher.dispatch.calls.all()
      .map((dispatchCall) => dispatchCall.args[0]);

    if (!observedActions.length) {
      return {
        pass: false,
        message: () => `Expected '${expectedType}' to have been dispatched, but no actions were dispatched`,
      };
    }

    const errorInfo = 'Observed actions:\n' + observedActions
      .map((action) => '  ' + this.utils.printReceived(action))
      .join('\n');

    const matchingActions = observedActions
      .filter(({type}) => (type === expectedType));

    if (!matchingActions.length) {
      return {
        pass: false,
        message: () => `Expected '${expectedType}' to have been dispatched, but it was not. ${errorInfo}`,
      };
    }

    if (expectedContent) {
      if (!matchingActions.some((action) => this.equals(action, expectedContent))) {
        return {
          pass: false,
          message: () => `Expected ${this.utils.printExpected(expectedContent)} to have been dispatched, but it was not. ${errorInfo}`,
        };
      }
    }

    return {
      pass: true,
      message: () => `Expected '${expectedAction}' not to have been dispatched, but it was`,
    };
  },
});
