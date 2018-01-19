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

require('../spec_helper');

describe('RetroNotFoundPage', () => {
  let subject;
  beforeEach(() => {
    const RetroNotFoundPage = require('../../../app/components/retro_not_found_page');
    subject = ReactDOM.render(<RetroNotFoundPage />, root);
  });

  describe('When retro is not found', () => {
    it('displays error details', () => {
      expect($('h1').text()).toContain('Project not found.');
    });
    it('dispatches redirectToRetroCreatePage when the create retro button is clicked', () => {
      $('button:contains("Create a Project")').simulate('click');
      expect('redirectToRetroCreatePage').toHaveBeenDispatchedWith({type: 'redirectToRetroCreatePage'});
    });

    it('dispatches resetRetroNotFound when unmounting', () => {
      subject.componentWillUnmount();
      expect('resetRetroNotFound').toHaveBeenDispatched();
    });
  });
});
