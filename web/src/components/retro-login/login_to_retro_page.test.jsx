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
import {Dispatcher} from 'p-flux';
import '../../spec_helper';

import LoginToRetroPage from './login_to_retro_page';

describe('LoginToRetroPage', () => {
  const retro = {
    id: 13,
    name: 'the retro name',
  };

  const config = {terms: '', privacy: ''};

  let dom;

  describe('while retro is loading', () => {
    it('renders nothing', () => {
      dom = shallow(<LoginToRetroPage retro={{name: ''}} retroId="13" config={config}/>);
      expect(dom.find('h1')).not.toExist();
    });
  });

  describe('with a retro', () => {
    beforeEach(() => {
      dom = mount(<LoginToRetroPage retro={retro} retroId="13" config={config}/>);
    });

    it('dispatches getRetroLogin', () => {
      expect(Dispatcher).toHaveReceived({type: 'getRetroLogin', data: {retro_id: '13'}});
      expect(dom.find('h1')).toIncludeText('Psst... what\'s the password?');
      expect(dom.find('label')).toIncludeText('Enter the password to access the retro name.');
    });

    it('focuses the password input field', () => {
      expect(dom.find('.form-input')).toBeFocused();
    });

    it('dispatches loginToRetro when clicking on the login button', () => {
      dom.find('.form-input').simulate('change', {target: {value: 'pa55word'}});
      dom.find('.retro-form-submit').simulate('click');

      expect(Dispatcher).toHaveReceived({
        type: 'loginToRetro',
        data: {retro_id: '13', password: 'pa55word'},
      });
      expect(dom.find('.form-input')).toHaveValue('');
    });

    it('dispatches loginToRetro when pressing return', () => {
      const input = dom.find('.form-input');
      input.simulate('change', {target: {value: 'pa55word'}});
      input.simulate('keyPress', {key: 'Enter'});

      expect(Dispatcher).toHaveReceived({
        type: 'loginToRetro',
        data: {retro_id: '13', password: 'pa55word'},
      });
      expect(dom.find('.form-input')).toHaveValue('');
    });

    it('displays error messages dynamically', () => {
      dom.setProps({
        login_error_message: 'uh-oh',
      });

      expect(dom.find('.error-message')).toIncludeText('uh-oh');
    });
  });

  describe('title', () => {
    function setupRetro({force_relogin}) {
      return shallow(<LoginToRetroPage retro={retro} retroId="13" force_relogin={force_relogin} config={config}/>);
    }

    it('shows login required message when force_relogin is false', () => {
      dom = setupRetro({force_relogin: false});
      expect(dom.find('h1')).toIncludeText('Psst... what\'s the password?');
    });

    it('shows login required message when force_relogin is missing', () => {
      dom = setupRetro({force_relogin: undefined});
      expect(dom.find('h1')).toIncludeText('Psst... what\'s the password?');
    });

    it('shows password changed message when force_relogin is true', () => {
      dom = setupRetro({force_relogin: true});
      expect(dom.find('h1')).toIncludeText('The owner of this retro has chosen to protect it with a password.');
    });
  });
});
