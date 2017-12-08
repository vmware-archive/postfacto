require('../spec_helper');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import _ from 'lodash';
import {combineElementsContent} from '../support/utils';

describe('RetroCreatePage', () => {
  describe('when logged in', () => {
    beforeEach(() => {
      spyOn(window.localStorage, 'getItem').and.returnValue('some-token');
      const RetroCreatePage = require('../../../app/components/retro_create_page');
      ReactDOM.render(<MuiThemeProvider>
        <RetroCreatePage/>
      </MuiThemeProvider>, root);
    });

    describe('creating a retro', () => {
      let $retro_name;
      let $retro_url;
      let $retro_password;

      beforeEach(() => {
        $retro_name = $('.new-retro-page #retro_name');
        $retro_url = $('.new-retro-page #retro_url');
        $retro_password = $('.new-retro-page #retro_password');
      });

      it('has a title', () => {
        expect('.new-retro-page').toContainText('Time to make your team retro!');
      });

      describe('name field is empty', () => {
        beforeEach(() => {
          $retro_name.val('').simulate('change');
          $retro_url.val('slug').simulate('change');
          $retro_password.val('password').simulate('change');
          $('.retro-form-submit').simulate('click');
        });

        it('should not submit create a retro when there is no name', () => {
          expect('retroCreate').not.toHaveBeenDispatched();
        });

        it('should clear error message on valid input', () => {
          let errorMessage = combineElementsContent('.error-message');
          expect(errorMessage).toEqual('Your project needs a team name!');

          $retro_name.val('name').simulate('change');

          errorMessage = combineElementsContent('.error-message');
          expect(errorMessage).toEqual('');
        });
      });

      describe('slug field is empty', () => {
        beforeEach(() => {
          $retro_name.val('name').simulate('change');
          $retro_url.val('').simulate('change');
          $retro_password.val('password').simulate('change');
          $('.retro-form-submit').simulate('click');
        });

        it('should not submit create a retro when there is no team URL', () => {
          expect('retroCreate').not.toHaveBeenDispatched();
        });

        it('should clear error message on valid input', () => {
          let errorMessage = combineElementsContent('.error-message');
          expect(errorMessage).toEqual('Your project needs a URL!');

          $retro_url.val('some-url').simulate('change');

          errorMessage = combineElementsContent('.error-message');
          expect(errorMessage).toEqual('');
        });
      });

      describe('slug field has more than 236 characters', () => {
        beforeEach(() => {
          let moreThan236Characters = _.repeat('a', 236 + 1);
          $retro_url.val(moreThan236Characters).simulate('change');
        });

        it('should not submit create a retro', () => {
          $('.retro-form-submit').simulate('click');

          expect('retroCreate').not.toHaveBeenDispatched();
        });

        it('should clear error message on valid input', () => {
          let errorMessage = combineElementsContent('.error-message');
          expect(errorMessage).toEqual('Your URL is too long!');

          $retro_url.val(_.repeat('a', 236));
          $retro_url.simulate('change');

          errorMessage = combineElementsContent('.error-message');
          expect(errorMessage).toEqual('');
        });

        it('submitting should preserve the errors', () => {
          $('.retro-form-submit').simulate('click');

          let errorMessage = combineElementsContent('.error-message');
          expect(errorMessage).toContain('Your URL is too long!');
        });
      });

      describe('slug field has unrecognized characters', () => {
        beforeEach(() => {
          $retro_name.val('name').simulate('change');

          let unrecognizedCharacters = 'foo*';
          $retro_url.val(unrecognizedCharacters).simulate('change');

          $retro_password.val('password').simulate('change');
          $('.retro-form-submit').simulate('click');
        });

        it('should not submit create a retro when there is no team URL', () => {
          expect('retroCreate').not.toHaveBeenDispatched();
        });

        it('should clear error message on valid input', () => {
          let errorMessage = combineElementsContent('.error-message');
          expect(errorMessage).toEqual('Your URL should only contain letters, numbers or hyphens!');

          $retro_url.val('some-url').simulate('change');

          errorMessage = combineElementsContent('.error-message');
          expect(errorMessage).toEqual('');
        });
      });

      describe('password field is empty', () => {
        beforeEach(() => {
          $retro_name.val('name').simulate('change');
          $retro_url.val('slug').simulate('change');
          $retro_password.val('').simulate('change');
          $('.retro-form-submit').simulate('click');
        });

        it('should not submit create a retro when there is no team URL', () => {
          expect('retroCreate').not.toHaveBeenDispatched();
        });

        it('should clear error message on valid input', () => {
          let errorMessage = combineElementsContent('.error-message');
          expect(errorMessage).toEqual('Your project needs a password!');

          $retro_password.val('password').simulate('change');

          errorMessage = combineElementsContent('.error-message');
          expect(errorMessage).toEqual('');
        });
      });

      describe('all fields are empty', () => {
        beforeEach(() => {
          $('.retro-form-submit').simulate('click');
        });

        it('displays error messages on all of the fields', () => {
          const errorMessage = combineElementsContent('.error-message');
          expect(errorMessage).toEqual('Your project needs a team name!Your project needs a URL!Your project needs a password!');
        });

        it('clears out error message for only name field when it is valid', () => {
          $retro_name.val('name').simulate('change');
          const errorMessage = combineElementsContent('.error-message');
          expect(errorMessage).toEqual('Your project needs a URL!Your project needs a password!');
        });

        it('clears out error message for only URL field when it is valid', () => {
          $retro_url.val('some-url').simulate('change');
          const errorMessage = combineElementsContent('.error-message');
          expect(errorMessage).toEqual('Your project needs a team name!Your project needs a password!');
        });

        it('clears out error message for only password field when it is valid', () => {
          $retro_password.val('password').simulate('change');
          const errorMessage = combineElementsContent('.error-message');
          expect(errorMessage).toEqual('Your project needs a team name!Your project needs a URL!');
        });

        it('clears out the errors when unmounted', () => {
          ReactDOM.unmountComponentAtNode(root);

          expect('clearErrors').toHaveBeenDispatchedWith({
            type: 'clearErrors'
          });
        });
      });

      it('should submit creating a retro when clicking submit', () => {
        $retro_name.val('newRetro').simulate('change');
        $retro_url.val('new-retro').simulate('change');
        $retro_password.val('retroPass').simulate('change');
        $('.new-retro-page #retro_is_private').simulate('change');

        $('.retro-form-submit').simulate('click');
        expect('retroCreate').toHaveBeenDispatchedWith(
          {data: {name: 'newRetro', slug: 'new-retro', password: 'retroPass', isPrivate: false}});
      });
    });
  });

  describe('when not logged in', () => {
    beforeEach(() => {
      spyOn(window.localStorage, 'getItem').and.returnValue(null);
      const RetroCreatePage = require('../../../app/components/retro_create_page');
      ReactDOM.render(<MuiThemeProvider>
        <RetroCreatePage/>
      </MuiThemeProvider>, root);
    });

    it('should redirect to home page when not logged in', () => {
      expect('setRoute').toHaveBeenDispatchedWith({type: 'setRoute', data: '/'});
    });
  });
});
