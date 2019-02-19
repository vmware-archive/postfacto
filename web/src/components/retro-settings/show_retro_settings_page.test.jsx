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
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {combineElementsContent, SpyDispatcher} from '../../spec_helper';

import ShowRetroSettingsPage from './show_retro_settings_page';

describe('ShowRetroSettingsPage', () => {
  let retro;

  const sharedRetroSettingsBehavior = () => {
    let $retro_name;
    let $retro_url;
    let $retro_video_link;
    let session;

    beforeEach(() => {
      retro = createRetro();
      session = {request_uuid: 'some-request-uuid'};
      ReactDOM.render(
        <MuiThemeProvider>
          <ShowRetroSettingsPage retroId="13" retro={retro} session={session}/>
        </MuiThemeProvider>,
        root,
      );
      $retro_name = $('input#retro_name');
      $retro_url = $('input#retro_url');
      $retro_video_link = $('input#retro_video_link');
    });

    describe('header', () => {
      it('displays the project name', () => {
        expect('.retro-name').toContainText(retro.name);
      });
    });

    describe('project name field', () => {
      it('populates the project name field', () => {
        expect('input#retro_name').toHaveValue('the retro name');
      });

      it('updates the project name field when typed into', () => {
        $retro_name.val('the new retro name').simulate('change');
        expect('input#retro_name').toHaveValue('the new retro name');
      });

      describe('is empty', () => {
        beforeEach(() => {
          $retro_name.val('').simulate('change');
          $retro_url.val('some-url').simulate('change');
          $('.retro-settings-form-submit').simulate('click');
        });

        it('does not update the retro settings', () => {
          expect(SpyDispatcher).not.toHaveReceived('updateRetroSettings');
        });

        it('displays an error message', () => {
          const errorMessage = combineElementsContent('.error-message');
          expect(errorMessage).toEqual('Your project needs a name!');
        });
      });
    });

    describe('video link field', () => {
      it('populates the video link field', () => {
        expect('input#retro_video_link').toHaveValue(retro.video_link);
      });
    });

    describe('project URL field', () => {
      it('populates the project URL field with the slug', () => {
        expect('input#retro_url').toHaveValue('the-retro-123');
      });

      it('updates the project URL field when typed into', () => {
        $retro_url.val('another-retro-name').simulate('change');
        expect('input#retro_url').toHaveValue('another-retro-name');
      });

      describe('is empty', () => {
        beforeEach(() => {
          $retro_name.val('The Retro Name').simulate('change');
          $retro_url.val('').simulate('change');
          $('.retro-settings-form-submit').simulate('click');
        });

        it('does not update the retro settings', () => {
          expect(SpyDispatcher).not.toHaveReceived('updateRetroSettings');
        });

        it('displays an error message', () => {
          const errorMessage = combineElementsContent('.error-message');
          expect(errorMessage).toEqual('Your project needs a URL!');
        });
      });

      describe('has more than 236 characters', () => {
        beforeEach(() => {
          const moreThan236Characters = 'a'.repeat(236 + 1);
          $retro_url.val(moreThan236Characters).simulate('change');
        });

        it('does not update the retro settings', () => {
          $('.retro-settings-form-submit').simulate('click');
          expect(SpyDispatcher).not.toHaveReceived('updateRetroSettings');
        });

        it('should clear error message on valid input', () => {
          let errorMessage = combineElementsContent('.error-message');
          expect(errorMessage).toEqual('Your URL is too long!');

          $retro_url.val('a'.repeat(236));
          $retro_url.simulate('change');

          errorMessage = combineElementsContent('.error-message');
          expect(errorMessage).toEqual('');
        });

        it('submitting should preserve the errors', () => {
          $('.retro-settings-form-submit').simulate('click');

          const errorMessage = combineElementsContent('.error-message');
          expect(errorMessage).toContain('Your URL is too long!');
        });
      });

      describe('has unrecognized characters', () => {
        beforeEach(() => {
          const unrecognizedCharacters = 'foo*';
          $retro_url.val(unrecognizedCharacters).simulate('change');
        });

        it('should not submit create a retro when there is no URL', () => {
          $('.retro-settings-form-submit').simulate('click');
          expect(SpyDispatcher).not.toHaveReceived('updateRetroSettings');
        });

        it('should clear error message on valid input', () => {
          let errorMessage = combineElementsContent('.error-message');
          expect(errorMessage).toEqual('Your URL should only contain letters, numbers or hyphens!');

          $retro_url.val('some-url').simulate('change');

          errorMessage = combineElementsContent('.error-message');
          expect(errorMessage).toEqual('');
        });
      });

      describe('has errors', () => {
        beforeEach(() => {
          ReactDOM.render(
            <MuiThemeProvider>
              <ShowRetroSettingsPage retroId="13" retro={retro} errors={{name: '', slug: 'Something went wrong!'}}/>
            </MuiThemeProvider>,
            root,
          );
        });

        it('displays an error message', () => {
          const errorMessage = combineElementsContent('.error-message');
          expect(errorMessage).toEqual('Something went wrong!');
        });
      });
    });

    describe('project is_private field', () => {
      beforeEach(() => {
        retro.is_private = true;
        ReactDOM.render(
          <MuiThemeProvider>
            <ShowRetroSettingsPage retroId="13" retro={retro}/>
          </MuiThemeProvider>,
          root,
        );
      });

      it('sets the is_private field', () => {
        expect('input#retro_is_private').toBeChecked();
      });
    });

    describe('all fields are empty', () => {
      beforeEach(() => {
        $retro_name.val('').simulate('change');
        $retro_url.val('').simulate('change');
        $('.retro-settings-form-submit').simulate('click');
      });

      it('displays error messages on all of the fields', () => {
        const errorMessage = combineElementsContent('.error-message');
        expect(errorMessage).toEqual('Your project needs a name!Your project needs a URL!');
      });

      it('clears out error message for only name field when it is valid', () => {
        $retro_name.val('name').simulate('change');
        const errorMessage = combineElementsContent('.error-message');
        expect(errorMessage).toEqual('Your project needs a URL!');
      });

      it('clears out error message for only url field when it is valid', () => {
        $retro_url.val('some-url').simulate('change');
        const errorMessage = combineElementsContent('.error-message');
        expect(errorMessage).toEqual('Your project needs a name!');
      });

      it('clears out the errors when unmounted', () => {
        ReactDOM.unmountComponentAtNode(root);

        expect(SpyDispatcher).toHaveReceived({
          type: 'clearErrors',
        });
      });
    });

    it('updates the retro settings when the save button is clicked', () => {
      const new_video_url = 'newurl.com';
      $retro_name.val('the new retro name').simulate('change');
      $retro_url.val('the-new-retro-slug').simulate('change');
      $retro_video_link.val(new_video_url).simulate('change');

      $('#retro_is_private').simulate('change');
      $('.retro-settings-form-submit').simulate('click');

      expect(SpyDispatcher).toHaveReceived({
        type: 'updateRetroSettings',
        data: {
          retro_id: '13',
          retro_name: 'the new retro name',
          is_private: true,
          new_slug: 'the-new-retro-slug',
          old_slug: retro.slug,
          request_uuid: 'some-request-uuid',
          video_link: new_video_url,
        },
      });
    });

    it('routes to retro password settings when change password link is clicked', () => {
      $('#retro-password-settings').simulate('click');

      expect(SpyDispatcher).toHaveReceived({
        type: 'routeToRetroPasswordSettings',
        data: {
          retro_id: '13',
        },
      });
    });

    it('goes back to the retro page when the back button is clicked', () => {
      $('button.retro-back').simulate('click');

      expect(SpyDispatcher).toHaveReceived({
        type: 'backPressedFromSettings',
        data: {retro_id: '13'},
      });
    });
  };

  describe('on web', () => {
    beforeEach(() => {
      ShowRetroSettingsPage.prototype.getIsMobile = () => false;
      ReactDOM.render(
        <MuiThemeProvider>
          <ShowRetroSettingsPage retroId="13"/>
        </MuiThemeProvider>,
        root,
      );
    });

    sharedRetroSettingsBehavior();
  });

  describe('on mobile', () => {
    beforeEach(() => {
      ShowRetroSettingsPage.prototype.getIsMobile = () => true;
      ReactDOM.render(
        <MuiThemeProvider>
          <ShowRetroSettingsPage retroId="13"/>
        </MuiThemeProvider>,
        root,
      );
    });

    sharedRetroSettingsBehavior();
  });
});

function createRetro() {
  return {
    id: 13,
    name: 'the retro name',
    slug: 'the-retro-123',
    is_private: false,
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
