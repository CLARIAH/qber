var React = require('react');
var ReactPropTypes = React.PropTypes;
var DatasetActions = require('../actions/DatasetActions');

var VariableAttributes = require('./VariableAttributes.react');
var CodesTable = require('./CodesTable.react');

// var Mapping = require('./Mapping.react');

var VariablePanel = React.createClass({

  // This React class only works if a 'dataset' is passed through its properties.
  propTypes: {
    variable: ReactPropTypes.string.isRequired,
    dataset: ReactPropTypes.object.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    // This section should be hidden by default
    // and shown when there is a dataset and variable.
    if (Object.keys(this.props.dataset).length < 1 || this.props.variable === undefined) {
      return null;
    }

    var dataset = this.props.dataset;
    var elements = [];

    for (var key in dataset) {
      elements.push( <li> {key} </li> );
    }

    return (
      <section id="main">
        <h1>{this.props.variable}</h1>
        <VariableAttributes dimensions={this.props.dataset.dimensions} variable={this.props.variable}/>
        <CodesTable codes={this.props.dataset.examples[this.props.variable]}/>
      </section>
    );
  },

  /**
   * Event handler to mark all TODOs as complete
   */
  _onToggleCompleteAll: function() {
    DatasetActions.toggleCompleteAll();
  }

});

module.exports = VariablePanel;
