require('../spec_helper');

describe('ApiServerNotFoundPage', () => {
  let subject;
  beforeEach(() => {
    const ApiServerNotFoundPage = require('../../../app/components/api_server_not_found_page');
    subject = ReactDOM.render(<ApiServerNotFoundPage />, root);
  });

  describe('When api server is not found', () => {
    it('displays error details', () => {
      expect($('h1').text()).toContain('Oh no! It\'s broken');
    });

    it('dispatches resetApiServerNotFound when unmounting', () => {
      subject.componentWillUnmount();
      expect('resetApiServerNotFound').toHaveBeenDispatched();
    });
  });
});
