/*
 * Postfacto, a free, open-source and self-hosted retro tool aimed at helping
 * remote teams.
 *
 * Copyright (C) 2016 - Present Pivotal Software, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 *
 * it under the terms of the GNU Affero General Public License as
 *
 * published by the Free Software Foundation, either version 3 of the
 *
 * License, or (at your option) any later version.
 *
 *
 *
 * This program is distributed in the hope that it will be useful,
 *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *
 * GNU Affero General Public License for more details.
 *
 *
 *
 * You should have received a copy of the GNU Affero General Public License
 *
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import deepEqual from 'fast-deep-equal';

function urlMatches(url, pattern) {
  if (pattern.indexOf('://') !== -1) {
    return url === pattern;
  }
  const path = url.substr(url.indexOf('/', url.indexOf('://') + 3));
  return path === pattern;
}

function asLowercaseKeys(o = {}) {
  const result = {};
  Object.keys(o).forEach((key) => {
    result[key.toLowerCase()] = o[key];
  });
  return result;
}

function optionMismatch(options, key, pattern) {
  switch (key) {
    case 'method':
      return ((options.method || 'GET') === pattern) ? null : 'method does not match';

    case 'data':
      return deepEqual(JSON.parse(options.body), pattern) ? null : 'body does not match';

    case 'headers': {
      const actual = asLowercaseKeys(options.headers);
      const expected = asLowercaseKeys(pattern);

      const headerMismatches = Object.keys(expected)
        .filter((header) => (actual[header] !== expected[header]))
        .join(', ');

      return headerMismatches === '' ? null : `header ${headerMismatches} does not match`;
    }
    default:
      throw new Error(`Unsupported request matcher: ${key}`);
  }
}

class MockRequest {
  constructor(input, init) {
    this.capturedInput = input;
    this.capturedInit = init;

    this.responsePromise = new Promise((resolve, reject) => {
      this.capturedResolve = resolve;
      this.capturedReject = reject;
    });
  }

  matches(urlPattern, optionsPattern) {
    return this.mismatchInfo(urlPattern, optionsPattern) === null;
  }

  mismatchInfo(urlPattern, optionsPattern = {}) {
    if (!urlMatches(this.capturedInput, urlPattern)) {
      return 'URL does not match';
    }

    const optionMismatches = Object.keys(optionsPattern)
      .map((key) => optionMismatch(this.capturedInit, key, optionsPattern[key]))
      .filter((message) => (message !== null))
      .join('; ');

    return optionMismatches === '' ? null : optionMismatches;
  }

  resolve(body, init = {}) {
    if (body instanceof Response) {
      this.capturedResolve(body);
    } else {
      this.capturedResolve(new Response(body, init));
    }
  }

  reject(error) {
    this.capturedReject(error);
  }

  resolveJsonStatus(status, data = {}, init = {}) {
    this.resolve(JSON.stringify(data), Object.assign({status}, init));
  }

  ok(data = {}, init = {}) {
    this.resolveJsonStatus(200, data, init);
  }

  noContent(init = {}) {
    this.resolve(null, Object.assign({status: 204}, init));
  }

  forbidden(data = {}, init = {}) {
    this.resolveJsonStatus(403, data, init);
  }

  notFound(data = {}, init = {}) {
    this.resolveJsonStatus(404, data, init);
  }

  toString() {
    return `'${this.capturedInput}' ${JSON.stringify(this.capturedInit)}`;
  }
}

class MockFetch {
  constructor() {
    this.requests = [];
  }

  mockFetch = (input, init) => {
    const request = new MockRequest(input, init);
    this.requests.push(request);
    return request.responsePromise;
  };

  install() {
    this.requests.length = 0;
    jest.spyOn(window, 'fetch').mockImplementation(this.mockFetch);
  }

  uninstall() {
    window.fetch.mockRestore();
    this.requests.length = 0;
  }

  allRequests() {
    return this.requests;
  }

  requestsTo(url, options = {}) {
    return this.requests.filter((request) => request.matches(url, options));
  }

  latestRequest() {
    const count = this.requests.length;
    if (count === 0) {
      return null;
    }
    return this.requests[count - 1];
  }
}

expect.extend({
  toHaveRequested(mockFetch, url, options = {}) {
    const observed = mockFetch.requestsTo(url, options);
    const expectedInfo = `'${url}' ${JSON.stringify(options)}`;

    if (observed.length === 0) {
      const mismatchInfo = mockFetch.allRequests()
        .map((request) => `  ${request.toString()} - ${request.mismatchInfo(url, options)}`)
        .join('\n');

      return {
        pass: false,
        message: () => `Expected request matching:\n  ${expectedInfo}\nsaw:\n${mismatchInfo}`,
      };
    }

    const observedInfo = observed
      .map((request) => `  ${request.toString()}`)
      .join('\n');

    return {
      pass: true,
      message: () => `Expected no requests matching:\n  ${expectedInfo}\nsaw:\n${observedInfo}`,
    };
  },
});

export default new MockFetch();
