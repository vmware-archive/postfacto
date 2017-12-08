require('../spec_helper');

describe('Header', () => {
  const Header = require('../../../app/components/header');

  let retro = {
    name: 'My Retro Name'
  };

  let config = {
    title: 'Retro Title'
  };

  describe('when retro is available', () => {
    beforeEach(() => {
      ReactDOM.render(<Header retro={retro} config={config}/>, root);
    });
    it('should set the document title', () => {
      expect(document.title).toEqual('My Retro Name - Retro Title');
    });
  });

  describe('when retro is unavailable', () => {
    beforeEach(() => {
      ReactDOM.render(<Header retro={{name: ''}} config={config}/>, root);
    });
    it('should set the document title', () => {
      expect(document.title).toEqual('Retro Title');
    });
  });

});