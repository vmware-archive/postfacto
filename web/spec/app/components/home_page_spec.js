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

describe('HomePage', () => {
  describe('When page loaded', () => {
    beforeEach(() => {
      const HomePage = require('../../../app/components/home_page');
      ReactDOM.render(<HomePage />, root);
    });

    it('dispatches showHomePageAnalytics action when home page is loaded', () => {
      expect('showHomePageAnalytics').toHaveBeenDispatched();
    });
  });

  describe('when country code is in EU', () => {
    beforeEach(() => {
      const HomePage = require('../../../app/components/home_page');
      ReactDOM.render(<HomePage countryCode="DE"/>, root);
    });

    it('shows the cookies banner', () => {
      expect('.banner').toContainText('use of cookies');
    });
  });

  describe('when country code is not in EU', () => {
    beforeEach(() => {
      const HomePage = require('../../../app/components/home_page');
      ReactDOM.render(<HomePage countryCode="US"/>, root);
    });

    it('does not shows the cookies banner', () => {
      expect('.banner').not.toExist();
    });
  });
});
