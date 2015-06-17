var React = require('react');
var ReactPropTypes = React.PropTypes;
var DatasetActions = require('../actions/DatasetActions');

var VariableItem = require('./VariableItem.react');

var VariablesList = React.createClass({

  // This React class only works if a list of 'variables' is passed through its properties.
  propTypes: {
    variables: ReactPropTypes.array.isRequired,
    justSelected: ReactPropTypes.bool.isRequired
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
    var search = this.props.search;
    var selected_variable = this.props.variable;
    var variable_items = [];


    if (search === undefined || search.length < 1) {
      for (var key in variables) {
        variable_items.push(
          <VariableItem key={key} variable={variables[key]} isSelected={variables[key] == selected_variable} onVariableClicked={this._handleClick} />
        );
      }
    } else {
      regexp = new RegExp(search,"i");
      for (var key in variables) {
        if (variables[key].search(regexp) > -1) {
          variable_items.push(
            <VariableItem key={key} variable={variables[key]} isSelected={variables[key] == selected_variable} onVariableClicked={this._handleClick}/>
          );
        }
      }
    }

    var input;
    if (this.props.justSelected) {
      input = <input className="form-control" width="100%" onChange={this._handleChange} type="text" value={search}/>;
    } else {
      input = <input className="form-control" width="100%" onChange={this._handleChange} type="text"/>;
    }

    return (
        <div>
          { input }
          <ul className="nav nav-pills" role="tablist">
            {variable_items}
          </ul>
        </div>
    );
  },


  /**
   * Event handler for a selection in variable list nav .
   */
  _handleClick: function(event) {
    DatasetActions.chooseVariable(event.target.text);
  },

  /**
   * Event handler for a selection in the Select element.
   */
  _handleChange: function(event) {
    DatasetActions.searchVariable(event.target.value);
  }

});

module.exports = VariablesList;
