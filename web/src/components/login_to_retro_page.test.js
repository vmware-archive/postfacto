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

import LoginToRetroPage from './login_to_retro_page';

describe('LoginToRetroPage', () => {
  describe('When the retro has not yet been fetched', () => {
    it('renders nothing', () => {
      ReactDOM.render(<LoginToRetroPage retro={{name: ''}} retroId="13"/>, root);
      expect('h1').not.toExist();
    });
  });

  describe('When page is shown', () => {
    const retro = {
      id: 13,
      name: 'the retro name',
    };

    beforeEach(() => {
      ReactDOM.render(<LoginToRetroPage retro={retro} retroId="13"/>, root);
    });

    it('dispatches getRetroLogin', () => {
      expect('getRetroLogin').toHaveBeenDispatchedWith({type: 'getRetroLogin', data: {retro_id: '13'}});
      expect($('h1').text()).toEqual('Psst... what\'s the password?');
      expect('label').toContainText('Enter the password to access the retro name.');
    });

    it('focuses the password input field', () => {
      expect('.form-input').toBeFocused();
    });


    describe('when clicking on the login button', () => {
      it('dispatches loginToRetro', () => {
        $('.form-input').val('pa55word').simulate('change');
        $('.retro-form-submit').simulate('click');
        expect('loginToRetro').toHaveBeenDispatchedWith({
          type: 'loginToRetro',
          data: {retro_id: '13', password: 'pa55word'},
        });
        expect('.form-input').toHaveValue('');
      });
    });

    describe('when hitting the return key in the password input field', () => {
      it('dispatches loginToRetro', () => {
        $('.form-input').val('pa55word').simulate('change');
        $('.form-input').simulate('keyPress', {key: 'Enter'});
        expect('loginToRetro').toHaveBeenDispatchedWith({
          type: 'loginToRetro',
          data: {retro_id: '13', password: 'pa55word'},
        });
        expect('.form-input').toHaveValue('');
      });
    });

    describe('when wrong password is given', () => {
      beforeEach(() => {
        ReactDOM.render(<LoginToRetroPage retro={retro} retroId="13"
                                          login_error_message="Oops, wrong password."/>, root);
      });

      it('displays an error message', () => {
        $('.form-input').val('lolwut').simulate('change');
        $('.retro-form-submit').simulate('click');

        expect('.error-message').toContainText('Oops, wrong password.');
      });
    });
  });

  describe('pageTitle', () => {
    let component;
    const retro = {
      id: 13,
      name: 'the retro name',
    };

    const setupRetro = ({force_relogin}) => {
      component = ReactDOM.render(<LoginToRetroPage retro={retro} retroId="13" force_relogin={force_relogin}/>, root);
    };

    it('returns login required message when force_relogin is false', () => {
      setupRetro({force_relogin: false});
      expect(component.pageTitle()).toEqual('Psst... what\'s the password?');
    });

    it('returns login required message when force_relogin is missing', () => {
      setupRetro({force_relogin: undefined});
      expect(component.pageTitle()).toEqual('Psst... what\'s the password?');
    });

    it('returns password changed message when force_relogin is true', () => {
      setupRetro({force_relogin: true});
      expect(component.pageTitle()).toEqual('The owner of this retro has chosen to protect it with a password.');
    });
  });
});
