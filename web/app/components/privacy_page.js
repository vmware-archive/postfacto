const React = require('react');

class PrivacyPage extends React.Component {
    componentWillMount() {
        window.location = 'https://pivotal.io/privacy-policy';
    };

    render() {
        return null;
    }
}

module.exports = PrivacyPage;