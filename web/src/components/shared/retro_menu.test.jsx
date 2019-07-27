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

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RetroMenu from './retro_menu';

function getMenuItemElements() {
  // <Popover> renders separately, so hacks are needed:
  return document.getElementsByClassName('retro-menu-item');
}

describe('RetroMenu', () => {
  let testCallback;
  let dom;

  beforeEach(() => {
    testCallback = jest.fn().mockName('testCallback');

    const menuItems = [
      {
        title: 'Menu Item 1',
        callback: testCallback,
      },
      {
        title: 'Menu Item 2',
        callback: () => {},
      },
      {
        title: 'Menu Item 3',
        callback: () => {},
        button: true,
      },
    ];
    dom = mount(<MuiThemeProvider><RetroMenu isMobile={false} items={menuItems}/></MuiThemeProvider>);
  });

  it('shows the menu items', () => {
    dom.find('.retro-menu button').simulate('click');
    const items = getMenuItemElements();

    expect(items.length).toEqual(3);
    expect(items[0].innerHTML).toMatch(/\bMenu Item 1\b/);
    expect(items[1].innerHTML).toMatch(/\bMenu Item 2\b/);
    expect(items[2].innerHTML).toMatch(/\bMenu Item 3\b/);
  });

  it('invokes the callback on click of menu item', () => {
    dom.find('.retro-menu button').simulate('click');
    const items = getMenuItemElements();

    items[0].click();

    expect(testCallback).toHaveBeenCalled();
  });

  it('displays the menu item as a button if requested', () => {
    dom.find('.retro-menu button').simulate('click');
    const items = getMenuItemElements();

    expect(items[0].tagName.toLowerCase()).not.toEqual('button');
    expect(items[2].tagName.toLowerCase()).toEqual('button');
  });
});
