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
import '../../spec_helper';

import {RetroCreatePage} from './retro_create_page';

function getAllErrors(dom) {
  return dom.find('.error-message').map((o) => o.text());
}

describe('RetroCreatePage', () => {
  let dom;
  let fieldRetroName;
  let fieldRetroURL;
  let fieldRetroPassword;
  let redirectToHome;
  let clearErrors;
  let retroCreate;

  beforeEach(() => {
    redirectToHome = jest.fn();
    clearErrors = jest.fn();
    retroCreate = jest.fn();
    localStorage.setItem('authToken', 'some-token');
    dom = mount((
      <MuiThemeProvider>
        <RetroCreatePage
          redirectToHome={redirectToHome}
          clearErrors={clearErrors}
          retroCreate={retroCreate}
        />
      </MuiThemeProvider>
    ));

    fieldRetroName = dom.find('#retro_name');
    fieldRetroURL = dom.find('#retro_url');
    fieldRetroPassword = dom.find('#retro_password');

    fieldRetroName.simulate('change', {target: {value: 'newRetro'}});
    fieldRetroURL.simulate('change', {target: {value: 'new-retro'}});
    fieldRetroPassword.simulate('change', {target: {value: 'retroPass'}});
  });

  it('has a title', () => {
    expect(dom.find('.new-retro-page')).toIncludeText('Time to make your team retro!');
  });

  describe('name field is empty', () => {
    beforeEach(() => {
      fieldRetroName.simulate('change', {target: {value: ''}});
      dom.find('.retro-form-submit').simulate('click');
    });

    it('does not submit', () => {
      expect(retroCreate).not.toHaveBeenCalled();
    });

    it('clears error on valid input', () => {
      expect(getAllErrors(dom).join('')).toEqual('Your project needs a team name!');

      fieldRetroName.simulate('change', {target: {value: 'name'}});

      expect(getAllErrors(dom).join('')).toEqual('');
    });
  });

  describe('slug field is empty', () => {
    beforeEach(() => {
      fieldRetroURL.simulate('change', {target: {value: ''}});
      dom.find('.retro-form-submit').simulate('click');
    });

    it('does not submit', () => {
      expect(retroCreate).not.toHaveBeenCalled();
    });

    it('clears error on valid input', () => {
      expect(getAllErrors(dom).join('')).toEqual('Your project needs a URL!');

      fieldRetroURL.simulate('change', {target: {value: 'some-url'}});

      expect(getAllErrors(dom).join('')).toEqual('');
    });
  });

  describe('slug field has more than 236 characters', () => {
    beforeEach(() => {
      const moreThan236Characters = 'a'.repeat(236 + 1);
      fieldRetroURL.simulate('change', {target: {value: moreThan236Characters}});
    });

    it('does not submit', () => {
      dom.find('.retro-form-submit').simulate('click');

      expect(retroCreate).not.toHaveBeenCalled();
    });

    it('clears error message on valid input', () => {
      expect(getAllErrors(dom).join('')).toEqual('Your URL is too long!');

      fieldRetroURL.simulate('change', {target: {value: 'ok'}});

      expect(getAllErrors(dom).join('')).toEqual('');
    });

    it('preserves error when submitting', () => {
      dom.find('.retro-form-submit').simulate('click');

      expect(getAllErrors(dom).join('')).toEqual('Your URL is too long!');
    });
  });

  describe('slug field has unrecognized characters', () => {
    beforeEach(() => {
      const unrecognizedCharacters = 'foo*';
      fieldRetroURL.simulate('change', {target: {value: unrecognizedCharacters}});

      dom.find('.retro-form-submit').simulate('click');
    });

    it('does not submit', () => {
      expect(retroCreate).not.toHaveBeenCalled();
    });

    it('clears error message on valid input', () => {
      expect(getAllErrors(dom).join('')).toEqual('Your URL should only contain letters, numbers or hyphens!');

      fieldRetroURL.simulate('change', {target: {value: 'ok-now'}});

      expect(getAllErrors(dom).join('')).toEqual('');
    });
  });

  describe('password field is empty', () => {
    beforeEach(() => {
      fieldRetroPassword.simulate('change', {target: {value: ''}});
      dom.find('.retro-form-submit').simulate('click');
    });

    it('does not submit', () => {
      expect(retroCreate).not.toHaveBeenCalled();
    });

    it('clears error message on valid input', () => {
      expect(getAllErrors(dom).join('')).toEqual('Your project needs a password!');

      fieldRetroPassword.simulate('change', {target: {value: 'password'}});

      expect(getAllErrors(dom).join('')).toEqual('');
    });
  });

  describe('all fields are empty', () => {
    beforeEach(() => {
      fieldRetroName.simulate('change', {target: {value: ''}});
      fieldRetroURL.simulate('change', {target: {value: ''}});
      fieldRetroPassword.simulate('change', {target: {value: ''}});
      dom.find('.retro-form-submit').simulate('click');
    });

    it('displays error messages on all of the fields', () => {
      expect(getAllErrors(dom)).toEqual([
        'Your project needs a team name!',
        'Your project needs a URL!',
        'Your project needs a password!',
      ]);
    });

    it('clears out error message for only name field when it is valid', () => {
      fieldRetroName.simulate('change', {target: {value: 'name'}});
      expect(getAllErrors(dom)).not.toContain('Your project needs a team name!');
      expect(getAllErrors(dom)).toContain('Your project needs a URL!');
      expect(getAllErrors(dom)).toContain('Your project needs a password!');
    });

    it('clears out error message for only URL field when it is valid', () => {
      fieldRetroURL.simulate('change', {target: {value: 'some-url'}});
      expect(getAllErrors(dom)).toContain('Your project needs a team name!');
      expect(getAllErrors(dom)).not.toContain('Your project needs a URL!');
      expect(getAllErrors(dom)).toContain('Your project needs a password!');
    });

    it('clears out error message for only password field when it is valid', () => {
      fieldRetroPassword.simulate('change', {target: {value: 'password'}});
      expect(getAllErrors(dom)).toContain('Your project needs a team name!');
      expect(getAllErrors(dom)).toContain('Your project needs a URL!');
      expect(getAllErrors(dom)).not.toContain('Your project needs a password!');
    });

    it('clears out the errors when unmounted', () => {
      dom.unmount();

      expect(clearErrors).toHaveBeenCalled();
    });
  });

  it('submits when clicking submit if all fields are valid', () => {
    dom.find('.new-retro-page input#retro_is_private').simulate('change');
    dom.find('.retro-form-submit').simulate('click');

    expect(retroCreate).toHaveBeenCalledWith({name: 'newRetro', slug: 'new-retro', password: 'retroPass', isPrivate: false});
  });

  it('redirects to home page when not logged in', () => {
    localStorage.setItem('authToken', '');
    shallow(<RetroCreatePage redirectToHome={redirectToHome} clearErrors={clearErrors} retroCreate={retroCreate}/>);

    expect(redirectToHome).toHaveBeenCalled();
  });
});
