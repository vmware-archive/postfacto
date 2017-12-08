const React = require('react');
const types = React.PropTypes;
const RetroActionsColumnItem = require('./retro_actions_column_item');
const jQuery = require('jquery');

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

class RetroActionsColumn extends React.Component {
  static propTypes = {
    category: types.string.isRequired,
    retro: types.object.isRequired,
    retroId: types.string.isRequired,
    archives: types.bool,
  };

  renderActionItems() {
    const {category, archives, retro, retroId, retro: {action_items}} = this.props;
    let that = this;

    if (action_items) {
      return action_items
        .filter(function (action_item) {
          if (archives) {
            return category === 'current';
          }
          let createdAt = new Date(action_item.created_at);
          let lastWeekDate = that.getDateOfLatestItemThatIsNotToday();

          if (category === 'current') {
            return that.isToday(createdAt);
          }

          if (!lastWeekDate) {
            return false;
          }
          if (category === 'last-week') {
            return that.isSameDate(lastWeekDate, createdAt);
          }
          return createdAt < lastWeekDate;
        })
        .sort(function (a, b) {
          return b.created_at <= a.created_at ? -1 : 1;
        })
        .map(function (action_item) {
          return (
            <RetroActionsColumnItem key={action_item.id} retro={retro} retroId={retroId} action_item={action_item} archives={archives}/>
          );
        });
    }
  }

  isToday(createdAt) {
    const date = new Date(Date.now());
    return this.isSameDate(createdAt, date);
  }

  isSameDate(a, b) {
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }

  renderCurrentDateString() {
    let date = new Date(Date.now());
    return monthNames[date.getMonth()] + ' ' + date.getDate();
  }

  renderLastWeekDateString() {
    let date = this.getDateOfLatestItemThatIsNotToday();
    if (date) {
      return monthNames[date.getMonth()] + ' ' + date.getDate();
    }
    return '';
  }

  getDateOfLatestItemThatIsNotToday() {
    const {retro: {action_items}} = this.props;
    let that = this;
    let timestamps = new Set();
    jQuery.each(action_items, function (_, action_item) {
      if(action_item.created_at) {
        let date = new Date(action_item.created_at);
        if (date && !that.isToday(date)) {
          const thing = date.setHours(0, 0, 0, 0);
          timestamps.add(thing);
        }
      }
    });
    if (!timestamps.size) {
      return null;
    }
    let orderedTimestamps = Array.from(timestamps).sort(function (a, b) {
      return b - a;
    });

    return new Date(orderedTimestamps[0]);
  }

  renderDate() {
    const {category, archives} = this.props;
    if (category === 'current') {
      if (archives) {
        return 'Completed action items';
      }
      return 'Today (' + this.renderCurrentDateString() + ')';
    }

    if (category === 'last-week') {
      return this.renderLastWeekDateString();
    }
    return archives ? '' : 'Older';
  }

  render() {
    const {category} = this.props;
    return (
      <div className={'retro-actions-' + category}>
        <div className="retro-action-list-header">
          {
            this.renderDate()
          }
        </div>
        {
          this.renderActionItems()
        }
      </div>
    );
  }

}

module.exports = RetroActionsColumn;
