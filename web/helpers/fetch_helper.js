require('isomorphic-fetch');
const {Actions} = require('p-flux');

module.exports = {
  fetchJson(url, {accessToken, headers, ...options} = {}) {
    const acceptHeaders = {accept: 'application/json', 'Content-Type': 'application/json'};
    const authorizationHeaders = accessToken ? {authorization: `Bearer ${accessToken}`} : {};
    options = {credentials: 'same-origin', headers: {...acceptHeaders, ...authorizationHeaders, ...headers}, ...options};
    return fetch(url, options)
      .then((response) => {
        if (response.status === 204) { return [response.status, '']; }
        return Promise.all([Promise.resolve(response.status), response.json()]);
      })
      .catch(() => {
        Actions.apiServerNotFound();
        return [];
      });
  }
};
