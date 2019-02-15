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

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ListRetroArchivesPage from './list_retro_archives_page';
import ReactDOM from 'react-dom';
import '../spec_helper';

describe('ListRetroArchivesPage', () => {
  let archives = [
    {
      created_at: '2016-09-03T21:48:43+11:00',
      id: 456,
    },
    {
      created_at: '2016-10-28T21:48:43+11:00',
      id: 123,
    },
  ];

  beforeEach(() => {
    window.innerWidth = 1084;
    ReactDOM.render(<MuiThemeProvider><ListRetroArchivesPage retroId={'789'} archives={archives}/></MuiThemeProvider>, root);
  });

  it('shows all archived retros', () => {
    expect($('.archives .archive-link a')[0].innerHTML).toEqual('28 October 2016');
    expect($('.archives .archive-link a')[1].innerHTML).toEqual('03 September 2016');
  });

  it('shows the footer', () => {
    expect('.footer').toExist();
  });

  describe('when user is signed in', () => {
    beforeEach(() => {
      window.localStorage.setItem('authToken', 'some-token');
      ReactDOM.render(<MuiThemeProvider><ListRetroArchivesPage retroId={'789'} archives={archives}/></MuiThemeProvider>, root);
    });

    afterEach(() => {
      window.localStorage.clear();
    });

    it('should have sign out menu item', () => {
      expect('.retro-menu').toHaveLength(1);
      $('.retro-menu button').simulate('click');
      expect('.retro-menu-item').toContainText('Sign out');
    });
  });

  it('Current retro button links to the current retro page', function () {
    expect('.retro-back').toContainText('Current retro');
    $('.retro-back').simulate('click');
    expect('backPressedFromArchives').toHaveBeenDispatchedWith({
      type: 'backPressedFromArchives',
      data: {retro_id: '789'}
    });
  });

  describe('clicking an archive', () => {
    it('navigates to that archive', () => {
      $($('.archives .archive-link a')[0]).simulate('click');
      expect('routeToRetroArchive').toHaveBeenDispatchedWith({
        type: 'routeToRetroArchive',
        data: {retro_id: '789', archive_id: 123}
      });
    });
  });
});
