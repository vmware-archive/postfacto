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

import RetroMenu from './retro_menu';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ReactDOM from 'react-dom';
import '../spec_helper';

describe('RetroMenu', () => {
  let testCallback;

  beforeEach(() => {
    testCallback = jasmine.createSpy('testCallback');
    let menuItems = [
      {
        title: 'Menu Item 1', callback: testCallback
      },
      {
        title: 'Menu Item 2', callback: () => {}
      },
      {
        title: 'Menu Item 3', callback: () => {}, button: true
      },
    ];
    ReactDOM.render(<MuiThemeProvider><RetroMenu isMobile={false} items={menuItems}/></MuiThemeProvider>, root);
  });

  describe('within retro menu', () => {
    it('has the menu items', () => {
      $('.retro-menu button').simulate('click');
      expect('.retro-menu-item').toHaveLength(3);
      expect($('.retro-menu-item')[0]).toContainText('Menu Item 1');
      expect($('.retro-menu-item')[1]).toContainText('Menu Item 2');
      expect($('.retro-menu-item')[2]).toContainText('Menu Item 3');
    });

    it('invokes the callback on click of menu item', function () {
      $('.retro-menu button').simulate('click');
      $('.retro-menu-item').simulate('click');
      expect(testCallback).toHaveBeenCalled();
    });

    describe('when button is set to true', () => {
      it('displays the menu item as a button', () => {
        $('.retro-menu button').simulate('click');
        expect($('button.retro-menu-item').length).toEqual(1);
      });
    });
  });
});
