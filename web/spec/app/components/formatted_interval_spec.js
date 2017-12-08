require('../spec_helper');

describe('FormattedInterval', () => {
  const FormattedInterval = require('../../../app/components/formatted_interval');

  it('should render the time remaining', () => {
    ReactDOM.render(<FormattedInterval secondsRemaining={65} />, root);
    expect('.formatted-interval').toHaveText('1:05');
  });

  it('uses rounded seconds', () => {
    ReactDOM.render(<FormattedInterval secondsRemaining={65.2}/>, root);
    expect('.formatted-interval').toHaveText('1:05');
  });

  it('shows zero correctly', () => {
    ReactDOM.render(<FormattedInterval secondsRemaining={0} />, root);
    expect('.formatted-interval').toHaveText('0:00');
  });

  it('shows zero when secondsRemaining is negative', () => {
      ReactDOM.render(<FormattedInterval secondsRemaining={-10} />, root);
      expect('.formatted-interval').toHaveText('0:00');
  });
});