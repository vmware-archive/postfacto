const React = require('react');
const types = React.PropTypes;
const {Actions} = require('p-flux');
const FormattedInterval = require('./formatted_interval');

class CountdownTimer extends React.Component {
  static propTypes = {
    retroId: types.string.isRequired,
    endTimestampInMs: types.number.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      remainingTimeInMs: 0,
      interval: null
    };
  }

  componentDidMount() {
    this.startTimer();
  }

  componentWillReceiveProps() {
    this.startTimer();
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  getCurrentTimestampInMs = () => {
    return Date.now();
  };

  startTimer = () => {
    clearInterval(this.state.interval);
    this.setState({
      interval: setInterval(this.updateRemainingTime, 500),
      remainingTimeInMs: this.getRemainingTimeInMs()
    });
  };

  getRemainingTimeInMs = () => {
    return Math.max(this.props.endTimestampInMs - this.getCurrentTimestampInMs(), 0);
  };

  updateRemainingTime = () => {
    let remainingTimeInMs = this.getRemainingTimeInMs();
    this.setState({remainingTimeInMs: remainingTimeInMs});
    if (remainingTimeInMs <= 0) {
      clearInterval(this.state.interval);
    }
  };

  onExtendTimerClicked(event) {
    const {retroId} = this.props;
    Actions.extendTimer({retro_id: retroId});
    event.stopPropagation();
  }

  renderTimerInformation() {
    if (this.state.remainingTimeInMs <= 0) {
      return (
        <div>
          <div className="retro-item-timer">
            <div className="retro-item-timer-extend"
                 onClick={this.onExtendTimerClicked.bind(this)}>
              <span className="item-times-up">Time's Up!</span>
              <br />
              +2 more minutes
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="retro-item-timer">
        <div className="retro-item-timer-clock"><FormattedInterval secondsRemaining={this.state.remainingTimeInMs/1000} /></div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderTimerInformation()}
      </div>
    );
  }
}
module.exports = CountdownTimer;
