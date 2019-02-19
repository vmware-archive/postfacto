import React from 'react';
import ReactDOM from 'react-dom';
import EnhancedApplication from './Application';

it('renders without crashing', () => {
  const config = {title: 'Retro', api_base_url: 'https://example.com', websocket_url: 'ws://websocket/url'};
  global.Retro = {config};

  const div = document.createElement('div');
  ReactDOM.render(<EnhancedApplication config={config} store={{}} router={{}}/>, div);

  return Promise.resolve().then(() => { // wait for promises to resolve
    ReactDOM.unmountComponentAtNode(div);
  });
});
