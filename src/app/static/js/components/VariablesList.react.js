var React = require('react');
var ReactPropTypes = React.PropTypes;


var VariableSelectActions = require('../actions/VariableSelectActions');

var VariableSelectStore = require('../stores/VariableSelectStore');
var VariableItem = require('./VariableItem.react');

/**
 * Retrieve the current dataset from the DatasetStore
 */
function getVariableSelectState() {
  return {
    variables: VariableSelectStore.get(),
    search: VariableSelectStore.getVariableSearch(),
    selected_variable: VariableSelectStore.getSelectedVariable()
  };
}

var VariablesList = React.createClass({

  getInitialState: function() {
    return getVariableSelectState();
  },

  componentDidMount: function() {
    VariableSelectStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    VariableSelectStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
    console.log("In VariablesList render");
    var variables = this.state.variables;
    var search = this.state.search;
    var selected_variable = this.state.selected_variable;
    var variable_items = [];


    if (search === undefined || search.length < 1 || search === "") {
      console.log("Search is undefined or zero");
      for (var key in variables) {
        variable_items.push(
          <VariableItem key={key} variable={variables[key]} isSelected={variables[key] == selected_variable} onClicked={this._handleClick} />
        );
      }
    } else {
      console.log("Search is: '"+search+"'");
      regexp = new RegExp(search,"i");
      for (var key in variables) {
        if (variables[key].search(regexp) > -1) {
          variable_items.push(
            <VariableItem key={key} variable={variables[key]} isSelected={variables[key] == selected_variable} onClicked={this._handleClick}/>
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
        <section id="variables_list">
          { input }
          <ul className="nav nav-pills" role="tablist">
            {variable_items}
          </ul>
        </section>
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
   * Event handler for 'change' events coming from the DatasetStore
   */
  _onChange: function() {
    this.setState(getVariableSelectState());
  }

});

module.exports = VariablesList;
