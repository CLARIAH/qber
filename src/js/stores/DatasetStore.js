var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var EventEmitter = require('events').EventEmitter;
var DatasetConstants = require('../constants/DatasetConstants');
var DimensionConstants = require('../constants/DimensionConstants');
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
var _value;

// The selected variable
var _variable_name;

/**
 * Initialize the DATASET.
 * @param  {object} dataset The contents of the DATASET as returned by the API
 */
function initialize(dataset) {
    _dataset = dataset;
}


/**
 * Set the selected VARIABLE .
 * @param {string} variable The to be selected VARIABLE
 */
function setVariable(variable) {
    _variable = variable;
    _variable_name = variable.label;
}

/**
 * Set the selected VALUE .
 * @param {string} value The to be selected VALUE
 */
function setValue(value) {
    _value = value;
}


/**
 * Set the list of dimensions.
 * @param {array} dimensions The list of community dimensions
 */
function setDimensions(dimensions) {
    _dimensions = dimensions;
}

/**
 * Set the list of concept schemes.
 * @param {array} schemes The list of community schemes
 */
function setSchemes(schemes) {
    _schemes = schemes;
}

/**
 * Add a potentially new concept scheme
 * @param {object} scheme The URI and label of the concept scheme
 */
function updateScheme(scheme) {
    var index = _.indexOf(_schemes, _.find(_schemes, {
        uri: scheme.uri
    }));

    if (index > -1) {
        _schemes.push(scheme);
    } else {

    }
}


/**
 * Assign a list of concepts to a concept scheme.
 * @param {string} uri The uri of the concept scheme
 * @param {array} concepts The list of concepts
 */
function assignConcepts(uri, concepts) {
    var index = _.indexOf(_schemes, _.find(_schemes, {
        'uri': uri
    }));

    if (index > -1) {
        var updated_scheme = _schemes[index];

        updated_scheme.concepts = concepts;
        _schemes.splice(index, 1, updated_scheme);

    } else {

    }
}

/**
 * Assign the selected scheme to the currently selected variable
 * @param  {object} scheme The selected scheme details
 */
function assignScheme(scheme) {



    // Get the scheme metadata (excluding any existing codes)
    var basic_scheme = _.pick(scheme, 'uri', 'label');

    // Retrieve the current variable definition
    var variable_scheme = _dataset.variables[_variable_name].codelist;

    _dataset.variables[_variable_name].codelist = _.merge(variable_scheme, basic_scheme);

}

/**
 * Assign the selected dimension to the currently selected variable
 * @param  {object} dimension The selected dimension details
 */
function assignDimension(definition) {



    // Retrieve the current variable definition
    var variable_definition = _dataset.variables[_variable_name];

    // Determine category
    if ((definition.type == "http://purl.org/linked-data/cube#DimensionProperty" &&
            definition.codelist !== undefined) ||
        definition.type == "http://purl.org/linked-data/cube#CodedProperty") {

        definition.category = "coded";
    } else if (definition.type == "http://purl.org/linked-data/cube#DimensionProperty") {

        definition.category = "identifier";
    } else if (definition.type == "http://purl.org/linked-data/cube#MeasureProperty") {

        definition.category = "other";
    } else {

        definition.category = "other";
    }

    _dataset.variables[_variable_name] = _.merge(variable_definition, definition);

}



/**
 * Turn the selected variable into an 'identifier'
 */
function buildIdentifier() {


    // Setting category to 'identifier'
    _dataset.variables[_variable_name].category = 'identifier';
    _dataset.variables[_variable_name].type = 'http://purl.org/linked-data/cube#DimensionProperty';

    resetToDefaults();
}


/**
 * Turn the selected variable into a 'coded' variable
 */
function buildCodedVariable() {


    // Setting category to 'identifier'
    _dataset.variables[_variable_name].category = 'coded';
    _dataset.variables[_variable_name].type = 'http://purl.org/linked-data/cube#DimensionProperty';

    resetToDefaults();
}

/**
 * Turn the selected variable into a 'coded' variable
 */
function buildOther() {


    // Setting category to 'other'
    _dataset.variables[_variable_name].category = 'other';
    _dataset.variables[_variable_name].type = 'http://purl.org/linked-data/cube#MeasureProperty';

    resetToDefaults();
}


/**
 * Reset all values for 'uri' to their defaults
 */
function resetToDefaults() {
    // Replace all 'uri' attributes with the value for 'default'
    // Replace all 'literal' attributes with the value for 'label'
    for (var key in _dataset.variables[_variable_name].values) {
        _dataset.variables[_variable_name].values[key].uri = _dataset.variables[_variable_name].values[key].original.uri;
        _dataset.variables[_variable_name].values[key].label = _dataset.variables[_variable_name].values[key].original.label;
    }

    // Reset the codelist uri and label to its default
    // TODO: Check whether we should take this from the props.codelists array
    _dataset.variables[_variable_name].codelist.uri = _dataset.variables[_variable_name].codelist.original.uri;
    _dataset.variables[_variable_name].codelist.label = _dataset.variables[_variable_name].codelist.original.label;
}


/**
 * Run a transformation function on the values
 */
function applyTransformFunction(func_body) {
    // Replace all 'literal' attributes with the value returned by the function, applied to 'label'

    var f = new Function('v', func_body);

    for (var key in _dataset.variables[_variable_name].values) {
        _dataset.variables[_variable_name].values[key].label = f(_dataset.variables[_variable_name].values[key].original.label);
    }
}

/**
 * Assign the retrieved codes to the currently selected dimension
 * @param  {object} codes The retrieved codes
 */
function assignMapping(value_uri, code_uri) {
    var values = _dataset.variables[_variable_name].values;
    var index = _.indexOf(values, _.find(values, {
        uri: value_uri
    }));

    // Assign the selected concept uri to the value.
    _dataset.variables[_variable_name].values[index].uri = code_uri;
    // If the mapping is new, increase the mapping counter
    _dataset.variables[_variable_name].mapped += 1 / _dataset.variables[_variable_name].values.length;
    console.log(_dataset.variables[_variable_name].mapped);
}

/**
 * Set the user.
 * @param {object} user The user details
 */
function setUser(user) {
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
     * Get the list of variables.
     * @return {object}
     */
    getVariables: function() {
        return _dataset.variables;
    },

    /**
     * Get the list of variables and their mapping status.
     * @return [array] of {'label' : label, 'mapped': mapped} objects
     */
    getVariableNames: function() {
        if (_dataset == undefined) {
          return [];
        }
        var variables_mappings = [];
        for (var varmap in _dataset.variables) {
            variables_mappings.push(({
                'label': varmap,
                'mapped': _dataset.variables[varmap].mapped
            }));
        }
        //return Object.keys(_dataset.variables);
        return variables_mappings;
    },

    /**
     * Get the definition of the currently selected variable
     * @return {object} The variable definition
     */
    getVariable: function() {
        if (_dataset.variables[_variable_name] !== undefined) {
            return _dataset.variables[_variable_name];
        } else {
            return undefined;
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
     * Get the selected VALUE.
     * @return {string}
     */
    getSelectedValue: function() {
        return _value;
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
    getUser: function() {
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
    console.log(action.actionType);

    switch (action.actionType) {
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
            if (variable !== "") {
                setVariable(variable);
                DatasetStore.emitChange();
            }
            break;
            // This is where we set the currently selected variable
        case DatasetConstants.DATASET_CHOOSE_VALUE:
            value = action.value;
            if (value !== "") {
                setValue(value);
                DatasetStore.emitChange();
            }
            break;
        //     // This is the INIT action for the variables
        // case DimensionConstants.SDMX_DIMENSION_INIT:
        //     var variables = action.variables;
        //     //console.log(variables);
        //     if (variables !== {}) {
        //         initialize(variables);
        //         DatasetStore.emitChange();
        //     }
        //     break;
            // Once a dimension has been selected in the modal, or a value has changed in the dimension metadata panel
        case DimensionConstants.SDMX_DIMENSION_ASSIGN:

            var definition = action.definition;
            assignDimension(definition);
            DatasetStore.emitChange();
            break;
            // Revert the uri attributes in the values array to the default
        case DimensionConstants.SDMX_BUILD_IDENTIFIER:
            buildIdentifier();
            DatasetStore.emitChange();
            break;
            // Set the dimension type to 'coded'
        case DimensionConstants.SDMX_BUILD_CODED_VARIABLE:
            buildCodedVariable();
            DatasetStore.emitChange();
            break;
            // Set the dimension type to 'other'
        case DimensionConstants.SDMX_BUILD_OTHER:
            buildOther();
            DatasetStore.emitChange();
            break;
            // Apply a transformation function to the values
        case DimensionConstants.SDMX_APPLY_TRANSFORM:
            var func = action.func;
            applyTransformFunction(func);
            DatasetStore.emitChange();
            break;
            // The dimension details have been updated (codes)
        case DimensionConstants.SDMX_SCHEME_ASSIGN:
            var scheme = action.scheme;
            assignScheme(scheme);
            DatasetStore.emitChange();
            break;
            // The dimension panel should be made visible
        case DimensionConstants.SDMX_DIMENSION_SHOW:
            setModalVisible();
            DatasetStore.emitChange();
            break;
            // The dimension panel should be made hidden
        case DimensionConstants.SDMX_DIMENSION_HIDE:
            setModalHidden();
            DatasetStore.emitChange();
            break;
            // A mapping has been selected between a code value and a code uri
        case DimensionConstants.SDMX_DIMENSION_MAP:
            var value = action.value;
            var uri = action.uri;
            console.log(value);
            console.log(uri);
            assignMapping(value, uri);
            DatasetStore.emitChange();
            break;

        default:

            // no op
    }
});

module.exports = DatasetStore;
