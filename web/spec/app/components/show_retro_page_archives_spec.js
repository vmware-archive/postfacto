require('../spec_helper');
const ShowRetroPage = require('../../../app/components/show_retro_page');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

describe('Show retro page archives', () => {
  let retro_archives = {
    id: 13,
    name: 'retro name',
    send_archive_email: true,
    items: [
      {
        id: 2,
        description: 'archived item 1',
        vote_count: 1,
        done: false,
        category: 'happy',
        archived_at: '2016-07-18T00:00:00.000Z',
        created_at: '2016-07-11T00:00:00.000Z',
      },
      {
        id: 3,
        description: 'archived item 3',
        vote_count: 2,
        done: true,
        category: 'sad',
        archived_at: '2016-07-20T00:00:00.000Z',
        created_at: '2016-07-11T00:00:00.000Z',
      },
    ],
    action_items: [
      {
        id: 1,
        description: 'archived action 1',
        archived_at: '2016-07-18T00:00:00.000Z',
        created_at: '2016-07-11T00:00:00.000Z',
      },
      {
        id: 2,
        description: 'archived action 2',
        archived_at: '2016-07-20T00:00:00.000Z',
        created_at: '2016-07-11T00:00:00.000Z',
      },
    ]
  };

  describe('on desktop', () => {
    let originalGetIsMobile;
    beforeEach(() => {
      originalGetIsMobile = ShowRetroPage.prototype.getIsMobile;
      ShowRetroPage.prototype.getIsMobile = () => false;

      ReactDOM.render(
        <MuiThemeProvider>
          <ShowRetroPage retro_archives={retro_archives}
                         retroId={'13'}
                         archives={true}
                         retro={retro_archives}
                         config={global.Retro.config}
                         featureFlags={ { archiveEmails: true } }/>
        </MuiThemeProvider>, root);
    });
    afterEach(() => {
      ShowRetroPage.prototype.getIsMobile = originalGetIsMobile;
    });

    it('should render archived items', () => {
      expect('.retro-back').toContainText('Archives');
      expect($('.column-sad .item-text')[0].innerHTML).toContainText('archived item 3');
      expect($('.retro-action .action-text')[0].innerHTML).toEqual('archived action 2');
    });

    it('should not have a delete or input', () => {
      expect('.action-delete').toHaveLength(0);
      expect('input').toHaveLength(0);
    });

    it('should redirect to list archives page of current retro when clicking Archived retros', () => {
      $('.retro-back').simulate('touchTap');
      expect('routeToRetroArchives').toHaveBeenDispatchedWith({
        type: 'routeToRetroArchives',
        data: {retro_id: '13'}
      });
    });

    describe('when user is signed in', () => {
      beforeEach(() => {
        window.localStorage.setItem('authToken', 'some-token');
        ReactDOM.render(
          <MuiThemeProvider>
            <ShowRetroPage retro_archives={retro_archives}
                           retroId={'13'}
                           archives={true}
                           retro={retro_archives}
                           config={global.Retro.config}
                           featureFlags={ { archiveEmails: true } }/>
          </MuiThemeProvider>, root);
      });

      afterEach(() => {
        window.localStorage.clear();
      });

      it('should have menu', () => {
        expect('.retro-menu').toHaveLength(1);
      });

      it('should have sign out menu item', () => {
        $('.retro-menu button').simulate('touchTap');
        expect($('.retro-menu-item').last()).toContainText('Sign out');
      });
    });

  });


  describe('on mobile', () => {
    let originalGetIsMobile;
    beforeEach(() => {
      originalGetIsMobile = ShowRetroPage.prototype.getIsMobile;
      ShowRetroPage.prototype.getIsMobile = () => true;

      ReactDOM.render(
        <MuiThemeProvider>
          <ShowRetroPage retro_archives={retro_archives}
                         retroId={'13'}
                         archives={true}
                         retro={retro_archives}
                         config={global.Retro.config}
                         featureFlags={ { archiveEmails: true } }/>
        </MuiThemeProvider>, root);
    });

    afterEach(() => {
      ShowRetroPage.prototype.getIsMobile = originalGetIsMobile;
    });

    it('should not have menu', () => {
      expect('.retro-menu').toHaveLength(0);
    });

    it('should redirect to list archives page when clicking back', () => {
      $('.retro-back').simulate('touchTap');
      expect('routeToRetroArchives').toHaveBeenDispatchedWith({
        type: 'routeToRetroArchives',
        data: {retro_id: '13'}
      });
    });
  });
});
