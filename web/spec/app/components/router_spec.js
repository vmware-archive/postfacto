require('../spec_helper');
const Alert = require('../../../app/components/alert');
const Router = require('../../../app/components/router');
const EmptyPage = require('../../../app/components/empty_page');
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
