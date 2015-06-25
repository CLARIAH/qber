var React = require('react');
var ReactPropTypes = React.PropTypes;

var cx = require('classnames');

var VariableItem = React.createClass({

  // This React class only works if a list of 'variables' is passed through its properties.
  propTypes: {
    variable: ReactPropTypes.string.isRequired,
    isSelected: ReactPropTypes.bool.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    // This section should be hidden by default
    // and shown when we do have variables in our dataset
    if (this.props.variable === undefined) {
      return null;
    }

    var variable = this.props.variable;

    var classes = cx({
      'active': this.props.isSelected
    });

    return (
        <li role="presentation">
          <a href="#" className={classes} onClick={this.props.onClicked}>{variable}</a>
        </li>
    );
  },

});

module.exports = VariableItem;
