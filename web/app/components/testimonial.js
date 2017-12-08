const React = require('react');
const TestimonialItem = require('./testimonial_item');
const Slider = require('react-slick');

class Testimonial extends React.Component {
  render() {
    const testimonials = [{
      'user': 'Venkatesh Arunachalam - Pivotal Labs',
      'description': 'Postfacto has made our retrospectives extremely efficient. We have consistently seen the time taken reduce by close to 50% and we have always covered all the items listed.',
      'profileImage': require('../images/testimonial-venki.jpg')
    }, {
      'user': 'Mike Salway - RP Data Professional, CoreLogic',
      'description': 'We used Postfacto during the Pivotal CoreLogic engagement. ' +
      'I found it to be a great tool to help run smooth retros. ' +
      'The Postfacto team have been very responsive to feedback and ideas for improvement and each week it’s getting better and better. ' +
      'The use of the mobile app allows participants to add items quickly and easily, and the facilitator can keep things moving on time with the use of the timer. ' +
      'We’ve also found it handy to run retros with team members participating remotely, as the instant updating of information allows everyone to see the same screen immediately.',
      'profileImage': require('../images/testimonial-mike.jpg')
    }];

    let settings = {
      dots: true,
      infinite: true,
      speed: 500,
      autoplaySpeed: 6000,
      slidesToShow: 1,
      arrows: false,
      slidesToScroll: 1,
      autoplay: true,
      pauseOnHover: true,
    };

    let components = testimonials.map( testimonial => {
      return (
        <div key={testimonial.user}>
          <TestimonialItem testimonial={testimonial}/>
        </div>
      );
    });

    return (
      <div>
        <div className="row">
          <div className="columns testimonials">
            <h3>Testimonials</h3>
          </div>
        </div>
        <div>
          <Slider {...settings}>
            {components}
          </Slider>
        </div>
      </div>
    );
  }
}

module.exports = Testimonial;
