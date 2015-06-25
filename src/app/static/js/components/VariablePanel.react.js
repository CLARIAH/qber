var React = require('react');
var ReactPropTypes = React.PropTypes;
var DatasetActions = require('../actions/DatasetActions');

var CodesTable = require('./CodesTable.react');

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
    var variable = this.props.variable;

    return (
      <section id="variable_panel">
        <h3>{this.props.variable}</h3>
        <a className="btn btn-primary" onClick={this._handleShowDimensions}>Select Dimension</a>
        <h4>Frequency Table</h4>
        <CodesTable codes={dataset.examples[variable]}/>
      </section>
    );
  },

  _handleShowDimensions: function(){
    DatasetActions.showDimensions();
  }
});



module.exports = VariablePanel;
