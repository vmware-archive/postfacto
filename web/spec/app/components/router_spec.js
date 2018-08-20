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
const Alert = require('../../../app/components/alert');
const Router = require('../../../app/components/router');
const EmptyPage = require('../../../app/components/pure/empty_page');
const HomePage = require('../../../app/components/home_page');
const ApiServerNotFoundPage = require('../../../app/components/api_server_not_found_page');
const TestUtils = require('react-addons-test-utils');

describe('Router', () => {
  let rendered;
  let fakeRouter = { get: () => {} };

  beforeEach(() => {
    rendered = ReactDOM.render(<Router alert={{}} router={fakeRouter}/>, root);
  });

  it('renders alert', () => {
    const results = TestUtils.scryRenderedComponentsWithType(rendered, Alert);

    expect(results.length).toEqual(1);
  });

  describe('when changed to a different page', () => {
    beforeEach(() => {
      rendered.setState({Page: HomePage});
    });

    it('dispatches hide alert', () => {
      expect('hideAlert').toHaveBeenDispatched();
    });
  });

  describe('when changed to the same page', () => {
    beforeEach(() => {
      rendered.setState({Page: EmptyPage});
    });

    it('does not dispatch hide alert', () => {
      expect('hideAlert').not.toHaveBeenDispatched();
    });
  });

  describe('when api server not found prop', () => {
    it('renders ApiServerNotFoundPage when api_server_not_found is true', () => {
      rendered = ReactDOM.render(<Router alert={{}} router={fakeRouter} api_server_not_found={true} />, root);

      let pages = TestUtils.scryRenderedComponentsWithType(rendered, ApiServerNotFoundPage);
      expect(pages.length).toEqual(1);
    });

    it('does not render ApiServerNotFoundPage when api_server_not_found is false', () => {
      rendered = ReactDOM.render(<Router alert={{}} router={fakeRouter} api_server_not_found={false} />, root);

      let pages = TestUtils.scryRenderedComponentsWithType(rendered, ApiServerNotFoundPage);
      expect(pages.length).toEqual(0);
    });
  });
});
