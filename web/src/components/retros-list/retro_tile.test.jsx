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

import React from 'react';
import {mount} from 'enzyme';
import '../../spec_helper';

import RetroTile from './retro_tile';

describe('Retro Tile', () => {
  const retro = {
    name: 'Cool Retro',
    slug: 'cool-retro',
  };

  it('should show a retro name', () => {
    const dom = mount(<RetroTile retro={retro}/>);

    expect(dom.find('.retro-list-tile')).toIncludeText('Cool Retro');
  });

  it('should call the callback when clicked', () => {
    const callbackFn = jest.fn().mockName('callbackFn');

    const dom = mount(<RetroTile retro={retro} callback={callbackFn}/>);
    dom.find('.retro-list-tile').simulate('click');

    expect(callbackFn).toHaveBeenCalled();
  });
});
