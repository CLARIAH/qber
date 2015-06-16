var React = require('react');
var ReactPropTypes = React.PropTypes;
var DatasetActions = require('../actions/DatasetActions');

var Select = require('react-select');

var VariablesList = React.createClass({

  // This React class only works if a list of 'variables' is passed through its properties.
  propTypes: {
    variables: ReactPropTypes.array.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    // This section should be hidden by default
    // and shown when we do have variables in our dataset
    if (this.props.variables === undefined || this.props.variables.length < 1) {
      return null;
    }

    var variables = this.props.variables;
    var variables_items = [];

    for (var key in variables) {
      variables_items.push({value: variables[key], label: variables[key]});
    }

    return (
        <Select
          name = "variables-select"
          options = {variables_items}
          onChange = {this._handleChange}
        />
    );
  },

  /**
   * Event handler for a selection in the Select element.
   */
  _handleChange: function(val) {
    console.log("Selected: " + val);
    DatasetActions.chooseVariable(val);
  }

});

module.exports = VariablesList;
