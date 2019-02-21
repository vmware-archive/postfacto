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

// Augmentation to jest.spyOn
// Request to add to jest core: https://github.com/facebook/jest/issues/7943

export default function jestSpyOnAugmented(object, field) {
  const original = object[field];
  const mock = jest.spyOn(object, field);

  mock.mockCallThrough = () => mock.mockImplementation(original);
  mock.mockConditionalCallThrough = (condition) => mock.mockImplementation(function check(...args) {
    if (condition.apply(this, args)) {
      original.apply(this, args);
    }
  });

  return mock;
}
