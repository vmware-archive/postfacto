require('../spec_helper');

describe('Alert', () => {
  const Alert = require('../../../app/components/alert');
  let component;

  describe('when message is empty', () => {
    beforeEach(() => {
      ReactDOM.render(<Alert alert={null} />, root);
    });

    it('should render nothing', () => {
      expect('.alert').toHaveLength(0);
    });
  });

  describe('when message is not empty', () => {
    beforeEach(() => {
      let alert = {
        message: 'Alert Message',
        linkMessage: 'Link Message',
        linkUrl: 'http://url/',
      };
      ReactDOM.render(<Alert alert={alert} />, root);
    });

    it('should render alert', () => {
      expect('.alert .alert__text').toContainText('Alert Message');
      expect('.alert .alert__link').toContainText('Link Message');
    });

    it('should remove alert after 3.5 seconds by default', () =>{
      jasmine.clock().tick(3499);
      expect('hideAlert').not.toHaveBeenDispatched();

      jasmine.clock().tick(2);
      expect('hideAlert').toHaveBeenDispatched();
    });
  });

  describe('when a duration has been specified', () => {
    beforeEach(() => {
      let alert = {
        message: 'Alert Message',
        linkMessage: 'Link Message',
        linkUrl: 'http://url/',
        duration: 10000
      };
      ReactDOM.render(<Alert alert={alert}/>, root);
    });

    it('should remove alert after X seconds by default', () => {
      jasmine.clock().tick(9999);
      expect('hideAlert').not.toHaveBeenDispatched();

      jasmine.clock().tick(2);
      expect('hideAlert').toHaveBeenDispatched();
    });
  });

  describe('when the alert is set to sticky', () => {
    beforeEach(() => {
      let alert = {
        message: 'Alert Message',
        linkMessage: 'Link Message',
        linkUrl: 'http://url/',
        sticky: true,
        duration: 500,
      };
      ReactDOM.render(<Alert alert={alert}/>, root);
    });

    it('should not remove the alert', () => {
      jasmine.clock().tick(501);
      expect('hideAlert').not.toHaveBeenDispatched();
    });
  });

  describe('when the checkIcon is set to true', () => {
    beforeEach(() => {
      let alert = {
        message: 'Alert Message',
        checkIcon: true,
        sticky: true,
      };
      ReactDOM.render(<Alert alert={alert}/>, root);
    });

    it('displays the check icon', () => {
      expect('.alert i.fa-check').toHaveLength(1);
    });
  });

  describe('when the checkIcon is set to false', () => {
    beforeEach(() => {
      let alert = {
        message: 'Alert Message',
        checkIcon: false,
        sticky: true,
      };
      ReactDOM.render(<Alert alert={alert}/>, root);
    });

    it('displays the check icon', () => {
      expect('.alert i.fa-check').toHaveLength(0);
    });
  });

  describe('when component is updated', () => {
    let renderAlert = (alert) => {
      return ReactDOM.render(<Alert alert={alert} />, root);
    };

    beforeEach(() => {
      let alert = {
        message: 'Alert Message',
        linkMessage: 'Link Message',
        linkUrl: 'http://url/',
        sticky: false,
      };
      component = renderAlert(alert);
    });

    describe('and alert is not null', () => {
      it('should render alert', () => {
        expect('.alert .alert__text').toContainText('Alert Message');
        expect('.alert .alert__link').toContainText('Link Message');
      });

      it('should remove alert after 3.5 seconds by default', () =>{
        jasmine.clock().tick(3499);
        expect('hideAlert').not.toHaveBeenDispatched();

        jasmine.clock().tick(2);
        expect('hideAlert').toHaveBeenDispatched();
      });
    });

    describe('and alert is null', () => {
      it('resets timeout to null', () => {
        expect(component.timeout).toBeDefined();
        renderAlert(null);
        expect(component.timeout).toBeNull();
      });
    });
  });
});
