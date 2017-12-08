require('../spec_helper');

describe('HomePage', () => {
  describe('When page loaded', () => {
    beforeEach(() => {
      const HomePage = require('../../../app/components/home_page');
      ReactDOM.render(<HomePage />, root);
    });

    it('dispatches showHomePageAnalytics action when home page is loaded', () => {
      expect('showHomePageAnalytics').toHaveBeenDispatched();
    });
  });

  describe('when country code is in EU', () => {
    beforeEach(() => {
      const HomePage = require('../../../app/components/home_page');
      ReactDOM.render(<HomePage countryCode="DE"/>, root);
    });

    it('shows the cookies banner', () => {
      expect('.banner').toContainText('use of cookies');
    });
  });

  describe('when country code is not in EU', () => {
    beforeEach(() => {
      const HomePage = require('../../../app/components/home_page');
      ReactDOM.render(<HomePage countryCode="US"/>, root);
    });

    it('does not shows the cookies banner', () => {
      expect('.banner').not.toExist();
    });
  });
});
