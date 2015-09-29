var React = require('react');
var ReactPropTypes = React.PropTypes;
var DatasetActions = require('../actions/DatasetActions');
var SDMXDimensionPanel = require('./SDMXDimensionPanel.react');

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

    var variable = this.props.variable;
    var values = this.props.dataset.values[variable]

    return (
      <section id="variable_panel">
        <h5>Details</h5>
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Selected: <em>{this.props.variable}</em></h3>
          </div>
          <div className="panel-body">
            <SDMXDimensionPanel values={values} datasetName={this.props.dataset.name}/>
          </div>
        </div>
      </section>
    );
  }
});



module.exports = VariablePanel;
