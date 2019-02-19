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
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Helmet from 'react-helmet';
import Header from './header';

configure({adapter: new Adapter()});

describe('Header', () => {
  const config = {
    title: 'Retro Title',
  };

  describe('when retro is available', () => {
    beforeEach(() => {
      mount(<Header retro={{name: 'My Retro Name'}} config={config}/>);
    });

    it('should set the document title', () => {
      expect(Helmet.peek().title).toEqual('My Retro Name - Retro Title');
    });
  });

  describe('when retro is unavailable', () => {
    beforeEach(() => {
      mount(<Header retro={{name: ''}} config={config}/>);
    });

    it('should set the document title', () => {
      expect(Helmet.peek().title).toEqual('Retro Title');
    });
  });
});
