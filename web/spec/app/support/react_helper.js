const TestUtils = require('react-addons-test-utils');
const jQuery = require('jquery');

(function($) {
  $.fn.simulate = function(eventName, ...args) {
    if (!this.length) {
      throw new Error(`jQuery Simulate has an empty selection for '${this.selector}'`);
    }
    if (eventName === null || typeof eventName === 'undefined') {
      throw new Error('Specify an event name');
    }
    $.each(this, function() {
      if (['mouseOver', 'mouseOut'].includes(eventName)) {
        TestUtils.SimulateNative[eventName](this, ...args);
      } else {
        TestUtils.Simulate[eventName](this, ...args);
      }
    });
    return this;
  };
})(jQuery);
