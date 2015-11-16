var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var QBerAPI = require('../utils/QBerAPI');
var DimensionConstants = require('../constants/DimensionConstants');
var DatasetConstants = require('../constants/DatasetConstants');
var MessageConstants = require('../constants/MessageConstants');
var DatasetActions = require('../actions/DatasetActions');


var DimensionActions = {


  /**
   * @param {string} dimension
   */
  chooseDimension: function(dimension) {
    
    QBerDispatcher.dispatch({
      actionType: MessageConstants.INFO,
      message: 'Retrieving details for '+dimension
    });

    // Hide the modal dialog
    this.hideDimensions();

    QBerAPI.retrieveDimension({
      dimension: dimension,
      success: function(response){
        QBerDispatcher.dispatch({
          actionType: MessageConstants.SUCCESS,
          message: "Successfully retrieved dimension "+ dimension
        });

        var definition = response.definition;
        QBerDispatcher.dispatch({
          actionType: DimensionConstants.SDMX_DIMENSION_ASSIGN,
          definition: definition
        });

        if (definition.codelist) {
          DatasetActions.updateScheme(definition.codelist);
          DatasetActions.updateConcepts(definition.codelist.uri);
        }

      },
      error: function(response){
        QBerDispatcher.dispatch({
          actionType: MessageConstants.ERROR,
          message: response.message
        });
      }
    });
  },

  /**
   * Updated dimension details (e.g. the URI of a definition, a pre-existing code
   * list etc.), assign them to the current variable.
   */
  updateDimension: function(dimension_details) {
    QBerDispatcher.dispatch({
      actionType: DimensionConstants.SDMX_DIMENSION_ASSIGN,
      dimension_details: dimension_details
    });
  },


  /**
   * Show the dimension panel (the modal in which codes are mapped to dimensions)
   */
  showDimensions: function() {
    QBerDispatcher.dispatch({
      actionType: DimensionConstants.SDMX_DIMENSION_SHOW,
    });
  },

  /**
   * Close the dimension panel (the modal in which codes are mapped to dimensions)
   */
  hideDimensions: function() {
    QBerDispatcher.dispatch({
      actionType: DimensionConstants.SDMX_DIMENSION_HIDE,
    });
  },

  /**
   * The user has specified to prefer to use a generated dimension definition
   * rather than a pre-existing one
   */
  buildCodedVariable: function(){
    QBerDispatcher.dispatch({
      actionType: DimensionConstants.SDMX_BUILD_CODED_VARIABLE
    });
  },

  /**
   * The user has specified that the selected variable values are identifiers (not codes)
   */
  buildIdentifier: function(){
    QBerDispatcher.dispatch({
      actionType: DimensionConstants.SDMX_BUILD_IDENTIFIER
    });
  },

  /**
   * The user has specified that this variable is in fact a measurement (i.e. a literal)
   */
  buildOther: function(){
    QBerDispatcher.dispatch({
      actionType: DimensionConstants.SDMX_BUILD_OTHER,
    });
  },

  /**
   * The user has specified that a value in the data matches a certain code
   */
  addMapping: function(code_value, code_uri){
    QBerDispatcher.dispatch({
      actionType: DimensionConstants.SDMX_DIMENSION_MAP,
      value: code_value,
      uri: code_uri
    });
  },


  /**
   * The user has specified that this variable should use a specific coding scheme
   */
  chooseScheme: function(scheme){
    // Retrieve the list of concepts belonging to this scheme
    DatasetActions.updateConcepts(scheme.uri);

    QBerDispatcher.dispatch({
      actionType: DimensionConstants.SDMX_SCHEME_ASSIGN,
      scheme: scheme
    });
  },

  /**
   * The user wants to apply a JavaScript function to the values of the variable
   */
  applyTransformFunction: function(func){
    QBerDispatcher.dispatch({
      actionType: DimensionConstants.SDMX_APPLY_TRANSFORM,
      func: func
    });
  },

  /**
   * @param {string} unsafe_iri
   */
  retrieveIRI: function(unsafe_iri){
    
    QBerDispatcher.dispatch({
      actionType: MessageConstants.INFO,
      message: 'Retrieving safe IRI based on '+unsafe_iri
    });
    // Call the QBerAPI with the filename, and implement the success callback
    QBerAPI.retrieveIRI({
      iri: unsafe_iri,
      success: function(iri){
        QBerDispatcher.dispatch({
          actionType: MessageConstants.SUCCESS,
          message: 'Successfully minted fresh IRI '+iri
        });

        QBerDispatcher.dispatch({
          actionType: DimensionConstants.SDMX_DIMENSION_UPDATE_IRI,
          iri: iri
        });
      },
      error: function(unsafe_iri){
        QBerDispatcher.dispatch({
          actionType: MessageConstants.ERROR,
          message: 'Could not generate safe IRI from '+unsafe_iri
        });
      }
    });
  },


};

module.exports = DimensionActions;
