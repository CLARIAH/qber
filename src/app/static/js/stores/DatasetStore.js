var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var EventEmitter = require('events').EventEmitter;
var DatasetConstants = require('../constants/DatasetConstants');
var MessageStore = require('./MessageStore');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _dataset;
var _variable;
var _variable_search;
var _just_selected_variable = false;
var _user;

/**
 * Initialize the DATASET.
 * @param  {object} dataset The content of the DATASET
 */
function initialize(dataset) {
  console.log("Initializing DatasetStore");
  console.log(dataset);
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
 * Set the user.
 * @param {object} user The user details
 */
function setUser(user){
  _user = user;
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
   * Get all variable names in the DATASET.
   * @return {object}
   */
  getVariableNames: function() {
    if (_dataset === undefined || _dataset.codes === undefined){
      return []
    } else {
      return Object.keys(_dataset.codes);
    }
  },


  /**
   * Get the selected VARIABLE.
   * @return {string}
   */
  getVariable: function() {
    return _variable;
  },

  /**
   * Get the user details.
   * @return {object}
   */
  getUser: function(){
    return _user;
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
DatasetStore.dispatchToken = QBerDispatcher.register(function(action) {
  var dataset;
  var variable;

  switch(action.actionType) {
    // Register the logged in user
    case DatasetConstants.REGISTER_USER:
      QBerDispatcher.waitFor([BrowserStore.dispatchToken]);
      if (action.user !== {}) {
        setUser(action.user);
        DatasetStore.emitChange();
      }
      break;
    // This is where we set the currently selected variable
    // This is the INIT action for the dataset
    case DatasetConstants.DATASET_INIT:
      QBerDispatcher.waitFor([MessageStore.dispatchToken]);
      dataset = action.dataset;
      if (dataset !== undefined) {
        initialize(dataset);
        DatasetStore.emitChange();
      }
      break;
    // This is where we set the currently selected variable
    case DatasetConstants.DATASET_CHOOSE_VARIABLE:
      QBerDispatcher.waitFor([MessageStore.dispatchToken]);
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
