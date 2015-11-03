var React = require('react');
var ReactPropTypes = React.PropTypes;
var DatasetActions = require('../actions/DatasetActions');
var DimensionDefinitionPanel = require('./DimensionDefinitionPanel.react');

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
    var codes = this.props.dataset.codes[variable]

    return (
      <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <section id="variable_panel">
          <h4>Definition of <em>"{this.props.variable}"</em></h4>
          <DimensionDefinitionPanel codes={codes} datasetName={this.props.dataset.name}/>
        </section>
      </div>
    );
  }
});



module.exports = VariablePanel;
