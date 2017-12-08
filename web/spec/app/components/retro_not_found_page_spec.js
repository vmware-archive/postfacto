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
