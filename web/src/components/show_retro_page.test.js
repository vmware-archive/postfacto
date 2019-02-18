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
import ReactDOM from 'react-dom';
import '../spec_helper';

import ShowRetroPage from './show_retro_page';
import ReactTestUtils from 'react-dom/test-utils';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';

function setWindowToMobileSize() {
  window.innerWidth = 639;
}

function setWindowToDesktopSize() {
  window.innerWidth = 641;
}

describe('ShowRetroPage', () => {
  describe('for a private retro', () => {
    describe('on mobile', () => {
      beforeEach(() => {
        const retro = createRetro(true);

        setWindowToMobileSize();

        ReactDOM.render(<MuiThemeProvider>
          <ShowRetroPage
            retro={retro} retroId="13" archives={false} config={global.Retro.config}
            featureFlags={{archiveEmails: true}}
          />
        </MuiThemeProvider>, root);
      });

      it('does not show the privacy and terms banner', () => {
        expect($('.banner').length).toBe(0);
      });
    });

    describe('on desktop', () => {
      beforeEach(() => {
        const retro = createRetro(true);

        setWindowToDesktopSize();

        ReactDOM.render(<MuiThemeProvider>
          <ShowRetroPage
            retro={retro} retroId="13" archives={false} config={global.Retro.config} isMobile={false}
            featureFlags={{archiveEmails: true}}
          />
        </MuiThemeProvider>, root);
      });

      it('does not show the privacy and terms banner', () => {
        expect($('.banner').length).toBe(0);
      });
    });
  });

  describe('when showing retro items on desktop ', () => {
    let retro;
    let originalGetIsMobile;

    beforeEach(() => {
      retro = createRetro();

      originalGetIsMobile = ShowRetroPage.prototype.getIsMobile;
      ShowRetroPage.prototype.getIsMobile = () => false;

      ReactDOM.render(<MuiThemeProvider>
        <ShowRetroPage
          retro={retro} retroId="13" archives={false} config={global.Retro.config}
          featureFlags={{archiveEmails: true}}
        />
      </MuiThemeProvider>, root);
    });

    afterEach(() => {
      ShowRetroPage.prototype.getIsMobile = originalGetIsMobile;
    });

    it('has title and all its items', () => {
      expect('.retro-name').toContainText('the retro name');
      expect($('.column-happy .item-text')[0]).toContainText('the happy retro item');
      expect($('.column-happy .retro-item-add-input').attr('placeholder')).toEqual('I\'m glad that...');
      expect($('.column-meh .item-text')[0]).toContainText('the meh retro item');
      expect($('.column-meh .retro-item-add-input').attr('placeholder')).toEqual('I\'m wondering about...');
      expect($('.column-sad .item-text')[0]).toContainText('the sad retro item');
      expect($('.column-sad .retro-item-add-input').attr('placeholder')).toEqual('It wasn\'t so great that...');
      expect('.retro-menu').toContainText('MENU');
      expect('.retro-back').toHaveLength(0);
    });

    describe('dialog', () => {
      let container;

      describe('when dialog exists', () => {
        beforeEach(() => {
          container = ReactDOM.render(<MuiThemeProvider>
            <ShowRetroPage
              retro={retro} retroId="13" archives={false} config={global.Retro.config}
              dialog={{
                title: 'Some dialog title',
                message: 'Some dialog message',
              }}
              featureFlags={{archiveEmails: true}}
            />
          </MuiThemeProvider>, root);
        });

        it('opens the dialog and hides it when the cancel button is clicked', () => {
          const dialog = ReactTestUtils.findRenderedComponentWithType(container, Dialog);

          expect(dialog.props.title).toEqual('Some dialog title');
          expect(dialog.props.open).toEqual(true);
          expect($('.archive-dialog h3')[0]).toContainText('Some dialog title');
          expect($('.archive-dialog p')[0]).toContainText('Some dialog message');
          expect($('.archive-dialog div label')[0]).toContainText('Send action items to the team via email?');

          $('.archive-dialog__actions--cancel').simulate('click');

          expect('hideDialog').toHaveBeenDispatched();
        });
      });

      describe('when showDialog is set to false', () => {
        beforeEach(() => {
          container = ReactDOM.render(<MuiThemeProvider>
            <ShowRetroPage
              retro={retro} retroId="13" archives={false} config={global.Retro.config}
              dialog={null} featureFlags={{archiveEmails: true}}
            />
          </MuiThemeProvider>, root);
        });

        it('does not open the archive confirmation dialog', () => {
          const dialog = ReactTestUtils.findRenderedComponentWithType(container, Dialog);

          expect(dialog.props.open).toEqual(false);
        });
      });
    });
  });

  describe('when showing retro items on mobile', () => {
    let retro;
    let originalGetIsMobile;
    beforeEach(() => {
      retro = createRetro();
      originalGetIsMobile = ShowRetroPage.prototype.getIsMobile;
      ShowRetroPage.prototype.getIsMobile = () => true;

      ReactDOM.render(<MuiThemeProvider>
        <ShowRetroPage
          retro={retro} retroId="13" archives={false} config={global.Retro.config}
          featureFlags={{archiveEmails: true}}
        />
      </MuiThemeProvider>, root);
    });
    afterEach(() => {
      ShowRetroPage.prototype.getIsMobile = originalGetIsMobile;
    });

    it('has title and 4 tabs', () => {
      expect('.retro-name').toContainText('the retro name');
      expect('.mobile-tab-happy').toContainText('Happy');
      expect('.mobile-tab-meh').toContainText('Meh');
      expect('.mobile-tab-sad').toContainText('Sad');
      expect('.mobile-tab-action').toContainText('Action');
      expect($('.column-happy .item-text')[0]).toContainText('the happy retro item');
      expect($('.column-happy .retro-item-add-input').attr('placeholder')).toEqual('I\'m glad that...');
      expect('.retro-menu-mobile').toContainText('MENU');
      expect('.retro-back').toHaveLength(0);
      expect('.retro-item-list-header').toHaveLength(0);
    });
  });
});

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
    action_items: [
      {
        id: 1,
        description: 'action item 1',
        done: true,
      },
      {
        id: 2,
        description: 'action item 2',
        done: false,
      },
    ],
  };
}
