var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var EventEmitter = require('events').EventEmitter;
var DatasetConstants = require('../constants/DatasetConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _dataset = {};
var _variable;
var _variable_search;
var _just_selected_variable = false;

/**
 * Initialize the DATASET.
 * @param  {object} dataset The content of the DATASET
 */
function initialize(dataset) {
  _dataset = dataset;
}


/**
 * Set the selected VARIABLE .
 * @param {string} variable The to be selected VARIABLE
 */
function setVariable(variable){
  _variable = variable;
}

/**
 * Set the VARIABLE search function.
 * @return {string}
 */
 function setVariableSearch(variable_search) {
   _variable_search = variable_search;
}

/**
 * Set the VARIABLE search function.
 * @return {string}
 */
 function setJustSelectedVariable(selected) {
   _just_selected_variable = selected;
}


/**
 * Update a DATASET item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
  _dataset[id] = assign({}, _dataset[id], updates);
}



var DatasetStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire DATASET.
   * @return {object}
   */
  get: function() {
    return _dataset;
  },


  /**
   * Get the selected VARIABLE.
   * @return {string}
   */
  getVariable: function() {
    return _variable;
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
  var dataset;
  var variable;

  switch(action.actionType) {
    // This is the INIT action for the dataset
    case DatasetConstants.DATASET_INIT:
      dataset = action.dataset;
      if (dataset !== {}) {
        initialize(dataset);
        DatasetStore.emitChange();
      }
      break;
    // This is where we set the currently selected variable
    case DatasetConstants.DATASET_CHOOSE_VARIABLE:
      variable = action.variable;
      if (variable !== ""){
        setVariable(variable);
        DatasetStore.emitChange();
      }
      break;

    default:
      console.log('DatasetStore: No matching action');
      // no op
  }
});

module.exports = DatasetStore;
