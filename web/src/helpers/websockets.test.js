import {websocketUrl} from './websockets';

describe('websocketUrl', () => {
  const path = '/path/to/hell';

  describe('without an explicit port', () => {
    it('returns the websocket_url', () => {
      expect(websocketUrl({websocket_url: path})).toEqual(path);
    });
  });

  describe('with an explicit port', () => {
    const port = 4321;

    it('includes the port in the url', () => {
      const config = {websocket_url: path, websocket_port: port};

      const websocketUrlResult = websocketUrl(config);

      expect(websocketUrlResult).toMatch(new RegExp(`:${port}${path}$`));
    });
  });
});
