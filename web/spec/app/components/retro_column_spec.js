require('../spec_helper');

const RetroColumn = require('../../../app/components/retro_column');
const retro = {
  id: 123,
  name: 'the retro name',
  video_link: 'http://the/video/link',
  items: [
    {
      id: 1,
      description: 'the happy retro item',
      category: 'happy',
      created_at: '2016-07-19T00:00:00.000Z',
      vote_count: 10
    },
    {
      id: 2,
      description: 'the 2nd happy retro item',
      category: 'happy',
      created_at: '2016-07-18T00:00:00.000Z',
      vote_count: 9
    },
    {
      id: 3,
      description: 'the meh retro item',
      category: 'meh'
    },
    {
      id: 4,
      description: 'the sad retro item',
      category: 'sad'
    },
  ]
};
describe('RetroColumn', () => {
  beforeEach(() => {
    ReactDOM.render(<RetroColumn retro={retro} retroId={'retro-slug-123'} category="happy" isMobile={false}/>, root);
  });

  describe('creating a retro', () => {
    it('column has all its items', () => {
      expect($('.column-happy .retro-item-add-input').attr('placeholder')).toEqual('I\'m glad that...');
      expect('.column-happy .retro-item').toHaveLength(2);
    });
  });

  it('should order items by time', () => {
    expect($('.column-happy .retro-item .item-text').get(0).innerText).toEqual('the happy retro item');
    expect($('.column-happy .retro-item .item-text').get(1).innerText).toEqual('the 2nd happy retro item');
  });

});
