require('../spec_helper');
import { MuiThemeProvider } from 'material-ui';
import RetroHeading from '../../../app/components/retro_heading';

describe('RetroHeading', () => {
  let retro;

  describe('Back Button', () => {
    describe('when on an archived retro', () => {
      beforeEach(() => {
        retro = createRetro();
        ReactDOM.render(
          <MuiThemeProvider>
            <RetroHeading retro={retro} retroId={'13'} archives={true} isMobile={false}/>
          </MuiThemeProvider>, root
        );
      });

      it('shows the back button', () => {
        expect('.retro-back').toExist();
      });
    });

    describe('when not on an archived retro', () => {
      beforeEach(() => {
        retro = createRetro();
        ReactDOM.render(
          <MuiThemeProvider>
            <RetroHeading retro={retro} retroId={'13'} archives={false} isMobile={false}/>
          </MuiThemeProvider>, root
        );
      });

      it('does not show the back button', () => {
        expect('.retro-back').not.toExist();
      });
    });
  });

  describe('Menu', () =>{
    describe('when a retro has archives', () => {
      describe('when on an archived retro', () => {
        beforeEach(() => {
          retro = createRetro();
          retro.items = [];
          retro.archives = [{id: 1}, {id: 2}, {id: 13}];
          ReactDOM.render(
            <MuiThemeProvider>
              <RetroHeading retro={retro} retroId={'13'} archives={true} isMobile={false}/>
            </MuiThemeProvider>, root
          );
          $('.retro-menu button').simulate('touchTap');
        });

        it('does not show the link to archive the retro', () => {
          expect($('.retro-menu-item')[0].innerHTML).not.toContainText('Archive this retro')
        });

        it('does not show the link to view archives', () => {
          expect($('.retro-menu-item')[0].innerHTML).not.toContainText('View archives')
        });
      });

      describe('when a retro has no retro items', () => {
        beforeEach(() => {
          retro = createRetro();
          retro.items = [];
          retro.archives = [{id: 1}, {id: 2}];
          ReactDOM.render(
            <MuiThemeProvider>
              <RetroHeading retro={retro} retroId={'13'} archives={false} isMobile={false}/>
            </MuiThemeProvider>, root
          );
          $('.retro-menu button').simulate('touchTap');
        });

        it('does not show the link to archive the retro', () => {
          expect($('.retro-menu-item')[0].innerHTML).not.toContainText('Archive this retro')
        });

        it('shows the link to view archives', () => {
          expect($('.retro-menu-item')[0].innerHTML).toContainText('View archives')
        });
      });

      describe('when a retro has retro items', () => {
        beforeEach(() => {
          retro = createRetro();
          retro.archives = [{id: 1}, {id: 2}];
          ReactDOM.render(
            <MuiThemeProvider>
              <RetroHeading retro={retro} retroId={'13'} archives={false} isMobile={false}/>
            </MuiThemeProvider>, root
          );
          $('.retro-menu button').simulate('touchTap');
        });

        // Uses toEqual as 'Archive this retro' returns a pure string as it is a button which behaves differently
        it('shows the link to archive the retro', () => {
          expect($('.retro-menu-item')[0].innerHTML).toEqual('Archive this retro')
        });

        it('dispatches showDialog when the archive link is clicked', () => {
          $('.retro-menu button').simulate('touchTap');
          $($('.retro-menu-item')[0]).simulate('click');

          expect('showDialog').toHaveBeenDispatchedWith(
            {
              type: 'showDialog',
              data: {
                title: 'You\'re about to archive this retro.',
                message: 'Are you sure?'
              }
            }
          );
        });

        it('shows the link to view archives', () => {
          expect($('.retro-menu-item')[1].innerHTML).toHaveText('View archives')
        });
      });

    });

    describe('when a retro has no archives', () => {
      describe('when a retro has no retro items', () => {
        beforeEach(() => {
          retro = createRetro();
          retro.items = [];

          ReactDOM.render(
            <MuiThemeProvider>
              <RetroHeading retro={retro} retroId={'13'} archives={false} isMobile={false}/>
            </MuiThemeProvider>, root
          );
          $('.retro-menu button').simulate('touchTap');
        });

        it('does not show the link to archive the retro', () => {
          expect($('.retro-menu-item')[0].innerHTML).not.toHaveText('Archive this retro')
        });

        it('does not show the link to view archives', () => {
          expect($('.retro-menu-item')[0].innerHTML).not.toHaveText('View archives')
        });
      });

      describe('when a retro has retro items', () => {
        beforeEach(() => {
          retro = createRetro();
          ReactDOM.render(
            <MuiThemeProvider>
              <RetroHeading retro={retro} retroId={'13'} archives={false} isMobile={false}/>
            </MuiThemeProvider>, root
          );
          $('.retro-menu button').simulate('touchTap');
        });

        // Uses toEqual as 'Archive this retro' returns a pure string as it is a button which behaves differently
        it('shows the link to archive the retro', () => {
          expect($('.retro-menu-item')[0].innerHTML).toEqual('Archive this retro')
        });

        it('dispatches showDialog when the archive link is clicked', () => {
          $('.retro-menu button').simulate('touchTap');
          $($('.retro-menu-item')[0]).simulate('click');

          expect('showDialog').toHaveBeenDispatchedWith(
            {
              type: 'showDialog',
              data: {
                title: 'You\'re about to archive this retro.',
                message: 'Are you sure?'
              }
            }
          );
        });

        it('does not show the link to view archives', () => {
          expect($('.retro-menu-item')[1].innerHTML).not.toHaveText('View archives')
        });
      });
    });

  });
});


function createRetro(isPrivate = false) {
  return {
    id: 13,
    name: 'the retro name',
    is_private: isPrivate,
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
