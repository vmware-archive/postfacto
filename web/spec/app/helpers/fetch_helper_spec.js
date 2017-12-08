require('../spec_helper');

const {fetchJson} = require('../../../helpers/fetch_helper');

describe('fetchJson', () => {
  describe('errors', () => {
    it('returns empty array', () => {
      spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('some error')));
      fetchJson('http://example.com/some-url')
        .then((results) => {
          expect(results).toEqual([]);
        });

      MockPromises.tickAllTheWay();
    });

    it('dispatches apiServerNotFound', () => {
      spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('some error')));
      fetchJson('http://example.com/some-url');
      MockPromises.tickAllTheWay();
      expect('apiServerNotFound').toHaveBeenDispatched();
    });
  });

  describe('HTTP 204 no content', () => {
    it('returns the status code and empty response string', () => {
      fetchJson('http://example.com/some-url')
        .then((results) => {
          expect(results).toEqual([204, '']);
        });

      const request = jasmine.Ajax.requests.mostRecent();
      request.noContent();
      MockPromises.tickAllTheWay();
    });

    it('does not dispatch apiServerNotFound', () => {
      fetchJson('http://example.com/some-url');
      const request = jasmine.Ajax.requests.mostRecent();
      request.noContent();
      MockPromises.tickAllTheWay();
      expect('apiServerNotFound').not.toHaveBeenDispatched();
    });
  });

});
