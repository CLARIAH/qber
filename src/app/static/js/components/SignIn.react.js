var React = require('react');
// var gapi = require('google-client-api');
var ReactPropTypes = React.PropTypes;


var SignIn = React.createClass({

  // This React class only works if a 'onSignIn' function is passed through its properties.
  propTypes: {
    onSignIn: ReactPropTypes.object.isRequired
  },

  componentWillMount: function(){
    this.callbackName = "googleCallback";
    window[this.callbackName] = this.props.onSignIn;
  },

  componentWillUnmount: function(){
    delete window[this.callbackName];
  },

  /**
   * @return {object}
   */
  render: function() {
    return (
      <span className="g-signin2" data-onsuccess={this.callbackName} data-theme="dark"></span>
    );
  }
});

module.exports = SignIn;
