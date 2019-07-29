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
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {invokeMenuOption} from '../../test_support/retro_menu_getters';
import '../../spec_helper';

import {ShowRetroPage} from './show_retro_page';

const config = {
  title: 'Retro',
  api_base_url: 'https://example.com',
  websocket_url: 'ws://websocket/url',
  contact: '',
  terms: '',
  privacy: '',
};

describe('Retro settings', () => {
  let dom;
  let routeToRetroSettings;
  let requireRetroLogin;

  beforeEach(() => {
    global.localStorage.clear();
    const retro = {
      id: 13,
      name: 'the retro name',
      video_link: 'http://the/video/link',
      items: [],
      action_items: [],
    };

    window.localStorage.setItem('authToken', 'some-token');

    routeToRetroSettings = jest.fn();
    requireRetroLogin = jest.fn();
    dom = mount((
      <MuiThemeProvider>
        <ShowRetroPage
          retro={retro}
          retroId="13"
          archives={false}
          config={config}
          featureFlags={{archiveEmails: true}}
          environment={{isMobile640: false}}
          getRetro={jest.fn()}
          routeToRetroSettings={routeToRetroSettings}
          requireRetroLogin={requireRetroLogin}
          getRetroArchive={jest.fn()}
          nextRetroItem={jest.fn()}
          archiveRetro={jest.fn()}
          hideDialog={jest.fn()}
          toggleSendArchiveEmail={jest.fn()}
          routeToRetroArchives={jest.fn()}
          showDialog={jest.fn()}
          signOut={jest.fn()}
        />
      </MuiThemeProvider>
    ));
  });

  describe('retro settings menu item', () => {
    it('redirects to retro settings page if logged in', () => {
      window.localStorage.setItem('apiToken-13', 'some-token');

      invokeMenuOption(dom, 'Retro settings');

      expect(routeToRetroSettings).toHaveBeenCalledWith('13');
    });

    it('redirects to retro login page if not logged in', () => {
      invokeMenuOption(dom, 'Retro settings');

      expect(requireRetroLogin).toHaveBeenCalledWith('13');
    });
  });
});
