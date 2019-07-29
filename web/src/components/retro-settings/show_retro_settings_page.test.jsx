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
import '../../spec_helper';

import {ShowRetroSettingsPage} from './show_retro_settings_page';

function getAllErrors(dom) {
  return dom.find('.error-message').map((o) => o.text());
}

describe('ShowRetroSettingsPage', () => {
  const sharedRetroSettingsBehavior = (isMobile) => {
    const retro = {
      id: 13,
      name: 'the retro name',
      slug: 'the-retro-123',
      is_private: false,
      video_link: 'http://the/video/link',
      items: [],
      action_items: [],
    };

    let dom;

    let fieldRetroName;
    let fieldRetroURL;
    let fieldRetroVideo;
    let environment;
    let clearErrors;
    let showRetroForId;
    let updateRetroSettings;
    let routeToRetroPasswordSettings;
    let getRetroSettings;
    let signOut;

    beforeEach(() => {
      clearErrors = jest.fn();
      showRetroForId = jest.fn();
      updateRetroSettings = jest.fn();
      routeToRetroPasswordSettings = jest.fn();
      getRetroSettings = jest.fn();
      signOut = jest.fn();

      const session = {request_uuid: 'some-request-uuid'};
      environment = {isMobile640: isMobile};
      dom = mount((
        <MuiThemeProvider>
          <ShowRetroSettingsPage
            retroId="13"
            retro={retro}
            session={session}
            environment={environment}
            clearErrors={clearErrors}
            showRetroForId={showRetroForId}
            updateRetroSettings={updateRetroSettings}
            routeToRetroPasswordSettings={routeToRetroPasswordSettings}
            getRetroSettings={getRetroSettings}
            signOut={signOut}
          />
        </MuiThemeProvider>
      ));

      fieldRetroName = dom.find('input#retro_name');
      fieldRetroURL = dom.find('input#retro_url');
      fieldRetroVideo = dom.find('input#retro_video_link');
    });

    it('displays the project name', () => {
      expect(dom.find('.retro-name')).toIncludeText(retro.name);
    });

    describe('project name field', () => {
      it('populates the project name field', () => {
        expect(dom.find('input#retro_name')).toHaveValue('the retro name');
      });

      it('updates the project name field when typed into', () => {
        fieldRetroName.simulate('change', {target: {value: 'the new retro name'}});
        expect(dom.find('input#retro_name')).toHaveValue('the new retro name');
      });

      describe('is empty', () => {
        beforeEach(() => {
          fieldRetroName.simulate('change', {target: {value: ''}});
          fieldRetroURL.simulate('change', {target: {value: 'some-url'}});
          dom.find('.retro-settings-form-submit').simulate('click');
        });

        it('does not update the retro settings', () => {
          expect(updateRetroSettings).not.toHaveBeenCalled();
        });

        it('displays an error message', () => {
          expect(getAllErrors(dom).join('')).toEqual('Your project needs a name!');
        });
      });
    });

    describe('video link field', () => {
      it('populates the video link field', () => {
        expect(dom.find('input#retro_video_link')).toHaveValue(retro.video_link);
      });
    });

    describe('project URL field', () => {
      it('populates the project URL field with the slug', () => {
        expect(dom.find('input#retro_url')).toHaveValue('the-retro-123');
      });

      it('updates the project URL field when typed into', () => {
        fieldRetroURL.simulate('change', {target: {value: 'another-retro-name'}});
        expect(dom.find('input#retro_url')).toHaveValue('another-retro-name');
      });

      it('displays an error message if empty', () => {
        fieldRetroName.simulate('change', {target: {value: 'The Retro Name'}});
        fieldRetroURL.simulate('change', {target: {value: ''}});
        dom.find('.retro-settings-form-submit').simulate('click');

        expect(getAllErrors(dom).join('')).toEqual('Your project needs a URL!');
        expect(updateRetroSettings).not.toHaveBeenCalled();
      });

      describe('has more than 236 characters', () => {
        beforeEach(() => {
          const moreThan236Characters = 'a'.repeat(236 + 1);
          fieldRetroURL.simulate('change', {target: {value: moreThan236Characters}});
        });

        it('does not allow submission', () => {
          dom.find('.retro-settings-form-submit').simulate('click');
          expect(updateRetroSettings).not.toHaveBeenCalled();
        });

        it('clears error message on valid input', () => {
          expect(getAllErrors(dom).join('')).toEqual('Your URL is too long!');

          fieldRetroURL.simulate('change', {target: {value: 'a'.repeat(236)}});

          expect(getAllErrors(dom).join('')).toEqual('');
        });

        it('submitting preserves the errors', () => {
          dom.find('.retro-settings-form-submit').simulate('click');

          expect(getAllErrors(dom).join('')).toContain('Your URL is too long!');
        });
      });

      describe('has unrecognized characters', () => {
        beforeEach(() => {
          const unrecognizedCharacters = 'foo*';
          fieldRetroURL.simulate('change', {target: {value: unrecognizedCharacters}});
        });

        it('does not allow submission', () => {
          dom.find('.retro-settings-form-submit').simulate('click');
          expect(updateRetroSettings).not.toHaveBeenCalled();
        });

        it('clears error message on valid input', () => {
          expect(getAllErrors(dom).join('')).toEqual('Your URL should only contain letters, numbers or hyphens!');

          fieldRetroURL.simulate('change', {target: {value: 'some-url'}});

          expect(getAllErrors(dom).join('')).toEqual('');
        });
      });

      it('displays an error message if provided', () => {
        dom = mount((
          <MuiThemeProvider>
            <ShowRetroSettingsPage
              retroId="13"
              retro={retro}
              errors={{name: '', slug: 'Something went wrong!'}}
              environment={environment}
              clearErrors={clearErrors}
              showRetroForId={showRetroForId}
              updateRetroSettings={updateRetroSettings}
              routeToRetroPasswordSettings={routeToRetroPasswordSettings}
              getRetroSettings={getRetroSettings}
              signOut={signOut}
            />
          </MuiThemeProvider>
        ));

        expect(getAllErrors(dom).join('')).toEqual('Something went wrong!');
      });
    });

    it('privacy defaults to the current setting', () => {
      const privateRetro = Object.assign({}, retro, {is_private: true});
      dom = mount((
        <MuiThemeProvider>
          <ShowRetroSettingsPage
            retroId="13"
            retro={privateRetro}
            environment={environment}
            clearErrors={clearErrors}
            showRetroForId={showRetroForId}
            updateRetroSettings={updateRetroSettings}
            routeToRetroPasswordSettings={routeToRetroPasswordSettings}
            getRetroSettings={getRetroSettings}
            signOut={signOut}
          />
        </MuiThemeProvider>
      ));

      expect(dom.find('input#retro_is_private')).toBeChecked();

      dom.find('input#retro_is_private').simulate('change');
      expect(dom.find('input#retro_is_private')).not.toBeChecked();
    });

    describe('all fields are empty', () => {
      beforeEach(() => {
        fieldRetroName.simulate('change', {target: {value: ''}});
        fieldRetroURL.simulate('change', {target: {value: ''}});
        dom.find('.retro-settings-form-submit').simulate('click');
      });

      it('displays error messages on all of the fields', () => {
        expect(getAllErrors(dom).join('')).toEqual('Your project needs a name!Your project needs a URL!');
      });

      it('clears out error message for only name field when it is valid', () => {
        fieldRetroName.simulate('change', {target: {value: 'name'}});
        expect(getAllErrors(dom).join('')).toEqual('Your project needs a URL!');
      });

      it('clears out error message for only url field when it is valid', () => {
        fieldRetroURL.simulate('change', {target: {value: 'some-url'}});
        expect(getAllErrors(dom).join('')).toEqual('Your project needs a name!');
      });

      it('clears out the errors when unmounted', () => {
        dom.unmount();

        expect(clearErrors).toHaveBeenCalled();
      });
    });

    it('updates the retro settings when the save button is clicked', () => {
      const new_video_url = 'newurl.com';
      fieldRetroName.simulate('change', {target: {value: 'the new retro name'}});
      fieldRetroURL.simulate('change', {target: {value: 'the-new-retro-slug'}});
      fieldRetroVideo.simulate('change', {target: {value: new_video_url}});

      expect(dom.find('input#retro_is_private')).not.toBeChecked();
      dom.find('input#retro_is_private').simulate('change');

      dom.find('.retro-settings-form-submit').simulate('click');

      expect(updateRetroSettings).toHaveBeenCalledWith('13', 'the new retro name', 'the-new-retro-slug', retro.slug, true, 'some-request-uuid', new_video_url);
    });

    it('routes to retro password settings when change password link is clicked', () => {
      dom.find('#retro-password-settings').simulate('click');

      expect(routeToRetroPasswordSettings).toHaveBeenCalledWith('13');
    });

    it('goes back to the retro page when the back button is clicked', () => {
      dom.find('button.retro-back').simulate('click');

      expect(showRetroForId).toHaveBeenCalledWith('13');
    });
  };

  describe('on web', () => {
    sharedRetroSettingsBehavior(false);
  });

  describe('on mobile', () => {
    sharedRetroSettingsBehavior(true);
  });
});
