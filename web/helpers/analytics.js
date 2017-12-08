class Analytics {

  static track(event, options) {
    options = options || {};
    if (typeof analytics !== 'undefined') {
      options.timestamp = (new Date()).toJSON();
      analytics.track(event, options);
    }
  }

}

module.exports = Analytics;
