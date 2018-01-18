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

describe('Header', () => {
  const Header = require('../../../app/components/header');

  let retro = {
    name: 'My Retro Name'
  };

  let config = {
    title: 'Retro Title'
  };

  describe('when retro is available', () => {
    beforeEach(() => {
      ReactDOM.render(<Header retro={retro} config={config}/>, root);
    });
    it('should set the document title', () => {
      expect(document.title).toEqual('My Retro Name - Retro Title');
    });
  });

  describe('when retro is unavailable', () => {
    beforeEach(() => {
      ReactDOM.render(<Header retro={{name: ''}} config={config}/>, root);
    });
    it('should set the document title', () => {
      expect(document.title).toEqual('Retro Title');
    });
  });

});