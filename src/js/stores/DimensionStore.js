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

   _variable_name = variable_name;
}

/**
 * Assign the selected dimension to the currently selected variable
 * @param  {object} dimension The selected dimension details
 */
function assignDimension(definition) {



   // Retrieve the current variable definition
   var variable_definition = _variables[_variable_name];

   // Determine category
   if((definition.type == "http://purl.org/linked-data/cube#DimensionProperty" &&
       definition.codelist !== undefined) ||
       definition.type == "http://purl.org/linked-data/cube#CodedProperty"){

     definition.category = "coded";
   } else if (definition.type == "http://purl.org/linked-data/cube#DimensionProperty") {

     definition.category = "identifier";
   } else if (definition.type == "http://purl.org/linked-data/cube#MeasureProperty") {
     
     definition.category = "other";
   } else {

     definition.category = "other";
   }

   _variables[_variable_name] = _.merge(variable_definition, definition);

}

/**
 * Assign the selected scheme to the currently selected variable
 * @param  {object} scheme The selected scheme details
 */
 function assignScheme(scheme) {



   // Get the scheme metadata (excluding any existing codes)
   var basic_scheme = _.pick(scheme, 'uri', 'label');

   // Retrieve the current variable definition
   var variable_scheme = _variables[_variable_name].codelist;

   _variables[_variable_name].codelist = _.merge(variable_scheme, basic_scheme);

}

/**
 * Turn the selected variable into an 'identifier'
 */
 function buildIdentifier() {


   // Setting category to 'identifier'
   _variables[_variable_name].category = 'identifier';
   _variables[_variable_name].type = 'http://purl.org/linked-data/cube#DimensionProperty';

   resetToDefaults();
}


/**
 * Turn the selected variable into a 'coded' variable
 */
 function buildCodedVariable() {


   // Setting category to 'identifier'
   _variables[_variable_name].category = 'coded';
   _variables[_variable_name].type = 'http://purl.org/linked-data/cube#DimensionProperty';

   resetToDefaults();
}

/**
 * Turn the selected variable into a 'coded' variable
 */
 function buildOther() {


   // Setting category to 'other'
   _variables[_variable_name].category = 'other';
   _variables[_variable_name].type = 'http://purl.org/linked-data/cube#MeasureProperty';

   resetToDefaults();
}


/**
 * Reset all values for 'uri' to their defaults
 */
function resetToDefaults(){
  // Replace all 'uri' attributes with the value for 'default'
  // Replace all 'literal' attributes with the value for 'label'
  for (var key in _variables[_variable_name].values){
    _variables[_variable_name].values[key].uri = _variables[_variable_name].values[key].default;
    _variables[_variable_name].values[key].literal = _variables[_variable_name].values[key].label;
  }

  // Reset the codelist uri and label to its default
  // TODO: Check whether we should take this from the props.codelists array
  _variables[_variable_name].codelist.uri = _variables[_variable_name].codelist.default;
  _variables[_variable_name].codelist.label = "Code list for `" + _variable_name + "`";
}


/**
 * Run a transformation function on the values
 */
function applyTransformFunction(func_body){
  // Replace all 'literal' attributes with the value returned by the function, applied to 'label'

  var f = new Function('v', func_body);

  for (var key in _variables[_variable_name].values){
    _variables[_variable_name].values[key].literal = f(_variables[_variable_name].values[key].label);
  }
}

/**
* Assign the retrieved codes to the currently selected dimension
* @param  {object} codes The retrieved codes
*/
function assignMapping(value_uri, code_uri) {



   var values = _variables[_variable_name].values;
   var index = _.indexOf(values, _.find(values,{uri: value_uri}));

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

      var definition = action.definition;
      assignDimension(definition);
      DimensionStore.emitChange();
      break;
    // Revert the uri attributes in the values array to the default
    case DimensionConstants.SDMX_BUILD_IDENTIFIER:
      buildIdentifier();
      DimensionStore.emitChange();
      break;
    // Set the dimension type to 'coded'
    case DimensionConstants.SDMX_BUILD_CODED_VARIABLE:
      buildCodedVariable();
      DimensionStore.emitChange();
      break;
    // Set the dimension type to 'other'
    case DimensionConstants.SDMX_BUILD_OTHER:
      buildOther();
      DimensionStore.emitChange();
      break;
    // Apply a transformation function to the values
    case DimensionConstants.SDMX_APPLY_TRANSFORM:
      var func = action.func;
      applyTransformFunction(func);
      DimensionStore.emitChange();
      break;
    // The dimension details have been updated (codes)
    case DimensionConstants.SDMX_SCHEME_ASSIGN:
      var scheme = action.scheme;
      assignScheme(scheme);
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

      // no op
  }
});

module.exports = DimensionStore;
