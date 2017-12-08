const React = require('react');
const types = React.PropTypes;

class TestimonialItem extends React.Component {
  static propTypes = {
    testimonial: types.object.isRequired
  };

  render() {
    const {testimonial} = this.props;
    return (
      <div className="row">
        <div className="columns">
          <div className="columns show-for-large">
            <div className="small-3 columns">
              <img className="circular-image float-right" src={testimonial.profileImage} style={{maxWidth: '150px'}}/>
            </div>
            <div className="small-8 columns">
              <div>{testimonial.description}</div>
              <div className="footnote">{testimonial.user}</div>
            </div>
            <div className="small-1 columns" />
          </div>

          <div className="columns hide-for-large">
            <div className="columns">
              <img className="circular-image" src={testimonial.profileImage} style={{maxWidth: '150px', marginBottom: '30px'}}/>
            </div>
            <div className="columns">
              <div>{testimonial.description}</div>
              <div className="footnote">{testimonial.user}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = TestimonialItem;