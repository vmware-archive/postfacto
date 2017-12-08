const {Actions} = require('p-flux');
const React = require('react');
const types = require('react').PropTypes;
const RetroCreatePage = require('./retro_create_page');
const ListRetrosPage = require('./connected/list_retros_page');
const ShowRetroPage = require('./show_retro_page');
const ShowRetroSettingsPage = require('./show_retro_settings_page');
const ShowRetroPasswordSettingsPage = require('./show_retro_password_settings_page');
const LoginToRetroPage = require('./login_to_retro_page');
const ApiServerNotFoundPage = require('./api_server_not_found_page');
const RetroNotFoundPage = require('./retro_not_found_page');
const NotFoundPage = require('./not_found_page');
const NewTermsPage = require('./new_terms_page');
const EmptyPage = require('./empty_page');
const HomePage = require('./home_page');
const ListRetroArchivesPage = require('./list_retro_archives_page');
const Alert = require('./alert');
const PrivacyPage = require('./privacy_page');
const RegistrationPage = require('./registration_page');

function isObject(obj) {
  return typeof obj === 'object';
}

function toFlattenedRoutes(routesHash) {
  return Object.keys(routesHash).reduce((paths, parent) => {
    if (isObject(routesHash[parent])) {
      const children = toFlattenedRoutes(routesHash[parent]);
      Object.keys(children).forEach(child => paths[parent + child] = children[child]);
    } else {
      paths[parent] = routesHash[parent];
    }
    return paths;
  }, {});
}

const routes = {
  '*': 'showNotFound',
  '/': 'showHome',
  '/retros/:retroId': 'showRetro',
  '/retros/:retroId/archives': 'listRetroArchives',
  '/retros/:retroId/archives/:archiveId': 'showRetroArchive',
  '/retros/:retroId/login': 'loginToRetro',
  '/retros/:retroId/relogin': 'reloginToRetro',
  '/retros/:retroId/settings': 'showRetroSettings',
  '/retros/:retroId/settings/password': 'showRetroPasswordSettings',
  '/retros/new': 'createRetro',
  '/terms': 'showTerms',
  '/privacy': 'privacyRedirect',
  '/registration/:accessToken/:email/:fullName': 'showRegistration'
};

class Router extends React.Component {
  static propTypes = {
    router: types.oneOfType([types.object, types.func]),
    retro: types.object,
    config: types.object,
    alert: types.object,
    featureFlags: types.object
  };

  constructor(props, context) {
    super(props, context);
    const {state} = this;
    this.state = {...state, Page: EmptyPage};
  }

  componentDidMount() {
    const {router} = this.props;
    Object.entries(toFlattenedRoutes(routes)).map(([path, callbackName]) => {
      router.get(path, this[callbackName]);
    });

    Actions.retrieveConfig()
    Actions.getCountryCode();
  }

  componentWillReceiveProps(nextProps) {
    const {api_server_not_found, retro_not_found, not_found} = nextProps;
    if (api_server_not_found) {
      this.setState({Page: ApiServerNotFoundPage});
    }
    if (retro_not_found) {
      this.setState({Page: RetroNotFoundPage});
    }
    if (not_found) {
      this.setState({Page: NotFoundPage});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.Page === prevState.Page) { return; }
    Actions.hideAlert();
  }

  createRetro = () => {
    this.setState({Page: RetroCreatePage});
  };

  showRetro = (req) => {
    if(req.params.retroId !== 'new') {
      Actions.retroIdRouted(req.params.retroId);
      this.setState({Page: ShowRetroPage, additionalProps: {retroId: req.params.retroId, archives: false}});
    }
  };

  listRetros = () => {
    this.setState({Page: ListRetrosPage});
  };

  listRetroArchives = (req) => {
    Actions.retroIdRouted(req.params.retroId);
    this.setState({Page: ListRetroArchivesPage, additionalProps: {retroId: req.params.retroId}});
  };

  showRetroArchive = (req) => {
    Actions.retroIdRouted(req.params.retroId);
    this.setState({Page: ShowRetroPage, additionalProps: {retroId: req.params.retroId, archives: true, archiveId: req.params.archiveId}});
  };

  showRetroSettings = (req) => {
    Actions.retroIdRouted(req.params.retroId);
    this.setState({Page: ShowRetroSettingsPage, additionalProps: {retroId: req.params.retroId}});
  };

  showRetroPasswordSettings = (req) => {
    Actions.retroIdRouted(req.params.retroId);
    this.setState({Page: ShowRetroPasswordSettingsPage, additionalProps: {retroId: req.params.retroId}});
  };

  showNotFound = () => {
    this.setState({Page: NotFoundPage});
  };

  showTerms = () => {
    this.setState({Page: NewTermsPage});
  };

  loginToRetro = (req) => {
    this.setState({Page: LoginToRetroPage, additionalProps: {retroId: req.params.retroId}});
  };

  reloginToRetro = (req) => {
    this.setState({Page: LoginToRetroPage, additionalProps: {retroId: req.params.retroId, force_relogin: true}});
  };

  showHome = () => {
    if(this.isUserLoggedIn()){
      this.listRetros();
    } else {
      this.injectMockCountryCode();
      this.setState({Page: HomePage});
    }
  };

  privacyRedirect = () => {
      this.setState({Page: PrivacyPage});
  };

  showRegistration = (req) => {
    this.setState({Page: RegistrationPage, additionalProps: {accessToken: req.params.accessToken, email: req.params.email, fullName: req.params.fullName}});
  };

  render() {
    const {Page, additionalProps} = this.state;
    const {alert} = this.props;

    return (
      <div>
        <Alert alert={alert}/>
        <Page {...this.props} {...additionalProps}/>
      </div>
    );
  }

  isUserLoggedIn() {
    return localStorage.getItem('authToken');
  };

  injectMockCountryCode() {
    let queryString = window.location.search;
    if (queryString.includes("countryCode=")) {
      let split = queryString.split("countryCode=");
      window.country_code = split[1];
    }
  }
}

module.exports = Router;
