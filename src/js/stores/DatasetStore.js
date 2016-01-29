var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var EventEmitter = require('events').EventEmitter;
var DatasetConstants = require('../constants/DatasetConstants');
var MessageStore = require('./MessageStore');
var BrowserStore = require('./BrowserStore');
var assign = require('object-assign');
var _ = require('lodash');

var CHANGE_EVENT = 'change';

var _dataset;
var _schemes;
var _dimensions;
var _variable;
var _variable_search;
var _just_selected_variable = false;
var _user;

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
 * Set the list of dimensions.
 * @param {array} dimensions The list of community dimensions
 */
function setDimensions(dimensions){
  _dimensions = dimensions;
}

/**
 * Set the list of concept schemes.
 * @param {array} schemes The list of community schemes
 */
function setSchemes(schemes){
  _schemes = schemes;
}

/**
 * Add a potentially new concept scheme
 * @param {object} scheme The URI and label of the concept scheme
 */
function updateScheme(scheme){
  var index = _.indexOf(_schemes, _.find(_schemes, {uri: scheme.uri}));

  if (index > -1){
    _schemes.push(scheme);
  } else {

  }
}


/**
 * Assign a list of concepts to a concept scheme.
 * @param {string} uri The uri of the concept scheme
 * @param {array} concepts The list of concepts
 */
function assignConcepts(uri, concepts){
  var index = _.indexOf(_schemes, _.find(_schemes, {'uri': uri}));

  if (index > -1){
    var updated_scheme = _schemes[index];

    updated_scheme.concepts = concepts;
    _schemes.splice(index, 1, updated_scheme);

  } else {

  }
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
    if (_dataset === undefined || _dataset.variables === undefined){
      return [];
    } else {
      var variables_mappings = new Array();
      for (var varmap in _dataset.variables) {
        variables_mappings.push(({'label': varmap, 'mapped': _dataset.variables[varmap].mapped}));
      }
      //return Object.keys(_dataset.variables);
      return variables_mappings;
    }
  },


  /**
   * Get the selected VARIABLE.
   * @return {string}
   */
  getSelectedVariable: function() {
    return _variable;
  },

  /**
   * Get the community defined dimensions.
   * @return {array}
   */
  getDimensions: function() {
    return _dimensions;
  },

  /**
   * Get the schemes.
   * @return {array}
   */
  getSchemes: function() {
    return _schemes;
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
QBerDispatcher.register(function(action) {
  var dataset;
  var variable;


  switch(action.actionType) {
    // Register the logged in user
    case DatasetConstants.REGISTER_USER:
      if (action.user !== undefined) {
        setUser(action.user);

        DatasetStore.emitChange();

      }
      break;
    // We have retrieved a list of dimensions from the CSDH
    case DatasetConstants.DIMENSIONS_INIT:

      dimensions = action.dimensions;
      if (dimensions !== undefined) {
        setDimensions(dimensions);
        DatasetStore.emitChange();
      }
      break;
    // We have retrieved a list of concept schemes from the CSDH
    case DatasetConstants.SCHEMES_INIT:

      schemes = action.schemes;
      if (schemes !== undefined) {
        setSchemes(schemes);
        DatasetStore.emitChange();
      }
      break;
    // We have retrieved a new concept scheme
    case DatasetConstants.SCHEME_UPDATE:

      scheme = action.scheme;
      if (scheme !== undefined) {
        updateScheme(scheme);
        DatasetStore.emitChange();
      }
      break;
    // We have retrieved a list of concepts for a scheme
    case DatasetConstants.CONCEPTS_UPDATE:

      uri = action.uri;
      concepts = action.concepts;
      if (concepts !== undefined && uri !== undefined) {
        assignConcepts(uri, concepts);
        DatasetStore.emitChange();
      }
      break;
    // This is the INIT action for the dataset
    case DatasetConstants.DATASET_INIT:
      dataset = action.dataset;
      if (dataset !== undefined) {
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

      // no op
  }
});

module.exports = DatasetStore;
