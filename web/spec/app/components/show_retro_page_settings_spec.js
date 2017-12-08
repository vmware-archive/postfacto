require('../spec_helper');
const ShowRetroPage = require('../../../app/components/show_retro_page');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

describe('Retro settings', () => {
  let originalGetIsMobile;
  beforeEach(() => {
    let retro = createRetro();

    originalGetIsMobile = ShowRetroPage.prototype.getIsMobile;
    ShowRetroPage.prototype.getIsMobile = () => false;
    window.localStorage.setItem('authToken', 'some-token');

    ReactDOM.render(<MuiThemeProvider>
      <ShowRetroPage retro={retro} retroId={'13'} archives={false} config={global.Retro.config} featureFlags={ { archiveEmails: true } }/>
    </MuiThemeProvider>, root);
  });
  afterEach(() => {
    ShowRetroPage.prototype.getIsMobile = originalGetIsMobile;
  });

  it('should have retro settings menu item', () =>{
    $('.retro-menu button').simulate('touchTap');
    expect($('.retro-menu-item')[1].innerHTML).toContainText('Retro settings');
  });

  describe('when user has an api token', () => {
    beforeEach(() => {
      window.localStorage.setItem('apiToken-13', 'some-token');
    });

    afterEach(() => {
      window.localStorage.clear();
    });

    it('should redirect to retro settings page', () => {
      $('.retro-menu button').simulate('touchTap');
      $($('.retro-menu-item')[1]).simulate('click');

      expect('routeToRetroSettings').toHaveBeenDispatchedWith({
        type: 'routeToRetroSettings',
        data: {retro_id: '13'}
      });
    });
  });

  describe('when user is not signed in', () => {
    beforeEach(() => {
      window.localStorage.clear();
    });

    it('should redirect to the retro login page', () => {
      $('.retro-menu button').simulate('touchTap');
      $($('.retro-menu-item')[1]).simulate('click');

      expect('requireRetroLogin').toHaveBeenDispatchedWith({
        type: 'requireRetroLogin',
        data: {retro_id: '13'}
      });
    });
  });
});

function createRetro() {
  return {
    id: 13,
    name: 'the retro name',
    video_link: 'http://the/video/link',
    items: [
      {
        id: 1,
        description: 'the happy retro item',
        category: 'happy'
      },
      {
        id: 2,
        description: 'the meh retro item',
        category: 'meh'
      },
      {
        id: 3,
        description: 'the sad retro item',
        category: 'sad'
      }
    ],
    action_items: [
      {
        id: 1,
        description: 'action item 1',
        done: true,
      },
      {
        id: 2,
        description: 'action item 2',
        done: false,
      },
    ]
  };
}
