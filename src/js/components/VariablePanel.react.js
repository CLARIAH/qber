var React = require('react');
var ReactPropTypes = React.PropTypes;
var DatasetActions = require('../actions/DatasetActions');
var DimensionDefinitionPanel = require('./DimensionDefinitionPanel.react');
var ValueMapper = require('./ValueMapper.react');

var VariablePanel = React.createClass({

  // This React class only works if a 'dataset' is passed through its properties.
  propTypes: {
    selectedVariable: ReactPropTypes.object.isRequired,
    selectedValue: ReactPropTypes.object.isRequired,
    dataset: ReactPropTypes.object.isRequired,
    dimensions: ReactPropTypes.array.isRequired,
    schemes: ReactPropTypes.array.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    if (this.props.selectedVariable != undefined) {
      console.log("VariablePanel says variable is: " + this.props.selectedVariable.label);
    } else {
      console.log("VariablePanel says there is no variable defined...");
    }
    // This section should be hidden by default
    // and shown when there is a dataset and variable.
    if (Object.keys(this.props.dataset).length < 1 || this.props.selectedVariable === undefined) {
      return null;
    }

    return (
      <div className="col-sm-12 col-md-12">
        <section id="variable_panel">
          <h4>Definition of <em>"{this.props.selectedVariable.label}"</em></h4>
          <DimensionDefinitionPanel
            selectedVariable={this.props.selectedVariable}
            selectedValue={this.props.selectedValue}
            datasetName={this.props.dataset.name}
            dimensions={this.props.dimensions}
            schemes={this.props.schemes}/>
          <ValueMapper
            selectedVariable={this.props.selectedVariable}
            selectedValue={this.props.selectedValue}
            dimensions={this.props.dimensions}
            schemes={this.props.schemes}/>
        </section>
      </div>
    );
  }
});



module.exports = VariablePanel;
