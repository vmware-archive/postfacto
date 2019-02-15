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

import RetroTile from './retro_tile';
import '../spec_helper';

describe('Retro Tile', () => {
  const retro = {
    name: 'Cool Retro',
    slug: 'cool-retro'
  };

  it('should show a retro name', () => {
    ReactDOM.render(<RetroTile retro={retro}/>, root);
    expect('.retro-list-tile').toContainText('Cool Retro')
  });

  it('should call the callback when clicked', () => {
    const callbackFn = jasmine.createSpy('callbackFn');

    ReactDOM.render(<RetroTile retro={retro} callback={callbackFn}/>, root);
    $('.retro-list-tile').click();
    expect(callbackFn).toHaveBeenCalled();
  });
});
