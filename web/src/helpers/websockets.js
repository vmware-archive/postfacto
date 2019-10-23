// eslint-disable-next-line import/prefer-default-export
export const websocketUrl = (config) => {
  if (config.websocket_port) {
    const a = document.createElement('a');
    a.href = config.websocket_url;
    a.port = config.websocket_port;
    return a.href;
  }
  return config.websocket_url;
};
