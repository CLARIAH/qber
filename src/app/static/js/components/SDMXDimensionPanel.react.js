var React = require('react');
var ReactPropTypes = React.PropTypes;
var SDMXDimensionActions = require('../actions/SDMXDimensionActions');
var SDMXDimensionStore = require('../stores/SDMXDimensionStore');
var PillSelector = require('./PillSelector.react');


/**
 * Retrieve the current visibility from the SDMXDimensionStore
 */
function getSDMXDimensionState() {
  return {
    'dimensions': SDMXDimensionStore.get(),
    'visible': SDMXDimensionStore.getVisible(),
    'selected': SDMXDimensionStore.getSelectedDimension()
  };
}


var SDMXDimensionPanel = React.createClass({

  getInitialState: function() {
    return getSDMXDimensionState();
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
    // This section should be hidden by default
    // and shown when there is a dataset and variable.
    // if (Object.keys(this.props.dimensions).length < 1 || this.props.dimensions === undefined) {
    //   return null;
    // }

    console.log('SDMXDimensionPanel visible:' + this.state.visible);
    // Only render this component when the store says it should be visible
    if (!this.state.visible) {
      return null;
    }


    return (
      <section id="sdmx_dimension_panel">
        <div className="overlay"></div>
        <div className="qber-modal">
          <PillSelector options={this.state.dimensions} doSelect={this._onSelected} filterFunction={this._filter}/>
        </div>
      </section>
    );
  },

  _filter: function(option){
    return (option.label.search(regexp) > -1) ? '': (option.uri.search(regexp) > -1) ? '': 'none';
  },

  /**
   * Event handler for a selection in the PillSelector
   */
  _onSelected: function(value) {
    SDMXDimensionActions.chooseDimension(value);
  },

  /**
   * Event handler for 'change' events coming from the DatasetStore
   */
  _onChange: function() {
    console.log('Something changed for SDMXDimensionPanel');
    this.setState(getSDMXDimensionState());
  }

});

module.exports = SDMXDimensionPanel;
