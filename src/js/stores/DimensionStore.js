var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var EventEmitter = require('events').EventEmitter;
var DatasetConstants = require('../constants/DatasetConstants');
var DimensionConstants = require('../constants/DimensionConstants');
var assign = require('object-assign');
var _ = require('lodash');

var CHANGE_EVENT = 'change';

// The list of variables in the dataset
var _variables = [];
// The visibility status of the SDMX Dimension Modal
var _modal_visible = false;
// The selected variable
var _variable_name;

/**
 * Initialize the list of variables.
 * @param  {array} variables The variables
 */
function initialize(variables) {
  _variables = variables;
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
 function setVariable(variable_name) {
   console.log('Variable set to '+ variable_name);
   _variable_name = variable_name;
}

/**
 * Assign the selected dimension to the currently selected variable
 * @param  {object} dimension The selected dimension details
 */
 function assignDimension(definition) {
   console.log('Assigning dimension ' + definition.uri);
   console.log(definition);

   // Retrieve the current variable definition
   var variable_definition = _variables[_variable_name];

   console.log(variable_definition);

   _variables[_variable_name] = _.assign(variable_definition, definition);
   // First we clear out any existing information about this variable
   // (e.g. previously added mappings)
  //  _mappings[_variable_name] = {};
  //  // Assign the dimension to the variable.
  //  _mappings[_variable_name].dimension = dimension;
  //  _mappings[_variable_name].dimension.type = type;
}



/**
* Assign the retrieved codes to the currently selected dimension
* @param  {object} codes The retrieved codes
*/
function assignMapping(value, code_uri) {
   console.log('Assigning code uri to code value');
   console.log(value + " > " + code_uri);
   console.log(_variables[_variable_name].values);
   var values = _variables[_variable_name].values;
   var index = _.indexOf(values, _.find(values,{label: value}));
   console.log(index);
   // Assign the selected concept uri to the value.
   _variables[_variable_name].values[index].uri = code_uri;
}




var DimensionStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the list of variables.
   * @return {object}
   */
  getVariables: function() {
    return _variables;
  },


  /**
   * Get the definition of the currently selected variable
   * @return {object} The variable definition
   */
  getVariable: function() {
    if (_variables[_variable_name] !== undefined){
      return _variables[_variable_name];
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
  console.log('DimensionStore: received '+action.actionType);

  switch(action.actionType) {
    // This is the INIT action for the variables
    case DimensionConstants.SDMX_DIMENSION_INIT:
      var variables = action.variables;
      if (variables !== {}) {
        initialize(variables);
        DimensionStore.emitChange();
      }
      break;
    // Once a variable from the source dataset is selected, make this known to the SDMX Store
    case DimensionConstants.SDMX_DIMENSION_SET_VARIABLE:
      var variable = action.variable;
      setVariable(variable);
      DimensionStore.emitChange();
      break;
    // Once a dimension has been selected in the modal, or a value has changed in the dimension metadata panel
    case DimensionConstants.SDMX_DIMENSION_ASSIGN:
      console.log(action);
      var definition = action.definition;
      assignDimension(definition);
      DimensionStore.emitChange();
      break;
    // We've obtained a safe IRI based on the dataset and variable name
    case DimensionConstants.SDMX_DIMENSION_BUILD:
      var build_dimension_type = action.dimension_type;
      var values = action.values;
      var datasetName = action.datasetName;
      buildDimension(build_dimension_type, values, datasetName);
      DimensionStore.emitChange();
      break;
    // The dimension details have been updated (codes)
    case DimensionConstants.SDMX_CODES_ASSIGN:
      var codes = action.codes;
      assignCodes(codes);
      DimensionStore.emitChange();
      break;
    // The dimension panel should be made visible
    case DimensionConstants.SDMX_DIMENSION_SHOW:
      setModalVisible();
      DimensionStore.emitChange();
      break;
    // The dimension panel should be made hidden
    case DimensionConstants.SDMX_DIMENSION_HIDE:
      setModalHidden();
      DimensionStore.emitChange();
      break;
    // A mapping has been selected between a code value and a code uri
    case DimensionConstants.SDMX_DIMENSION_MAP:
      var value = action.value;
      var uri = action.uri;
      assignMapping(value, uri);
      DimensionStore.emitChange();
      break;
    default:
      console.log('DimensionStore: No matching action');
      // no op
  }
});

module.exports = DimensionStore;
