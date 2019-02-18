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

import {MuiThemeProvider} from 'material-ui';
import RetroHeading from './retro_heading';

describe('RetroHeading', () => {
  let retro;

  describe('Back Button', () => {
    describe('when on an archived retro', () => {
      beforeEach(() => {
        retro = createRetro();
        ReactDOM.render(
          <MuiThemeProvider>
            <RetroHeading retro={retro} retroId="13" archives={true} isMobile={false}/>
          </MuiThemeProvider>, root,
        );
      });

      it('shows the back button', () => {
        expect('.retro-back').toExist();
      });
    });

    describe('when not on an archived retro', () => {
      beforeEach(() => {
        retro = createRetro();
        ReactDOM.render(
          <MuiThemeProvider>
            <RetroHeading retro={retro} retroId="13" archives={false} isMobile={false}/>
          </MuiThemeProvider>, root,
        );
      });

      it('does not show the back button', () => {
        expect('.retro-back').not.toExist();
      });
    });
  });

  describe('Menu', () => {
    describe('when a retro has archives', () => {
      describe('when on an archived retro', () => {
        beforeEach(() => {
          retro = createRetro();
          retro.items = [];
          retro.archives = [{id: 1}, {id: 2}, {id: 13}];
          ReactDOM.render(
            <MuiThemeProvider>
              <RetroHeading retro={retro} retroId="13" archives={true} isMobile={false}/>
            </MuiThemeProvider>, root,
          );
          $('.retro-menu button').simulate('click');
        });

        it('does not show the link to archive the retro', () => {
          expect($('.retro-menu-item')[0]).not.toContainText('Archive this retro');
        });

        it('does not show the link to view archives', () => {
          expect($('.retro-menu-item')[0]).not.toContainText('View archives');
        });
      });

      describe('when a retro has no retro items', () => {
        beforeEach(() => {
          retro = createRetro();
          retro.items = [];
          retro.archives = [{id: 1}, {id: 2}];
          ReactDOM.render(
            <MuiThemeProvider>
              <RetroHeading retro={retro} retroId="13" archives={false} isMobile={false}/>
            </MuiThemeProvider>, root,
          );
          $('.retro-menu button').simulate('click');
        });

        it('does not show the link to archive the retro', () => {
          expect($('.retro-menu-item')[0]).not.toContainText('Archive this retro');
        });

        it('shows the link to view archives', () => {
          expect($('.retro-menu-item')[0]).toContainText('View archives');
        });
      });

      describe('when a retro has retro items', () => {
        beforeEach(() => {
          retro = createRetro();
          retro.archives = [{id: 1}, {id: 2}];
          ReactDOM.render(
            <MuiThemeProvider>
              <RetroHeading retro={retro} retroId="13" archives={false} isMobile={false}/>
            </MuiThemeProvider>, root,
          );
          $('.retro-menu button').simulate('click');
        });

        // Uses toEqual as 'Archive this retro' returns a pure string as it is a button which behaves differently
        it('shows the link to archive the retro', () => {
          expect($('.retro-menu-item')[0].innerHTML).toEqual('Archive this retro');
        });

        it('dispatches showDialog when the archive link is clicked', () => {
          $('.retro-menu button').simulate('click');
          $($('.retro-menu-item')[0]).simulate('click');

          expect('showDialog').toHaveBeenDispatchedWith(
            {
              type: 'showDialog',
              data: {
                title: 'You\'re about to archive this retro.',
                message: 'Are you sure?',
              },
            },
          );
        });

        it('shows the link to view archives', () => {
          expect($('.retro-menu-item')[1]).toHaveText('View archives');
        });
      });

    });

    describe('when a retro has no archives', () => {
      describe('when a retro has no retro items', () => {
        beforeEach(() => {
          retro = createRetro();
          retro.items = [];

          ReactDOM.render(
            <MuiThemeProvider>
              <RetroHeading retro={retro} retroId="13" archives={false} isMobile={false}/>
            </MuiThemeProvider>, root,
          );
          $('.retro-menu button').simulate('click');
        });

        it('does not show the link to archive the retro', () => {
          expect($('.retro-menu-item')[0]).not.toHaveText('Archive this retro');
        });

        it('does not show the link to view archives', () => {
          expect($('.retro-menu-item')[0]).not.toHaveText('View archives');
        });
      });

      describe('when a retro has retro items', () => {
        beforeEach(() => {
          retro = createRetro();
          ReactDOM.render(
            <MuiThemeProvider>
              <RetroHeading retro={retro} retroId="13" archives={false} isMobile={false}/>
            </MuiThemeProvider>, root,
          );
          $('.retro-menu button').simulate('click');
        });

        // Uses toEqual as 'Archive this retro' returns a pure string as it is a button which behaves differently
        it('shows the link to archive the retro', () => {
          expect($('.retro-menu-item')[0].innerHTML).toEqual('Archive this retro');
        });

        it('dispatches showDialog when the archive link is clicked', () => {
          $('.retro-menu button').simulate('click');
          $($('.retro-menu-item')[0]).simulate('click');

          expect('showDialog').toHaveBeenDispatchedWith(
            {
              type: 'showDialog',
              data: {
                title: 'You\'re about to archive this retro.',
                message: 'Are you sure?',
              },
            },
          );
        });

        it('does not show the link to view archives', () => {
          expect($('.retro-menu-item')[1]).not.toHaveText('View archives');
        });
      });
    });
  });
});

function createRetro(isPrivate = false) {
  return {
    id: 13,
    name: 'the retro name',
    is_private: isPrivate,
    video_link: 'http://the/video/link',
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
