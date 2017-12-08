const RetroTile = require('../../../../app/components/pure/retro_tile.js');

describe('Retro Tile', () => {
  const retro = {
    name: 'Cool Retro',
    slug: 'cool-retro'
  };

  it('should show a retro name', () => {
    ReactDOM.render(<RetroTile retro={retro}/>, root);
    expect('.retro-list-tile').toContainText('Cool Retro')
  });

  it('should call the callback when clicked', () => {
    const callbackFn = jasmine.createSpy('callbackFn');

    ReactDOM.render(<RetroTile retro={retro} callback={callbackFn}/>, root);
    $('.retro-list-tile').click();
    expect(callbackFn).toHaveBeenCalled();
  });

});