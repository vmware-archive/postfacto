require('../spec_helper');

describe('NotFoundPage', () => {
  let subject;
  beforeEach(() => {
    const NotFoundPage = require('../../../app/components/not_found_page');
    subject = ReactDOM.render(<NotFoundPage />, root);
  });

  describe('When page is not found', () => {
    it('displays error details', () => {
      expect($('h1').text()).toContain('Oops...');
    });
    it('dispatches redirectToRetroCreatePage when the create retro button is clicked', () => {
      $('button:contains("Create a Project")').simulate('click');
      expect('redirectToRetroCreatePage').toHaveBeenDispatchedWith({type: 'redirectToRetroCreatePage'});
    });
    it('dispatches resetNotFound when willUnMount', () => {
      subject.componentWillUnmount();
      expect('resetNotFound').toHaveBeenDispatched();
    });
  });
});