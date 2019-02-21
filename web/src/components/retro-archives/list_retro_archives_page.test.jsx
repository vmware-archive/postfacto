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
import {mount, shallow} from 'enzyme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Dispatcher} from 'p-flux';
import '../../spec_helper';

import ListRetroArchivesPage from './list_retro_archives_page';
import RetroMenu from '../shared/retro_menu';

describe('ListRetroArchivesPage', () => {
  const archives = [
    {
      created_at: '2016-09-03T21:48:43+11:00',
      id: 456,
    },
    {
      created_at: '2016-10-28T21:48:43+11:00',
      id: 123,
    },
  ];

  let dom;

  beforeEach(() => {
    window.innerWidth = 1084;
    dom = mount(<MuiThemeProvider><ListRetroArchivesPage retroId="789" archives={archives}/></MuiThemeProvider>);
  });

  it('shows all archived retros', () => {
    const links = dom.find('.archives .archive-link');
    expect(links.at(0)).toIncludeText('28 October 2016');
    expect(links.at(1)).toIncludeText('03 September 2016');
  });

  it('shows the footer', () => {
    expect(dom.find('.footer')).toExist();
  });

  it('returns to the current retro page when back is clicked', () => {
    const back = dom.find('button.retro-back');

    expect(back).toIncludeText('Current retro');
    back.simulate('click');

    expect(Dispatcher).toHaveReceived({
      type: 'backPressedFromArchives',
      data: {retro_id: '789'},
    });
  });

  it('navigates to archives when clicked', () => {
    dom.find('.archives .archive-link a').at(0).simulate('click');

    expect(Dispatcher).toHaveReceived({
      type: 'routeToRetroArchive',
      data: {retro_id: '789', archive_id: 123},
    });
  });

  it('shows a sign out menu item if logged in', () => {
    window.localStorage.setItem('authToken', 'some-token');
    dom = shallow(<ListRetroArchivesPage retroId="789" archives={archives}/>);

    const menuItems = dom.find(RetroMenu).props().items;
    expect(menuItems.length).toEqual(1);
    expect(menuItems[0].title).toEqual('Sign out');
  });
});
