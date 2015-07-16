var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var EventEmitter = require('events').EventEmitter;
var DatasetConstants = require('../constants/DatasetConstants');
var SDMXDimensionConstants = require('../constants/SDMXDimensionConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

// The list of dimensions obtained from the LOD cloud + CSDH
var _dimensions = [];
// The visibility status of the SDMX Dimension Modal
var _modal_visible = false;
// The accumulated mappings between variables in the dataset and selected dimensions
var _mappings = {};
// The selected variable
var _variable

/**
 * Initialize the list of dimensions.
 * @param  {array} dimensions The dimensions
 */
function initialize(dimensions) {
  _dimensions = dimensions;
}

/**
 * Make the dimension modal visible.
 */
 function setModalVisible() {
   _modal_visible = true;
}

/**
 * Make the dimension modal hidden.
 */
 function setModalHidden() {
   _modal_visible = false;
}

/**
 * Set the currently selected variable (for mappings).
 * @param  {string} variable The selected variable
 */
 function setVariable(variable) {
   console.log('Variable set to '+ variable)
   _variable = variable;
}

/**
 * Assign the selected dimension to the currently selected variable
 * @param  {object} dimension The selected dimension details
 */
 function assignDimension(dimension) {
   console.log('Assigning dimension');
   console.log(dimension);
   // First we clear out any existing information about this variable
   // (e.g. previously added mappings)
   _mappings[_variable] = {};
   // Assign the dimension to the variable.
   _mappings[_variable].dimension = dimension;
}


var SDMXDimensionStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the list of dimensions.
   * @return {object}
   */
  getDimensions: function() {
    return _dimensions;
  },

  /**
   * Get the currently selected variable
   * @return {string}
   */
  getVariable: function() {
    return _variable;
  },

  /**
   * Get the dimension assigned to the currently selected variable
   * @return {object} The dimension details
   */
  getDimension: function() {
    if (_mappings[_variable] !== undefined){
      return _mappings[_variable].dimension;
    } else {
      return undefined;
    }
  },

  /**
   * Get the visibility status of the SDMX Dimension modal
   * @return {object}
   */
  getModalVisible: function(){
    return _modal_visible;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
QBerDispatcher.register(function(action) {
  console.log('SDMXDimensionStore received message from QBerDispatcher:' + action.actionType);

  switch(action.actionType) {
    // This is the INIT action for the dimensions
    case SDMXDimensionConstants.SDMX_DIMENSION_INIT:
      var dimensions = action.dimensions;

      if (dimensions !== {}) {
        initialize(dimensions);
        SDMXDimensionStore.emitChange();
      }
      break;
    // Once a variable from the source dataset is selected, make this known to the SDMX Store
    case SDMXDimensionConstants.SDMX_DIMENSION_SET_VARIABLE:
      var variable = action.variable;
      setVariable(variable);
      SDMXDimensionStore.emitChange();
      break;
    // Once a dimension has been selected in the modal, assign it to the variable in our mappings dictionary
    case SDMXDimensionConstants.SDMX_DIMENSION_ASSIGN:
      var dimension = action.dimension_details;
      assignDimension(dimension);
      SDMXDimensionStore.emitChange();
      break;
    // The dimension panel should be made visible
    case SDMXDimensionConstants.SDMX_DIMENSION_SHOW:
      setModalVisible();
      SDMXDimensionStore.emitChange();
      break;
    // The dimension panel should be made hidden
    case SDMXDimensionConstants.SDMX_DIMENSION_HIDE:
      setModalHidden();
      SDMXDimensionStore.emitChange();
      break;


    default:
      console.log('SDMXDimensionStore: No matching action');
      // no op
  }
});

module.exports = SDMXDimensionStore;
