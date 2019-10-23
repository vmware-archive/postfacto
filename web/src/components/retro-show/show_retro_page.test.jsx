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
import Dialog from 'material-ui/Dialog';
import '../../spec_helper';

import {ShowRetroPage} from './show_retro_page';
import RetroWebsocket from './retro_websocket';

const config = {
  title: 'Retro',
  api_base_url: 'https://example.com',
  websocket_port: 1234,
  websocket_url: 'ws://websocket/url',
  contact: '',
  terms: '',
  privacy: '',
};

function createRetro(isPrivate = false) {
  return {
    id: 13,
    name: 'the retro name',
    is_private: isPrivate,
    video_link: 'http://the/video/link',
    send_archive_email: false,
    items: [
      {
        id: 1,
        description: 'the happy retro item',
        category: 'happy',
      },
      {
        id: 2,
        description: 'the meh retro item',
        category: 'meh',
      },
      {
        id: 3,
        description: 'the sad retro item',
        category: 'sad',
      },
    ],
    action_items: [],
  };
}

function UnconnectedShowRetroPage(props) {
  return (
    <ShowRetroPage
      getRetro={jest.fn()}
      nextRetroItem={jest.fn()}
      archiveRetro={jest.fn()}
      hideDialog={jest.fn()}
      getRetroArchive={jest.fn()}
      toggleSendArchiveEmail={jest.fn()}
      routeToRetroArchives={jest.fn()}
      routeToRetroSettings={jest.fn()}
      requireRetroLogin={jest.fn()}
      showDialog={jest.fn()}
      signOut={jest.fn()}
      {...props}
    />
  );
}

describe('ShowRetroPage', () => {
  let environment;

  beforeEach(() => {
    environment = {isMobile640: false};
  });

  describe('private retro', () => {
    const retro = createRetro(true);

    it('does not show the privacy and terms banner on mobile', () => {
      environment.isMobile640 = true;

      const dom = mount((
        <MuiThemeProvider>
          <UnconnectedShowRetroPage
            retro={retro}
            retroId="13"
            archives={false}
            config={config}
            featureFlags={{archiveEmails: true}}
            environment={environment}
          />
        </MuiThemeProvider>
      ));

      expect(dom.find('.banner')).not.toExist();
    });

    it('does not show the privacy and terms banner on desktop', () => {
      environment.isMobile640 = false;

      const dom = mount((
        <MuiThemeProvider>
          <UnconnectedShowRetroPage
            retro={retro}
            retroId="13"
            archives={false}
            config={config}
            featureFlags={{archiveEmails: true}}
            environment={environment}
          />
        </MuiThemeProvider>
      ));

      expect(dom.find('.banner')).not.toExist();
    });
  });

  describe('on desktop', () => {
    let retro;
    let dom;

    beforeEach(() => {
      environment.isMobile640 = false;
      retro = createRetro();

      dom = mount((
        <MuiThemeProvider>
          <UnconnectedShowRetroPage
            retro={retro}
            retroId="13"
            archives={false}
            config={config}
            featureFlags={{archiveEmails: true}}
            environment={environment}
          />
        </MuiThemeProvider>
      ));
    });

    it('displays title', () => {
      expect(dom.find('.retro-name')).toIncludeText('the retro name');
    });

    it('displays columns', () => {
      const happy = dom.find('.column-happy');
      expect(happy.find('.item-text').at(0)).toIncludeText('the happy retro item');
      expect(happy.find('textarea')).toHaveProp({placeholder: 'I\'m glad that...'});

      const meh = dom.find('.column-meh');
      expect(meh.find('.item-text').at(0)).toIncludeText('the meh retro item');
      expect(meh.find('textarea')).toHaveProp({placeholder: 'I\'m wondering about...'});

      const sad = dom.find('.column-sad');
      expect(sad.find('.item-text').at(0)).toIncludeText('the sad retro item');
      expect(sad.find('textarea')).toHaveProp({placeholder: 'It wasn\'t so great that...'});
    });

    it('displays a menu', () => {
      expect(dom.find('.retro-menu')).toIncludeText('MENU');
    });

    it('does not display a back button', () => {
      expect(dom.find('.retro-back')).not.toExist();
    });

    it('displays a dialog if requested', () => {
      dom = mount((
        <MuiThemeProvider>
          <UnconnectedShowRetroPage
            retro={retro}
            retroId="13"
            archives={false}
            config={config}
            dialog={{
              title: 'Some dialog title',
              message: 'Some dialog message',
            }}
            featureFlags={{archiveEmails: true}}
            environment={environment}
          />
        </MuiThemeProvider>
      ));
      const dialog = dom.find(Dialog);

      expect(dialog).toHaveProp({open: true});
      expect(dialog).toHaveProp({title: 'Some dialog title'});

      // Dialog renders outside usual flow, so must use hacks:
      const popupDialog = document.getElementsByClassName('archive-dialog')[0];

      expect(popupDialog.querySelector('h3').innerHTML).toEqual('Some dialog title');
      expect(popupDialog.querySelector('p').innerHTML).toEqual('Some dialog message');
      expect(popupDialog.querySelector('div label').innerHTML).toEqual('Send action items to the team via email?');
    });

    it('hides the dialog when requested', () => {
      const hideDialog = jest.fn();
      dom = mount((
        <MuiThemeProvider>
          <UnconnectedShowRetroPage
            retro={retro}
            retroId="13"
            archives={false}
            config={config}
            dialog={{
              title: 'Some dialog title',
              message: 'Some dialog message',
            }}
            featureFlags={{archiveEmails: true}}
            environment={environment}
            hideDialog={hideDialog}
          />
        </MuiThemeProvider>
      ));
      const dialog = dom.find(Dialog);

      dialog.props().onRequestClose();
      expect(hideDialog).toHaveBeenCalled();
    });

    it('does not display a dialog by default', () => {
      expect(dom.find(Dialog)).toHaveProp({open: false});
    });

    it('passes the retro URL to RetroWebsocket', () => {
      expect(dom.find(RetroWebsocket).prop('url')).toBe('ws://websocket:1234/url');
    });
  });

  describe('on mobile', () => {
    let retro;
    let dom;

    beforeEach(() => {
      environment.isMobile640 = true;
      retro = createRetro();

      dom = mount((
        <MuiThemeProvider>
          <UnconnectedShowRetroPage
            retro={retro}
            retroId="13"
            archives={false}
            config={config}
            featureFlags={{archiveEmails: true}}
            environment={environment}
          />
        </MuiThemeProvider>
      ));
    });

    it('displays title', () => {
      expect(dom.find('.retro-name')).toIncludeText('the retro name');
    });

    it('displays tabs', () => {
      expect(dom.find('.mobile-tab-happy')).toIncludeText('Happy');
      expect(dom.find('.mobile-tab-meh')).toIncludeText('Meh');
      expect(dom.find('.mobile-tab-sad')).toIncludeText('Sad');
      expect(dom.find('.mobile-tab-action')).toIncludeText('Action');
      expect(dom.find('.retro-item-list-header')).not.toExist();
    });

    it('displays the happy tab by default', () => {
      expect(dom.find('.column-happy .item-text').at(0)).toIncludeText('the happy retro item');
      expect(dom.find('.column-happy textarea')).toHaveProp({placeholder: 'I\'m glad that...'});
    });

    it('displays a menu with a mobile class name', () => {
      expect(dom.find('.retro-menu-mobile')).toIncludeText('MENU');
    });

    it('does not display a back button', () => {
      expect(dom.find('.retro-back')).not.toExist();
    });

    it('passes the retro URL to RetroWebsocket', () => {
      expect(dom.find(RetroWebsocket).prop('url')).toBe('ws://websocket:1234/url');
    });
  });
});
