const React = require('react');
const moment = require('moment');
const {Actions} = require('p-flux');
const RetroFooter = require('./footer');
import RetroMenu from './retro_menu';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
const types = React.PropTypes;

class ListRetroArchivesPage extends React.Component {
  static propTypes = {
    archives: types.array,
    retroId: types.string.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isMobile: false
    };
  }

  componentWillMount() {
    const {retroId} = this.props;
    Actions.getRetroArchives({retro_id: retroId});
    this.handleResize();
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  onArchiveClicked(archiveId, e) {
    e.preventDefault();
    const {retroId} = this.props;
    Actions.routeToRetroArchive({retro_id: retroId, archive_id: archiveId});
  }

  sortedArchives(archives) {
    return archives.sort((a, b) => {
      return moment(b.created_at) - moment(a.created_at);
    });
  }

  onCurrentRetroClicked() {
    const {retroId} = this.props;
    Actions.backPressedFromArchives({retro_id: retroId});
  }

  handleResize() {
    this.setState({isMobile: this.getIsMobile()});
  }

  getIsMobile() {
    return window.innerWidth <= 1030;
  }

  getMenuItems() {
    let items = [
      {title: 'Sign out', callback: Actions.signOut, isApplicable: window.localStorage.length > 0}
    ];

    return items.filter((item) => {
      return item.isApplicable;
    });
  }

  render() {
    const {archives, retroId} = this.props;
    if (!archives) {
      return <div>Loading archives...</div>;
    }
    const {isMobile} = this.state;
    let menuItems = this.getMenuItems();

    return (
      <div className={'retro-archives full-height' + (isMobile ? ' mobile-display': '')}>
        <div className="retro-heading row">
          <div className="small-2 columns back-button">
            <FlatButton
              className="retro-back"
              onTouchTap={this.onCurrentRetroClicked.bind(this)}
              label="Current retro"
              labelStyle={isMobile ? {'display': 'none'} : {}}
              icon={<FontIcon className="fa fa-chevron-left" />}
            />
          </div>
          <h1 className="small-8 text-center retro-name">
            Archives
          </h1>
          <div className="small-2 menu end">
            <RetroMenu isMobile={false} items={menuItems}/>
          </div>
        </div>

        <div className="archives">
          <div className="row">
            {
              this.sortedArchives(archives).map((a) => {
                return (
                  <div className="archive-row medium-6 medium-offset-3 columns end text-center" key={a.id}>
                    <div className="archive-link" onClick={this.onArchiveClicked.bind(this, a.id)}>
                      <a href={`/retros/${retroId}/archives/${a.id}`}>
                        { moment(a.created_at).local().format('DD MMMM YYYY') }
                      </a>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
        <RetroFooter />
      </div>
    );
  }
}

module.exports = ListRetroArchivesPage;
