var React = require('react');
var ReactPropTypes = React.PropTypes;

var cx = require('classnames');

var Pill = React.createClass({

  // This React class only works if a list of 'variables' is passed through its properties.
  propTypes: {
    value: ReactPropTypes.string.isRequired,
    isSelected: ReactPropTypes.bool.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    // This section should be hidden by default
    // and shown when we do have variables in our dataset
    if (this.props.value === undefined) {
      return null;
    }

    var value = this.props.value;

    var classes = cx({
      'active': this.props.isSelected
    });

    return (
        <li role="presentation" style={this.props.style}>
          <a href="#" className={classes} onClick={this.props.onClicked}>{value}</a>
        </li>
    );
  },

});

module.exports = Pill;
