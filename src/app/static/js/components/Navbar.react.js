var React = require('react');

var SignIn = require('./SignIn.react');
var MessagePanel = require('./MessagePanel.react');

var DatasetStore = require('../stores/DatasetStore');
var DatasetActions = require('../actions/DatasetActions');


// var ReactPropTypes = React.PropTypes;

/**
 * Retrieve the current login state from the dataset store
 */
function getNavbarState() {
  return {
    user: DatasetStore.getUser()
  };
}


var Navbar = React.createClass({

  // This React class only works if a 'visible' value is passed through its properties.
  // propTypes: {
  //   visible: ReactPropTypes.object.isRequired
  // },

  getInitialState: function() {
    return getNavbarState();
  },

  /**
   * @return {object}
   */
  render: function() {
    var signin, userinfo;

    if(this.state.user === undefined) {
      signin = <SignIn onSignIn={this._signedIn}/>;
    } else {
      signin = <span>{this.state.user.zt.Ei}</span>;
      userinfo = <li><a>{this.state.user.zt.Ei}</a></li>;
    }

    return (
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
          <ul className="nav navbar-nav">
            <li><a style={{padding:'0px'}}>{signin}</a></li>
            {userinfo}
          </ul>
        </div>
      </div>
    );
  },

  /**
   * Event handler for 'change' events coming from the DatasetStore
   */
  _onChange: function() {
    this.setState(getNavbarState());
  },


  _signedIn: function(user) {
    console.log("Retrieved signin signal...")
    DatasetActions.registerUser(user);
    console.log("Sent out registerUser action to DatasetActions");
  },
});

module.exports = Navbar;
