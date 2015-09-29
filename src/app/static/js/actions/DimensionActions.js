var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var QBerAPI = require('../utils/QBerAPI');
var DimensionConstants = require('../constants/DimensionConstants');
var DatasetConstants = require('../constants/DatasetConstants');
var MessageConstants = require('../constants/MessageConstants');


var DimensionActions = {


  /**
   * @param {string} dimension
   */
  chooseDimension: function(dimension) {
    console.log("You chose dimension: "+dimension);
    QBerDispatcher.dispatch({
      actionType: MessageConstants.INFO,
      message: 'Retrieving details for '+dimension
    });

    this.hideDimensions();

    QBerAPI.retrieveDimension({
      dimension: dimension,
      success: function(dimension_details){
        QBerDispatcher.dispatch({
          actionType: MessageConstants.SUCCESS,
          message: "Successfully retrieved dimension "+ dimension
        });
        QBerDispatcher.dispatch({
          actionType: DimensionConstants.SDMX_DIMENSION_ASSIGN,
          dimension_details: dimension_details
        });

        if (dimension_details.codelist) {
          QBerDispatcher.dispatch({
            actionType: MessageConstants.INFO,
            message: "Retrieving codes for "+ dimension_details.codelist.uri
          });

          QBerAPI.retrieveCodes({
            codelist_uri: dimension_details.codelist.uri,
            success: function(codes){
              QBerDispatcher.dispatch({
                actionType: MessageConstants.SUCCESS,
                message: "Retrieved codes for "+ dimension_details.codelist.uri
              });
              QBerDispatcher.dispatch({
                actionType: DimensionConstants.SDMX_CODES_ASSIGN,
                codes: codes
              });
            },
            error: function(codelist_uri){
              QBerDispatcher.dispatch({
                actionType: MessageConstants.ERROR,
                message: "Could not retrieve codes for "+ dimension_details.codelist.uri
              });
            }
          });

        }

      },
      error: function(dimension){
        QBerDispatcher.dispatch({
          actionType: MessageConstants.ERROR,
          message: "Could not retrieve dimension "+ dimension
        });

        // Dispatch an 'empty' dimension_details object
        var dimension_details = {'uri': dimension};
        QBerDispatcher.dispatch({
          actionType: DimensionConstants.SDMX_DIMENSION_ASSIGN,
          dimension_details: dimension_details
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
  buildDimension: function(codes, datasetName){
    QBerDispatcher.dispatch({
      actionType: DimensionConstants.SDMX_DIMENSION_BUILD,
      codes: codes,
      datasetName: datasetName
    })
  },


  /**
   * @param {string} unsafe_iri
   */
  retrieveIRI: function(unsafe_iri){
    console.log('Retrieving safe IRI based on '+unsafe_iri);
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
          message: 'Could not generate safe IRI from '+filename
        });
      }
    });
  },


};

module.exports = DimensionActions;
