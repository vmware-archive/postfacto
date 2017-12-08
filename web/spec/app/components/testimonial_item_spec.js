require('../spec_helper');
const TestimonialItem = require('../../../app/components/testimonial_item');

describe('TestimonialItem', () => {
  let testimonial;
  beforeEach(() => {
    testimonial = {
      profileImage: 'http://profile/image.png',
      description: 'Some description',
      user: 'Test user'
    };
    ReactDOM.render(<TestimonialItem testimonial={testimonial} />, root);
  });

  it('renders the testimonial content and image', () => {
    expect('#root').toContainText('Some description');
    expect('#root img:eq(0)').toHaveAttr('src', 'http://profile/image.png');
    expect('#root').toContainText('Test user');
  });
});
