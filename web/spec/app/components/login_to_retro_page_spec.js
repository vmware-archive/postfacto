require('../spec_helper');

const LoginToRetroPage = require('../../../app/components/login_to_retro_page');

describe('LoginToRetroPage', () => {
  describe('When the retro has not yet been fetched', () => {
    it('renders nothing', () => {
      ReactDOM.render(<LoginToRetroPage retro={{name: ''}} retroId={'13'} />, root);
      expect('h1').not.toExist();
    });
  });

  describe('When page is shown', () => {
    const retro = {
      id: 13,
      name: 'the retro name'
    };

    beforeEach(() => {
      ReactDOM.render(<LoginToRetroPage retro={retro} retroId={'13'} />, root);
    });

    it('dispatches getRetroLogin', () => {
      expect('getRetroLogin').toHaveBeenDispatchedWith({type: 'getRetroLogin', data: {retro_id: '13'}});
      expect($('h1').text()).toEqual('Psst... what\'s the password?');
      expect('label').toContainText('Enter the password to access the retro name.');
    });


    describe('when clicking on the login button', () => {
      it('dispatches loginToRetro', () => {
        $('.form-input').val('pa55word').simulate('change');
        $('.retro-form-submit').simulate('click');
        expect('loginToRetro').toHaveBeenDispatchedWith({type: 'loginToRetro', data: {retro_id: '13', password: 'pa55word'}});
        expect('.form-input').toHaveValue('');
      });
    });

    describe('when hitting the return key in the password input field', () => {
      it('dispatches loginToRetro', () => {
        $('.form-input').val('pa55word').simulate('change');
        $('.form-input').simulate('keyPress', {key: 'Enter'});
        expect('loginToRetro').toHaveBeenDispatchedWith({type: 'loginToRetro', data: {retro_id: '13', password: 'pa55word'}});
        expect('.form-input').toHaveValue('');
      });
    });

    describe('when wrong password is given', () => {
      beforeEach(() => {
        ReactDOM.render(<LoginToRetroPage retro={retro} retroId={'13'} login_error_message={'Oops, wrong password.'}/>, root);
      });

      it('displays an error message', () =>{
        $('.form-input').val('lolwut').simulate('change');
        $('.retro-form-submit').simulate('click');

        expect('.error-message').toContainText('Oops, wrong password.');
      });
    });
  });

  describe('pageTitle', () => {
    let component;
    const retro = {
      id: 13,
      name: 'the retro name'
    };

    const setupRetro = ({force_relogin}) => {
      component = ReactDOM.render(<LoginToRetroPage retro={retro} retroId="13" force_relogin={force_relogin} />, root);
    };

    it('returns login required message when force_relogin is false', () => {
      setupRetro({force_relogin: false});
      expect(component.pageTitle()).toEqual('Psst... what\'s the password?');
    });

    it('returns login required message when force_relogin is missing', () => {
      setupRetro({force_relogin: undefined});
      expect(component.pageTitle()).toEqual('Psst... what\'s the password?');
    });

    it('returns password changed message when force_relogin is true', () => {
      setupRetro({force_relogin: true});
      expect(component.pageTitle()).toEqual('The owner of this retro has chosen to protect it with a password.');
    });
  });
});
