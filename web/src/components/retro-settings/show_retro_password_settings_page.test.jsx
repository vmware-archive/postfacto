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
import {Dispatcher} from 'p-flux';
import '../../spec_helper';

import ShowRetroPasswordSettingsPage from './show_retro_password_settings_page';

function getAllErrors(dom) {
  return dom.find('.error-message').map((o) => o.text());
}

describe('ShowRetroPasswordSettingsPage', () => {
  const retro = {
    id: 13,
    name: 'the retro name',
    slug: 'the-retro-123',
    video_link: 'http://the/video/link',
    items: [],
    action_items: [],
  };

  const session = {request_uuid: 'blah'};

  const sharedRetroPasswordSettingsBehavior = (isMobile) => {
    let dom;

    beforeEach(() => {
      const environment = {isMobile640: isMobile};

      dom = mount((
        <MuiThemeProvider>
          <ShowRetroPasswordSettingsPage retroId="13" retro={retro} session={session} environment={environment}/>
        </MuiThemeProvider>
      ));
    });

    it('displays the project name', () => {
      expect(dom.find('.retro-name')).toIncludeText(retro.name);
    });

    it('goes back to the retro page when the back button is clicked', () => {
      dom.find('button.retro-back').simulate('click');

      expect(Dispatcher).toHaveReceived({
        type: 'backPressedFromSettings',
        data: {retro_id: '13'},
      });
    });

    it('goes back to the retro settings page when the cancel button is clicked', () => {
      dom.find('button.retro-password-settings-cancel').simulate('click');

      expect(Dispatcher).toHaveReceived({
        type: 'backPressedFromPasswordSettings',
        data: {retro_id: '13'},
      });
    });

    it('dispatches updateRetroPassword', () => {
      dom.find('#retro_current_password').simulate('change', {target: {value: 'current password'}});
      dom.find('#retro_new_password').simulate('change', {target: {value: 'new password'}});
      dom.find('#retro_confirm_new_password').simulate('change', {target: {value: 'new password'}});

      dom.find('button.retro-settings-form-submit').simulate('click');

      expect(Dispatcher).toHaveReceived({
        type: 'updateRetroPassword',
        data: {
          retro_id: '13',
          current_password: 'current password',
          new_password: 'new password',
          request_uuid: 'blah',
        },
      });
    });

    it('allows blank old passwords', () => {
      dom.find('#retro_new_password').simulate('change', {target: {value: 'new password'}});
      dom.find('#retro_confirm_new_password').simulate('change', {target: {value: 'new password'}});

      dom.find('button.retro-settings-form-submit').simulate('click');

      expect(Dispatcher).toHaveReceived({
        type: 'updateRetroPassword',
        data: {
          retro_id: '13',
          current_password: '',
          new_password: 'new password',
          request_uuid: 'blah',
        },
      });
    });

    it('allows blank new passwords', () => {
      dom.find('#retro_current_password').simulate('change', {target: {value: 'current password'}});

      dom.find('button.retro-settings-form-submit').simulate('click');

      expect(Dispatcher).toHaveReceived({
        type: 'updateRetroPassword',
        data: {
          retro_id: '13',
          current_password: 'current password',
          new_password: '',
          request_uuid: 'blah',
        },
      });
    });

    it('displays an error message if new password and confirmation do not match', () => {
      dom.find('#retro_new_password').simulate('change', {target: {value: 'password'}});
      dom.find('#retro_confirm_new_password').simulate('change', {target: {value: 'nope'}});
      dom.find('.retro-settings-form-submit').simulate('click');

      expect(getAllErrors(dom).join('')).toEqual('Your passwords do not match!');

      dom.find('#retro_confirm_new_password').simulate('change', {target: {value: 'password'}});
      dom.find('.retro-settings-form-submit').simulate('click');

      expect(getAllErrors(dom).join('')).toEqual('');
    });

    it('clears errors when unmounted', () => {
      dom.unmount();

      expect(Dispatcher).toHaveReceived({type: 'clearErrors'});
    });
  };

  describe('on web', () => {
    sharedRetroPasswordSettingsBehavior(false);
  });

  describe('on mobile', () => {
    sharedRetroPasswordSettingsBehavior(true);
  });
});
