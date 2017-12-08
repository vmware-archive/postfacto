require('../spec_helper');
const Testimonial = require('../../../app/components/testimonial');

describe('Testimonial', () => {
  beforeEach(() => {
    ReactDOM.render(<Testimonial />, root);
  });

  it('renders all testimonial descriptions', () => {
    expect('#root').toContainText('Testimonials');
    expect('#root').toContainText('Venkatesh Arunachalam - Pivotal Labs');
    expect('#root').toContainText('Postfacto has made our retrospectives extremely efficient. We have consistently seen the time taken reduce by close to 50% and we have always covered all the items listed.');
    
    expect('#root').toContainText('Mike Salway - RP Data Professional, CoreLogic');
    expect('#root').toContainText('We used Postfacto during the Pivotal CoreLogic engagement. ' +
      'I found it to be a great tool to help run smooth retros. ' +
      'The Postfacto team have been very responsive to feedback and ideas for improvement and each week it’s getting better and better. ' +
      'The use of the mobile app allows participants to add items quickly and easily, and the facilitator can keep things moving on time with the use of the timer. ' +
      'We’ve also found it handy to run retros with team members participating remotely, as the instant updating of information allows everyone to see the same screen immediately.');
  });
});
