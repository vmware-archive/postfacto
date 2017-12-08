require('../spec_helper');

describe('CountdownTimer', () => {
  const CountdownTimer = require('../../../app/components/countdown_timer');

  beforeEach(() => {
    let baseDate = new Date();
    baseDate.setTime(0);
    jasmine.clock().mockDate(baseDate);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  describe('when end time in the future', () => {
    beforeEach(() => {
      let FOUR_MINS_FIVE_SECS = 245000;
      ReactDOM.render(<CountdownTimer endTimestampInMs={FOUR_MINS_FIVE_SECS} retroId={'retro-slug-123'}/>, root);
    });

    it('renders a formatted time component', () => {
      expect('.retro-item-timer-clock .formatted-interval').toExist();
      expect('.retro-item-timer-clock .formatted-interval').toHaveText('4:05');
    });

    it('updates remaining time when time ticks', () => {
      jasmine.clock().tick(1000);
      expect('.retro-item-timer-clock .formatted-interval').toHaveText('4:04');
    });
  });

  describe('when end time in the past', () => {
    beforeEach(() => {
      ReactDOM.render(<CountdownTimer endTimestampInMs={0} retroId={'retro-slug-123'}/>, root);
    });

    it('displays +2 more minutes and Time\'s Up!', () => {
      expect('.retro-item-timer-extend').toHaveText('Time\'s Up!+2 more minutes');
      expect($('.retro-item-timer-clock').length).toEqual(0);
    });

    describe('when clicking on extend Timer', () => {
      it('adds 2 more minutes to endTime', () => {
        $('.retro-item-timer-extend').simulate('click');
        expect('extendTimer').toHaveBeenDispatchedWith({type: 'extendTimer', data: {retro_id: 'retro-slug-123'}});
      });
    });
  });
});