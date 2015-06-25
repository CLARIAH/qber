var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var EventEmitter = require('events').EventEmitter;
var DatasetConstants = require('../constants/DatasetConstants');
var SDMXDimensionConstants = require('../constants/SDMXDimensionConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _dimensions = [];
var _dimension_search;
var _selected_dimension;

/**
 * Initialize the list of dimensions.
 * @param  {array} dimensions The dimensions
 */
function initialize(dimensions) {
  _dimensions = dimensions;
}

/**
 * Set the DIMENSION search function.
 * @return {string}
 */
 function setDimensionSearch(dimension_search) {
   _dimension_search = dimension_search;
}

/**
 * Set the DIMENSION search function.
 * @return {string}
 */
 function setSelectedDimension(dimension) {
   _selected_dimension = dimension;
}


var SDMXDimensionStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire DATASET.
   * @return {object}
   */
  get: function() {
    return _dimensions;
  },

  /**
   * Get the DIMENSION search string.
   * @return {string}
   */
  getDimensionSearch: function() {
    return _dimension_search;
  },

  getSelectedDimension: function(){
    return _selected_dimension;
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
  switch(action.actionType) {
    // This is the INIT action for the dimensions
    case SDMXDimensionConstants.SDMX_DIMENSION_INIT:
      var dimensions = action.dimensions;

      if (dimensions !== {}) {
        initialize(dimensions);
        SDMXDimensionStore.emitChange();
      }
      break;


    case SDMXDimensionConstants.SDMX_DIMENSION_SEARCH:
      var dimension_search = action.search;

      if (dimension_search !== SDMXDimensionStore.getDimensionSearch()){
        setDimensionSearch(dimension_search);
        SDMXDimensionStore.emitChange();
      }
      break;

    case SDMXDimensionConstants.SELECT_DIMENSION:
      var selected_dimension = action.dimension;

      if (selected_dimension !== ""){
        setSelectedDimension(selected_dimension);
        SDMXDimensionStore.emitChange();
      }
      break;


    default:
      console.log('SDMXDimensionStore: No matching action');
      // no op
  }
});

module.exports = SDMXDimensionStore;
