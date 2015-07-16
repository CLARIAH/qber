var React = require('react');
var ReactPropTypes = React.PropTypes;
var SDMXDimensionActions = require('../actions/SDMXDimensionActions');
var SDMXDimensionStore = require('../stores/SDMXDimensionStore');
var SDMXDimensionModal = require('./SDMXDimensionModal.react');
var SDMXDimensionForm = require('./SDMXDimensionForm.react');



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
        <a className="btn btn-primary" onClick={this._handleShowDimensions}>Select existing dimension</a>
        <SDMXDimensionForm dimension={this.state.dimension}
                           doUpdate={this._onUpdate}/>
        <SDMXDimensionModal visible={this.state.modal_visible}
                            dimensions={this.state.dimensions}
                            doSelect={this._onSelected} />
      </section>
    );
  },

  /**
   * Event handler for the button that shows the Dimensions modal
   */
  _handleShowDimensions: function(){
    SDMXDimensionActions.showDimensions();
  },

  /**
   * Event handler for a selection in the Dimension modal
   */
  _onSelected: function(value) {
    SDMXDimensionActions.chooseDimension(value);
  },

  _onUpdate: function(dimension) {
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
