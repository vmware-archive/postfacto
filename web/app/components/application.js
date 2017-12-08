
require('babel-polyfill');
const Bootstrap = require('../bootstrap');
const React = require('react');
const types = React.PropTypes;
const {useStore} = require('p-flux');
const {useRouter} = require('./use_router');
const Router = require('./router');
const Header = require('./header');
const SegmentAnalytics = require('../../vendor/segment-analytics');
const Logger = require('../../helpers/logger');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

import SessionWebsocket from './session_websocket';

const muiTheme = getMuiTheme({
  fontFamily: 'Karla'
});

class Application extends React.Component {

  static propTypes = {
    config: types.object.isRequired,
    store: types.object.isRequired,
    router: types.oneOfType([types.object, types.func])
  };

  componentDidMount() {
    injectTapEventPlugin();
    const segment_key = global.Retro.config.segment_key;
    if (global.Retro.config.enable_analytics && segment_key) {
      SegmentAnalytics.load(segment_key);
    }
    /* can't be declared on top of the class - rollbar has references to window and is not ready before */
    require('../../vendor/rollbar.min').init(global.Retro.config.rollbar);
    Logger.info('Application started');
  }

  render() {
    const {config, store, router} = this.props;
    const {websocket_url} = config;
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="retro-application">
          <Header {...{config, ...store}}/>
          <Router {...{router, config, ...store}}/>
          <SessionWebsocket url={websocket_url}/>
        </div>
      </MuiThemeProvider>
    );
  }
}

const EnhancedApplication = useStore(useRouter(Application),
  {
    store: require('../store'),
    actions: [],
    dispatcherHandlers: [
      require('../dispatchers/main_dispatcher'),
      require('../dispatchers/api_dispatcher'),
      require('../dispatchers/analytics_dispatcher')
    ],
    /* eslint-disable no-console */
    onDispatch: (event) => {
      console.info('dispatching event', event);
    }
    /* eslint-enable no-console */
  }
);

Bootstrap.init(EnhancedApplication);

module.exports = EnhancedApplication;
