const React = require('react');
const {Factory} = require('rosie');
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


let globals;

beforeAll(() => {
  globals = {
    Factory,
    React
  };
  Object.assign(global, globals);
});

afterAll(() => {
  Object.keys(globals).forEach(key => delete global[key]);
});