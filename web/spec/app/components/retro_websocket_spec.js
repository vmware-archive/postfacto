require('../spec_helper');

describe('RetroWebsocket', () => {
  const RetroWebsocket = require('../../../app/components/retro_websocket');

  describe('rendering a RetroWebsocket', () => {
    
    describe('when websocket url has been fetched', () => {
      let webSocketDOM;
      beforeEach(() => {
        webSocketDOM = ReactDOM.render(<RetroWebsocket url="wss://websocket/url" retro_id={'retro-slug-123'}/>, root);
      });

      it('should create setup cable', () => {
        const {cable} = webSocketDOM.state;
        expect(cable.url).toEqual('wss://websocket/url');
      });
    });
  });
});
