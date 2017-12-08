require('../../spec_helper');

import {MuiThemeProvider} from 'material-ui';

const ListRetrosPage = require('../../../../app/components/connected/list_retros_page.js');

describe('List Retros Page', () => {
  let retros;

  beforeEach(() => {
    retros = createRetros(2);
  });

  it('should show multiple retros', () => {
    ReactDOM.render(<MuiThemeProvider><ListRetrosPage retros={retros}/></MuiThemeProvider>, root);

    expect('.retro-list-tile').toHaveLength(2)
  });

  it('should have a link to show retro page', () => {
    ReactDOM.render(<MuiThemeProvider><ListRetrosPage retros={retros}/></MuiThemeProvider>, root);

    $('.retro-list-tile:eq(0)').click();
    expect('routeToShowRetro').toHaveBeenDispatched();
  });

});

function createRetros(count = 1) {
  const retros = [];

  for (let x = 0; x < count; x++) {
    retros.push({
      id: 13 + x,
      name: `the retro name ${x + 1}`,
      slug: `slug-${x + 1}`,
      is_private: false,
      video_link: 'http://the/video/link',
      send_archive_email: false,
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
    });
  }

  return retros;
}