var React = require('react');
var ReactPropTypes = React.PropTypes;
var DimensionActions = require('../actions/DimensionActions');
var DimensionStore = require('../stores/DimensionStore');
var QBerModal = require('./QBerModal.react');
var DimensionType = require('./Dimensiontype.react');
var DimensionMetadata = require('./DimensionMetadata.react');
var ValueDefinitionTable = require('./ValueDefinitionTable.react');



/**
 * Retrieve the current visibility from the DimensionStore
 */
function getDimensionDefinitionPanelState() {
  return {
    'variable': DimensionStore.getVariable(),
    'modal_visible': DimensionStore.getModalVisible(),
  };
}


var DimensionDefinitionPanel = React.createClass({

  // This React class only works if a list of 'values' and the name of the dataset is passed through its properties.
  propTypes: {
    datasetName: ReactPropTypes.string.isRequired,
    schemes: ReactPropTypes.object.isRequired,
    dimensions: ReactPropTypes.object.isRequired
  },

  getInitialState: function() {
    // Get the state from the store
    return getDimensionDefinitionPanelState();
  },

  componentDidMount: function() {
    DimensionStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    DimensionStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
    // This section should be visible by default
    // and shown when there is a dataset and variable.
    // if (Object.keys(this.props.dimensions).length < 1 || this.props.dimensions === undefined) {
    //   return null;
    // }

    // TODO: Want this to work the first time the variable is shown
    // TODO: Make this more elegant as this really should not occur in the render function.
    // if (this.state.dimension === undefined) {
    //   DimensionActions.buildDimension(this.props.values, this.props.datasetName);
    // }

    return (
      <section id="sdmx_dimension_panel">
        <DimensionType category={this.state.variable.category}
                       key={"dt"+ this.state.variable.label}
                       doSelectDimension={this._handleSelectDimension}
                       doBuildCodedVariable={this._handleBuildCodedVariable}
                       doBuildIdentifier={this._handleBuildIdentifier}
                       doBuildOther={this._handleBuildOther}/>
        <DimensionMetadata variable={this.state.variable}
                           schemes={this.props.schemes}
                           key={"dm"+ this.state.variable.label}
                           doUpdate={this._handleMetadataUpdate}
                           doSchemeUpdate={this._handleSchemeUpdate}
                           doApplyTransform={this._handleApplyTransformFunction}/>
        <QBerModal  visible={this.state.modal_visible}
                    title="Select a community provided variable name"
                    value={this.state.variable.label}
                    selection={this.state.variable.uri}
                    options={this.props.dimensions}
                    doSelect={this._handleSelected}
                    doClose={this._handleHideDimensions} />
        <ValueDefinitionTable variable={this.state.variable}
                              schemes={this.props.schemes}
                              key={"vdt"+ this.state.variable.label}
                              doMapping={this._handleMapping} />
      </section>
    );
  },

  /**
   * Event handler for the button that shows the Dimensions modal for community-provided dimension definitions
   */
  _handleSelectDimension: function(){
    DimensionActions.showDimensions();
  },

  /**
   * Event handler for the button that generates a Dimension definition
   */
  _handleBuildCodedVariable: function(){
    DimensionActions.buildCodedVariable();
  },

  /**
   * Event handler for the button that marks the variable as a non-coded dimension ('identifier')
   */
  _handleBuildIdentifier: function(){
    // Revert all uri attributes in the values array to their defaults.
    DimensionActions.buildIdentifier();
  },

  /**
   * Event handler for the button that marks the variable as a 'measurement' (other)
   */
  _handleBuildOther: function(){
    DimensionActions.buildOther();
  },

  /**
   * Event handler for the button that hides the Dimensions modal
   */
  _handleHideDimensions: function(){
    DimensionActions.hideDimensions();
  },

  /**
   * Event handler for a selection in the Community Dimensions modal
   */
  _handleSelected: function(dimension_uri) {
    DimensionActions.chooseDimension(dimension_uri);
  },

  _handleMetadataUpdate: function(dimension) {
    DimensionActions.updateDimension(dimension);
  },

  _handleSchemeUpdate: function(scheme) {
    DimensionActions.chooseScheme(scheme);
  },

  _handleApplyTransformFunction: function(func) {
    DimensionActions.applyTransformFunction(func);
  },

  _handleMapping: function(code_value, code_uri) {
    DimensionActions.addMapping(code_value, code_uri);
  },

  /**
   * Event handler for 'change' events coming from the DatasetStore
   */
  _onChange: function() {
    console.log('Something changed for DimensionDefinitionPanel');
    this.setState(getDimensionDefinitionPanelState());
  }

});

module.exports = DimensionDefinitionPanel;
