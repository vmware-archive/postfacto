const Analytics = require('../../helpers/analytics');

const AnalyticsDispatcher = {
  createdRetroAnalytics({data}) {
    Analytics.track('Created Retro', {'retroId': data.retroId});
  },
  visitedRetroAnalytics({data}) {
    Analytics.track('Retro visited', {'retroId': data.retroId});
  },
  createdRetroItemAnalytics({data}) {
    Analytics.track('Created Retro Item', {'retroId': data.retroId, 'category': data.category});
  },
  completedRetroItemAnalytics({data}) {
    Analytics.track('Completed Retro Item', {'retroId': data.retroId, 'category': data.category});
  },
  createdActionItemAnalytics({data}) {
    Analytics.track('Created Action Item', {'retroId': data.retroId});
  },
  doneActionItemAnalytics({data}) {
    Analytics.track('Done Action Item', {'retroId': data.retroId});
  },
  undoneActionItemAnalytics({data}) {
    Analytics.track('Undone Action Item', {'retroId': data.retroId});
  },
  archivedRetroAnalytics({data}) {
    Analytics.track('Archived Retro', {'retroId': data.retroId});
  },
  showHomePageAnalytics() {
    Analytics.track('Loaded homepage');
  },
  userSignedUpAnalytics({data: {email}}) {
    Analytics.track('User Signed Up', {userEmail: email});
  }
};

module.exports = AnalyticsDispatcher;
