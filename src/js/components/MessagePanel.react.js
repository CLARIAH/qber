var React = require('react');
var ReactPropTypes = React.PropTypes;
var MessageStore = require('../stores/MessageStore');
var classNames = require('classnames');


/**
 * Retrieve the current message from the MessageStore
 */
function getMessage() {
  return MessageStore.getMessage();
}

var MessagePanel = React.createClass({

  getInitialState: function() {
    return getMessage();
  },

  componentDidMount: function() {
    MessageStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    MessageStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {

    var message = this.state.message;

    if (message === undefined || message === ''){
      return null;
    }

    var classes = classNames({
      'alert': true,
      'alert-danger': this.state.isError,
      'alert-warning': this.state.isWarning,
      'alert-success': this.state.isSuccess,
      'alert-info': this.state.isInfo,
      'message': true
    });

    return (
        <div className={ classes } id="message_panel">
          { message }
          <div className="pull-right" onClick={this._handleResetLocalStorage}><span className="glyphicon glyphicon-fire pull-right"></span></div>
        </div>
    );
  },


  /**
   * Event handler for a selection in variable list nav .
   */
  _handleClick: function(event) {
    VariableSelectActions.selectVariable(event.target.text);
  },

  /**
   * Event handler for a selection in the Select element.
   */
  _handleChange: function(event) {
    VariableSelectActions.searchVariable(event.target.value);
  },

  /**
   * Event handler for 'change' events coming from the MessageStore
   */
  _onChange: function() {
    this.setState(getMessage());
  },

  /**
   * Clear the local storage
   */
  _handleResetLocalStorage: function() {
    for (var key in localStorage) { localStorage.removeItem(key); }
    console.log("localStorage cleared");
  }

});

module.exports = MessagePanel;
