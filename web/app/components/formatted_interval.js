const React = require('react');

class FormattedInterval extends React.Component {

  static propTypes = {
    secondsRemaining: React.PropTypes.number.isRequired
  }

  formatInterval = () => {
    const {secondsRemaining} = this.props;
    let roundedSeconds = secondsRemaining|0;
    if (roundedSeconds < 0) {
      roundedSeconds = 0;
    }
    let minutes = (roundedSeconds / 60)|0;
    let seconds = roundedSeconds % 60;
    let stringSeconds = seconds+'';
    return minutes + ':' + '00'.substr(stringSeconds.length) + stringSeconds;
  };

  render = () => {
    return (
      <div className="formatted-interval">{this.formatInterval()}</div>
    );
  }
}

module.exports = FormattedInterval;