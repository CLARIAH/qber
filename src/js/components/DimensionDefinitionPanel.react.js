var React = require('react');
var ReactPropTypes = React.PropTypes;
var DimensionActions = require('../actions/DimensionActions');
var DatasetStore = require('../stores/DatasetStore');
var QBerModal = require('./QBerModal.react');
var DimensionType = require('./DimensionType.react');
var DimensionMetadata = require('./DimensionMetadata.react');



var DimensionDefinitionPanel = React.createClass({

  // This React class only works if a list of 'values' and the name of the dataset is passed through its properties.
  propTypes: {
    datasetName: ReactPropTypes.string.isRequired,
    schemes: ReactPropTypes.object.isRequired,
    dimensions: ReactPropTypes.object.isRequired,
    selectedVariable: ReactPropTypes.object.isRequired,
    selectedValue: ReactPropTypes.object.isRequired
  },

  getInitialState: function() {
    // Get the state from the store
    return {'modal_visible': false};
  },


  /**
   * @return {object}
   */
  render: function() {
    // This section should be visible by default
    // and shown when there is a dataset and variable.
    if (this.props.selectedVariable === undefined) {
      return null;
    }

    // TODO: Want this to work the first time the variable is shown
    // TODO: Make this more elegant as this really should not occur in the render function.
    // if (this.state.dimension === undefined) {
    //   DimensionActions.buildDimension(this.props.values, this.props.datasetName);
    // }

    return (
      <section id="sdmx_dimension_panel">
        <DimensionType category={this.props.selectedVariable.category}
                       key={"dt"+ this.props.selectedVariable.label}
                       doSelectDimension={this._handleSelectDimension}
                       doBuildCodedVariable={this._handleBuildCodedVariable}
                       doBuildIdentifier={this._handleBuildIdentifier}
                       doBuildOther={this._handleBuildOther}/>
       <DimensionMetadata variable={this.props.selectedVariable}
                           schemes={this.props.schemes}
                           key={"dm"+ this.props.selectedVariable.label}
                           doUpdate={this._handleMetadataUpdate}
                           doSchemeUpdate={this._handleSchemeUpdate}
                           doApplyTransform={this._handleApplyTransformFunction}/>
        <QBerModal  visible={this.state.modal_visible}
                    title="Select a community provided variable name"
                    value={this.props.selectedVariable.label}
                    selection={this.props.selectedVariable.uri}
                    options={this.props.dimensions}
                    doSelect={this._handleSelected}
                    doClose={this._handleHideDimensions} />
      </section>
    );
  },

  /**
   * Event handler for the button that shows the Dimensions modal for community-provided dimension definitions
   */
  _handleSelectDimension: function(){
    this._showDimensions();
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
    this._hideDimensions();
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
   * Show the dimension panel (the modal in which codes are mapped to dimensions)
   */
  _showDimensions: function() {
    var newstate = this.state;
    newstate.modal_visible = true;
    this.setState(newstate)
  },

  /**
   * Close the dimension panel (the modal in which codes are mapped to dimensions)
   */
  _hideDimensions: function() {
    var newstate = this.state;
    newstate.modal_visible = false;
    this.setState(newstate)
  },

});

module.exports = DimensionDefinitionPanel;
