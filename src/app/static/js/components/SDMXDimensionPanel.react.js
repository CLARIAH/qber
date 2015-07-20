var React = require('react');
var ReactPropTypes = React.PropTypes;
var SDMXDimensionActions = require('../actions/SDMXDimensionActions');
var SDMXDimensionStore = require('../stores/SDMXDimensionStore');
var QBerModal = require('./QBerModal.react');
var SDMXDimensionForm = require('./SDMXDimensionForm.react');
var CodesTable = require('./CodesTable.react');



/**
 * Retrieve the current visibility from the SDMXDimensionStore
 */
function getSDMXDimensionPanelState() {
  return {
    'dimensions': SDMXDimensionStore.getDimensions(),
    'variable': SDMXDimensionStore.getVariable(),
    'dimension': SDMXDimensionStore.getDimension(),
    'modal_visible': SDMXDimensionStore.getModalVisible(),
  };
}


var SDMXDimensionPanel = React.createClass({

  // This React class only works if a list of 'codes' and the name of the dataset is passed through its properties.
  propTypes: {
    codes: ReactPropTypes.object.isRequired,
    datasetName: ReactPropTypes.string.isRequired
  },

  getInitialState: function() {
    return getSDMXDimensionPanelState();
  },

  componentDidMount: function() {
    SDMXDimensionStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    SDMXDimensionStore.removeChangeListener(this._onChange);
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


    return (
      <section id="sdmx_dimension_panel">
        <SDMXDimensionForm variable={this.state.variable}
                           dimension={this.state.dimension}
                           doUpdate={this._handleUpdate}
                           doSelectDimension={this._handleShowDimensions}
                           doBuildDimension={this._handleBuildDimension}/>
        <QBerModal visible={this.state.modal_visible}
                            options={this.state.dimensions}
                            doSelect={this._handleSelected}
                            doClose={this._handleHideDimensions} />
        <CodesTable codes={this.props.codes}/>
      </section>
    );
  },


  /**
   * Event handler for the button that generates a Dimension definition
   */
  _handleBuildDimension: function(){
    SDMXDimensionActions.buildDimension(this.props.codes, this.props.datasetName);
  },

  /**
   * Event handler for the button that shows the Dimensions modal
   */
  _handleShowDimensions: function(){
    SDMXDimensionActions.showDimensions();
  },

  /**
   * Event handler for the button that hides the Dimensions modal
   */
  _handleHideDimensions: function(){
    SDMXDimensionActions.hideDimensions();
  },

  /**
   * Event handler for a selection in the Dimension modal
   */
  _handleSelected: function(value) {
    SDMXDimensionActions.chooseDimension(value);
  },

  _handleUpdate: function(dimension) {
    SDMXDimensionActions.updateDimension(dimension);
  },

  /**
   * Event handler for 'change' events coming from the DatasetStore
   */
  _onChange: function() {
    console.log('Something changed for SDMXDimensionPanel');
    this.setState(getSDMXDimensionPanelState());
  }

});

module.exports = SDMXDimensionPanel;
