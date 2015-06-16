var React = require('react');
var ReactPropTypes = React.PropTypes;
var DatasetActions = require('../actions/DatasetActions');

var Select = require('react-select');

var VariableAttributes = React.createClass({

  // This React class only works if a list of 'variables' is passed through its properties.
  propTypes: {
    variable: ReactPropTypes.string.isRequired,
    dimensions: ReactPropTypes.object.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    console.log('VariableAttributes');

    // This section should be hidden by default
    // and shown when there is a list of dimensions and a variable.
    if (this.props.dimensions === undefined || Object.keys(this.props.dimensions).length < 1 || this.props.variable === undefined) {
      return null;
    }

    var dimensions = this.props.dimensions;
    var dimension_items = [];

    for (var key in dimensions) {
      dimension_items.push({value: key, label: <span>{key} <span className="badge"> { dimensions[key].refs }</span></span>});
    }

    return (
        <Select
          name = "dimension-select"
          options = {dimension_items}
          onChange = {this._handleChange}
        />
    );
  },

  /**
   * Event handler for a selection in the Select element.
   */
  _handleChange: function(val) {
    console.log("Selected: " + val);
    DatasetActions.chooseDimension(val);
  }

});

module.exports = VariableAttributes;
