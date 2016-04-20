var React = require('react');
var SignIn = require('./SignIn.react');
var NavbarStore = require('../stores/NavbarStore')

var ReactPropTypes = React.PropTypes;



var Navbar = React.createClass({

  // This React class only works if a 'visible' value is passed through its properties.
  propTypes: {
    doSignIn: ReactPropTypes.func.isRequired,
    doSave: ReactPropTypes.func.isRequired,
    user: ReactPropTypes.object.isRequired,
    datasetLoaded: ReactPropTypes.bool.isRequired,
    variable: ReactPropTypes.object.isRequired
  },

  getInitialState: function() {
    return NavbarStore.getNavbar();
  },

  componentDidMount: function() {
    NavbarStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    NavbarStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
    var signin, userinfo, savebutton, submitbutton, downloadbutton, datasetHeader;


    signin = <SignIn onSignIn={this.props.doSignIn}/>;
    if (this.props.user !== undefined) {

      var username = this.props.user.getName();
      var depiction = this.props.user.getImageUrl();
      userinfo = <li><a href="#"><img className="user-depiction" src={depiction}/>{username}</a></li>;

      // Only show the save & submit buttons when a dataset is actually loaded
      if (this.props.datasetLoaded){
        datasetHeader = <li><a href="#"><strong>{this.props.datasetName}</strong></a></li>;
        savebutton = <li><a href="#" onClick={this.props.doSave}>Save</a></li>;
        submitbutton = <li><a href="#" onClick={this.props.doSubmit}>Submit</a></li>;
        if (this.state.url) {
          downloadbutton = <li><a href={this.state.url} onClick={this.props.doDownload} download>Download QB</a></li>;
        } else {
          downloadbutton = <li><a className="inactiveLink" href="#">Download QB</a></li>;
        }

      }

    } else {
      userinfo = <li><a href="#">Not logged in...</a></li>;
    }


    return (
      <nav class="navbar navbar-fixed-top" id="navbar">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">CLARIAH QBer</a>
          </div>

          <div className="collapse navbar-collapse" id="navbar">
            <ul className="nav navbar-nav nav-pills">
              {userinfo}
              {datasetHeader}
              {savebutton}
              {submitbutton}
              {downloadbutton}
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li><a style={{padding:'0px', paddingTop:'2px'}}>{signin}</a></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  },

  /**
   * Event handler for 'change' events coming from the NavbarStore
   */
  _onChange: function() {
    this.setState(NavbarStore.getNavbar());
  },



});

module.exports = Navbar;
