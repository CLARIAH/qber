var React = require('react');
var ReactPropTypes = React.PropTypes;
var DatasetActions = require('../actions/DatasetActions');


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
    // and shown when there are datasets.
    if (Object.keys(this.props.dataset).length < 1 || this.props.variable === undefined) {
      return null;
    }

    var dataset = this.props.dataset;
    var elements = [];

    for (var key in dataset) {
      elements.push(<li> {key} </li>);
    }

    return (
      <section id="main">
        <h1>{this.props.variable}</h1>
        <ul id="dataset-list">{elements}</ul>
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
