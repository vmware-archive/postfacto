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
import {combineElementsContent} from '../spec_helper';

import ShowRetroPasswordSettingsPage from './show_retro_password_settings_page';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

describe('ShowRetroPasswordSettingsPage', () => {
  let retro;
  let session;

  const sharedRetroPasswordSettingsBehavior = () => {
    beforeEach(() => {
      retro = createRetro();
      session = {request_uuid: 'blah'};
      ReactDOM.render(
        <MuiThemeProvider>
          <ShowRetroPasswordSettingsPage retroId="13" retro={retro} config={global.Retro.config} session={session}/>
        </MuiThemeProvider>,
        root,
      );
    });

    describe('header', () => {
      it('displays the project name', () => {
        expect('.retro-name').toContainText(retro.name);
      });
    });

    it('goes back to the retro page when the back button is clicked', () => {
      $('button.retro-back').simulate('click');

      expect('backPressedFromSettings').toHaveBeenDispatchedWith({
        type: 'backPressedFromSettings',
        data: {retro_id: '13'},
      });
    });

    it('goes back to the retro settings page when the cancel button is clicked', () => {
      $('button.retro-password-settings-cancel').simulate('click');

      expect('backPressedFromPasswordSettings').toHaveBeenDispatchedWith({
        type: 'backPressedFromPasswordSettings',
        data: {retro_id: '13'},
      });
    });

    it('dispatches updateRetroPassword', () => {
      $('#retro_current_password').val('current password').simulate('change');
      $('#retro_new_password').val('new password').simulate('change');
      $('#retro_confirm_new_password').val('new password').simulate('change');

      $('button.retro-settings-form-submit').simulate('click');

      expect('updateRetroPassword').toHaveBeenDispatchedWith({
        type: 'updateRetroPassword',
        data: {
          retro_id: '13',
          current_password: 'current password',
          new_password: 'new password',
          request_uuid: 'blah',
        },
      });
    });

    describe('when current retro password is blank', () => {
      it('dispatches updateRetroPassword with empty string', () => {
        $('#retro_new_password').val('new password').simulate('change');
        $('#retro_confirm_new_password').val('new password').simulate('change');

        $('button.retro-settings-form-submit').simulate('click');

        expect('updateRetroPassword').toHaveBeenDispatchedWith({
          type: 'updateRetroPassword',
          data: {
            retro_id: '13',
            current_password: '',
            new_password: 'new password',
            request_uuid: 'blah',
          },
        });
      });
    });

    describe('when new retro password is blank', () => {
      it('dispatches updateRetroPassword with empty string', () => {
        $('#retro_current_password').val('current password').simulate('change');

        $('button.retro-settings-form-submit').simulate('click');

        expect('updateRetroPassword').toHaveBeenDispatchedWith({
          type: 'updateRetroPassword',
          data: {
            retro_id: '13',
            current_password: 'current password',
            new_password: '',
            request_uuid: 'blah',
          },
        });
      });
    });

    describe('validations', () => {
      it('displays an error message if new password and confirmation do not match', () => {
        $('#retro_new_password').val('password').simulate('change');
        $('#retro_confirm_new_password').val('lolwut').simulate('change');

        $('.retro-settings-form-submit').simulate('click');

        let errorMessage = combineElementsContent('.error-message');
        expect(errorMessage).toEqual('Your passwords do not match!');

        $('#retro_confirm_new_password').val('password').simulate('change');

        $('.retro-settings-form-submit').simulate('click');

        errorMessage = combineElementsContent('.error-message');
        expect(errorMessage).toEqual('');
      });

      it('clears out the errors when unmounted', () => {
        ReactDOM.unmountComponentAtNode(root);

        expect('clearErrors').toHaveBeenDispatchedWith({
          type: 'clearErrors',
        });
      });
    });
  };

  describe('on web', () => {
    beforeEach(() => {
      ShowRetroPasswordSettingsPage.prototype.getIsMobile = () => false;
      ReactDOM.render(
        <MuiThemeProvider>
          <ShowRetroPasswordSettingsPage retroId="13" config={global.Retro.config} session={session}/>
        </MuiThemeProvider>,
        root,
      );
    });

    sharedRetroPasswordSettingsBehavior();
  });

  describe('on mobile', () => {
    beforeEach(() => {
      ShowRetroPasswordSettingsPage.prototype.getIsMobile = () => true;
      ReactDOM.render(
        <MuiThemeProvider>
          <ShowRetroPasswordSettingsPage retroId="13" config={global.Retro.config} session={session}/>
        </MuiThemeProvider>,
        root,
      );
    });

    sharedRetroPasswordSettingsBehavior();
  });
});

function createRetro() {
  return {
    id: 13,
    name: 'the retro name',
    slug: 'the-retro-123',
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
