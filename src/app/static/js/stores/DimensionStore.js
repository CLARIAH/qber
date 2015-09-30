var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var EventEmitter = require('events').EventEmitter;
var DatasetConstants = require('../constants/DatasetConstants');
var DimensionConstants = require('../constants/DimensionConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

// The list of dimensions obtained from the LOD cloud + CSDH
var _dimensions = [];
// The visibility status of the SDMX Dimension Modal
var _modal_visible = false;
// The accumulated mappings between variables in the dataset and selected dimensions
var _mappings = {};
// The selected variable
var _variable;

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
   console.log('Variable set to '+ variable);
   _variable = variable;
}

/**
 * Assign the selected dimension to the currently selected variable
 * @param  {object} dimension The selected dimension details
 */
 function assignDimension(type, dimension) {
   console.log('Assigning dimension');
   console.log(dimension);
   // First we clear out any existing information about this variable
   // (e.g. previously added mappings)
   _mappings[_variable] = {};
   // Assign the dimension to the variable.
   _mappings[_variable].dimension = dimension;
   _mappings[_variable].dimension.type = type;
}
/**
 * Generate a dimension from the variable, its codes, and the name of the datasset
 * @param  {object} codes The codes for this variable
 * @param  {string} datasetName The name of the current dataset
 */
function buildDimension(codes, datasetName){
  var URI_BASE = "http://data.socialhistory.org/resource/";

  // A simple URI based on the variable name (probably not valid)
  var uri = URI_BASE + datasetName + '/dimension/' + _variable;
  var label = _variable;
  var description = "The dimension '" + _variable + "' as taken from the '" + datasetName + "' dataset";
  var type = "coded" // One of community, coded, identifier, other
  // var type = "http://purl.org/linked-data/cube#DimensionProperty";

  var codelist_uri = URI_BASE + datasetName + '/codelist/' + _variable;
  var codelist_label = 'Code list for ' + _variable;
  var codelist = [];

  for (var key in codes){
   var code_label = codes[key].id;
   var code_uri = URI_BASE + datasetName + '/code/' + codes[key].id;

   codelist.push({
     uri: code_uri,
     label: code_label
   });
  }

  var dimension = {
    uri: uri,
    label: label,
    description: description,
    codelist: {
      uri: codelist_uri,
      label: codelist_label,
      codes: codelist
    }
  };

  assignDimension(type, dimension);

 }
 /**
  * Assign the retrieved codes to the currently selected dimension
  * @param  {object} codes The retrieved codes
  */
  function assignCodes(codes) {
    console.log('Assigning codes');
    console.log(codes);
    // First we clear out any existing information about this codelist
    // (e.g. previously added mappings)
    _mappings[_variable].dimension.codelist.codes = [];
    // Assign the codes to the codelist.
    _mappings[_variable].dimension.codelist.codes = codes;
 }



/**
 * Build a dimension from the current variable name and codes
 * @param  {string} iri The new IRI
 */
 function setIRI(iri) {
   console.log('IRI set to '+ iri)
   _mappings[_variable].dimension.uri = iri;
}


var DimensionStore = assign({}, EventEmitter.prototype, {

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
  console.log('DatasetStore: received '+action.actionType);

  switch(action.actionType) {
    // This is the INIT action for the dimensions
    case DimensionConstants.SDMX_DIMENSION_INIT:
      var dimensions = action.dimensions;

      if (dimensions !== {}) {
        initialize(dimensions);
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
      var dimension = action.dimension_details;
      var type = action.dimension_type;
      assignDimension(type, dimension);
      DimensionStore.emitChange();
      break;
    // We've obtained a safe IRI based on the dataset and variable name
    case DimensionConstants.SDMX_DIMENSION_BUILD:
      var codes = action.codes;
      var datasetName = action.datasetName;
      buildDimension(codes, datasetName);
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


    default:
      console.log('DimensionStore: No matching action');
      // no op
  }
});

module.exports = DimensionStore;
