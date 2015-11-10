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
    'dimensions': DimensionStore.getVariables(),
    'variable': DimensionStore.getVariable(),
    'dimension': DimensionStore.getDimension(),
    'modal_visible': DimensionStore.getModalVisible(),
  };
}


var DimensionDefinitionPanel = React.createClass({

  // This React class only works if a list of 'values' and the name of the dataset is passed through its properties.
  propTypes: {
    values: ReactPropTypes.object.isRequired,
    datasetName: ReactPropTypes.string.isRequired
  },

  getInitialState: function() {
    // Get the state from the store
    var state = getDimensionDefinitionPanelState();

    // Check if there's already a dimension defined
    if (state.dimension === undefined) {
      // If not, build it as if it is a 'coded' dimension.
      DimensionActions.buildDimension(this.props.values, this.props.datasetName);
      // Get the new state
      state = getDimensionDefinitionPanelState();
    }
    // Return the initial state
    return state;
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
    if (this.state.dimension === undefined) {
      DimensionActions.buildDimension(this.props.values, this.props.datasetName);
    }

    return (
      <section id="sdmx_dimension_panel">
        <DimensionType type={this.state.dimension === undefined ? "coded" : this.state.dimension.type}
                       key={"dt"+ this.state.variable}
                       doSelectDimension={this._handleShowDimensions}
                       doBuildDimension={this._handleBuildDimension}
                       doBuildIdentifier={this._handleBuildIdentifier}
                       doBuildMeasurement={this._handleBuildMeasurement}/>
        <DimensionMetadata variable={this.state.variable}
                           key={"dm"+ this.state.variable}
                           dimension={this.state.dimension}
                           doUpdate={this._handleUpdate}/>
        <QBerModal  visible={this.state.modal_visible}
                    title="Select a community provided variable name"
                    value={this.state.variable}
                    selection={this.state.dimension !== undefined ? this.state.dimension.uri: undefined}
                    options={this.state.dimensions}
                    doSelect={this._handleSelected}
                    doClose={this._handleHideDimensions} />
        <ValueDefinitionTable values={this.props.values}
                    key={"vdt"+ this.state.variable}
                    dimension={this.state.dimension}
                    doMapping={this._handleMapping} />
      </section>
    );
  },

  /**
   * Event handler for the button that shows the Dimensions modal for community-provided dimension definitions
   */
  _handleShowDimensions: function(){
    DimensionActions.showDimensions();
  },

  /**
   * Event handler for the button that generates a Dimension definition
   */
  _handleBuildDimension: function(){
    DimensionActions.buildDimension(this.props.values, this.props.datasetName);
  },

  /**
   * Event handler for the button that generates a Dimension definition
   */
  _handleBuildIdentifier: function(){
    DimensionActions.buildIdentifier(this.props.values, this.props.datasetName);
  },

  /**
   * Event handler for the button that generates a Dimension definition
   */
  _handleBuildMeasurement: function(){
    DimensionActions.buildMeasurement(this.props.values, this.props.datasetName);
  },

  /**
   * Event handler for the button that hides the Dimensions modal
   */
  _handleHideDimensions: function(){
    DimensionActions.hideDimensions();
  },

  /**
   * Event handler for a selection in the Dimension modal
   */
  _handleSelected: function(dimension_uri) {
    DimensionActions.chooseDimension(dimension_uri);
  },

  _handleUpdate: function(dimension) {
    DimensionActions.updateDimension(dimension);
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
