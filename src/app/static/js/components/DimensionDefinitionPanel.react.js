var React = require('react');
var ReactPropTypes = React.PropTypes;
var DimensionActions = require('../actions/DimensionActions');
var DimensionStore = require('../stores/DimensionStore');
var QBerModal = require('./QBerModal.react');
var DimensionType = require('./Dimensiontype.react');
var DimensionMetadata = require('./DimensionMetadata.react');
var CodeDefinitionTable = require('./CodeDefinitionTable.react');



/**
 * Retrieve the current visibility from the DimensionStore
 */
function getDimensionDefinitionPanelState() {
  return {
    'dimensions': DimensionStore.getDimensions(),
    'variable': DimensionStore.getVariable(),
    'dimension': DimensionStore.getDimension(),
    'modal_visible': DimensionStore.getModalVisible(),
  };
}


var DimensionDefinitionPanel = React.createClass({

  // This React class only works if a list of 'codes' and the name of the dataset is passed through its properties.
  propTypes: {
    codes: ReactPropTypes.object.isRequired,
    datasetName: ReactPropTypes.string.isRequired
  },

  getInitialState: function() {
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
    if (this.state.dimension === undefined) {
      DimensionActions.buildDimension(this.props.codes, this.props.datasetName);
    }

    return (
      <section id="sdmx_dimension_panel">
        <DimensionType type={this.state.dimension === undefined ? "coded" : this.state.dimension.type}
                       doSelectDimension={this._handleShowDimensions}
                       doBuildDimension={this._handleBuildDimension}/>
        <DimensionMetadata variable={this.state.variable}
                           dimension={this.state.dimension}
                           doUpdate={this._handleUpdate}/>
        <QBerModal  visible={this.state.modal_visible}
                    title="Select a community provided variable name"
                    options={this.state.dimensions}
                    doSelect={this._handleSelected}
                    doClose={this._handleHideDimensions} />
        <CodeDefinitionTable codes={this.props.codes}
                    dimension={this.state.dimension}
                    doMapping={this._handleMapping} />
      </section>
    );
  },


  /**
   * Event handler for the button that generates a Dimension definition
   */
  _handleBuildDimension: function(){
    DimensionActions.buildDimension(this.props.codes, this.props.datasetName);
  },

  /**
   * Event handler for the button that shows the Dimensions modal
   */
  _handleShowDimensions: function(){
    DimensionActions.showDimensions();
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
  _handleSelected: function(value) {
    DimensionActions.chooseDimension(value);
  },

  _handleUpdate: function(dimension) {
    DimensionActions.updateDimension(dimension);
  },

  _handleMapping: function(value, code) {
    DimensionActions.addMapping(value, code);
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
