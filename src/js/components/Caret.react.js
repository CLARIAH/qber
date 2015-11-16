var React = require('react');
var ReactPropTypes = React.PropTypes;

var Caret = React.createClass({

  // This React class only works if a 'visible' value is passed through its properties.
  propTypes: {
    visible: ReactPropTypes.bool.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    // This section should be hidden by default
    // and shown when there is a dataset and variable.
    var icon;
    if (this.props.visible){
      icon = "small glyphicon glyphicon-chevron-down pull-right";
    } else {
      icon = "small glyphicon glyphicon-chevron-right pull-right";
    }
    
    return (
      <span className={icon}></span>
    );
  }
});

module.exports = Caret;
