require('../spec_helper');
import RetroMenu from '../../../app/components/retro_menu';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

describe('RetroMenu', () => {
  let testCallback;

  beforeEach(() => {
    testCallback = jasmine.createSpy('testCallback');
    let menuItems = [
      {
        title: 'Menu Item 1', callback: testCallback
      },
      {
        title: 'Menu Item 2', callback: () => {}
      },
      {
        title: 'Menu Item 3', callback: () => {}, button: true
      },
    ];
    ReactDOM.render(<MuiThemeProvider><RetroMenu isMobile={false} items={menuItems}/></MuiThemeProvider>, root);
  });

  describe('within retro menu', () => {
    it('has the menu items', () => {
      $('.retro-menu button').simulate('touchTap');
      expect('.retro-menu-item').toHaveLength(3);
      expect($('.retro-menu-item')[0].innerHTML).toContainText('Menu Item 1');
      expect($('.retro-menu-item')[1].innerHTML).toContainText('Menu Item 2');

      // due to it being a button
      expect($('.retro-menu-item')[2].innerHTML).toEqual('Menu Item 3');
    });

    it('invokes the callback on click of menu item', function () {
      $('.retro-menu button').simulate('touchTap');
      $('.retro-menu-item').simulate('click');
      expect(testCallback).toHaveBeenCalled();
    });

    describe('when button is set to true', () => {
      it('displays the menu item as a button', () => {
        $('.retro-menu button').simulate('touchTap');
        expect($('button.retro-menu-item').length).toEqual(1);
      });
    });
  });
});
