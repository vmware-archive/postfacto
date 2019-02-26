import React from 'react';
import {mount} from 'enzyme';
import './spec_helper';

import EnhancedApplication from './Application';

describe('Application', () => {
  it('renders without crashing', () => {
    const api_base_url = 'https://example.com';
    const websocket_url = 'ws://websocket/url';
    const enable_analytics = false;

    global.Retro = {config: {api_base_url, enable_analytics}};

    const config = {
      title: 'Retro',
      api_base_url,
      websocket_url,
      enable_analytics,
      contact: '',
      terms: '',
      privacy: '',
    };

    const app = mount(<EnhancedApplication config={config}/>);
    expect(app).toExist();
    app.unmount();
  });
});
