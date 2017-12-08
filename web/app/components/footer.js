const React = require('react');

class Footer extends React.Component {

  render() {
    return (
      <div className="footer ">
          <span className="links">
              <a href={global.Retro.config.contact}>Contact Us</a>
              <a target="_blank" href={global.Retro.config.terms}>Terms & Conditions</a>
              <a target="_blank" href={global.Retro.config.privacy}>Privacy Policy</a>
          </span>
      </div>
    );
  }
}

module.exports = Footer;
