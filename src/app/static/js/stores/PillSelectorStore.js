var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var EventEmitter = require('events').EventEmitter;
var DatasetConstants = require('../constants/DatasetConstants');
var PillSelectorConstants = require('../constants/PillSelectorConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _variables = [];
var _variable_search;
var _selected_variable;

/**
 * Initialize the list of variables.
 * @param  {array} variables The variables
 */
function initialize(variables) {
  _variables = variables;
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
 function setSelectedVariable(variable) {
   _selected_variable = variable;
}


var PillSelectorStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire DATASET.
   * @return {object}
   */
  get: function() {
    return _variables;
  },

  /**
   * Get the VARIABLE search string.
   * @return {string}
   */
  getVariableSearch: function() {
    return _variable_search;
  },

  getSelectedVariable: function(){
    return _selected_variable;
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
    // This is the INIT action for the variables
    case PillSelectorConstants.INIT:
      var variables = action.variables;

      if (variables !== {}) {
        initialize(variables);
        PillSelectorStore.emitChange();
      }
      break;


    case PillSelectorConstants.SEARCH:
      var variable_search = action.search;

      if (variable_search !== PillSelectorStore.getVariableSearch()){
        setVariableSearch(variable_search);
        PillSelectorStore.emitChange();
      }
      break;

    case PillSelectorConstants.SELECT:
      var selected_variable = action.variable;

      if (selected_variable !== ""){
        setSelectedVariable(selected_variable);
        PillSelectorStore.emitChange();
      }
      break;


    default:
      console.log('PillSelectorStore: No matching action');
      // no op
  }
});

module.exports = PillSelectorStore;
