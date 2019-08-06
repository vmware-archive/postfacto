import React from 'react';
import {mount} from 'enzyme';
import './spec_helper';

import EnhancedApplication from './Application';
import SessionWebsocket from './components/session_websocket';

describe('Application', () => {
  const websocket_url = 'ws://websocket/url';

  it('renders without crashing', () => {
    const api_base_url = 'https://example.com';
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

  it('passes the URL to the websocket', () => {
    const config = {websocket_url, websocket_port: 1111};

    const app = mount(<EnhancedApplication config={config}/>);

    expect(app.find(SessionWebsocket).prop('url')).toBe('ws://websocket:1111/url');
  });
});
