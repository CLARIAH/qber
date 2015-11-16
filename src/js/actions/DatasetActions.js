var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var QBerAPI = require('../utils/QBerAPI');
var DatasetConstants = require('../constants/DatasetConstants');
var DimensionConstants = require('../constants/DimensionConstants');

var MessageConstants = require('../constants/MessageConstants');

/**
 *  Note that the QBerAPI also dispatches actions to stores!
 */
var DatasetActions = {
  initializeStore: function(){
    console.log("Initializing store...");
    QBerDispatcher.dispatch({
      actionType: MessageConstants.INFO,
      message: "Initializing store..."
    });

    QBerAPI.retrieveCommunityDimensions({
      success: function(response){
        QBerDispatcher.dispatch({
          actionType: DatasetConstants.DIMENSIONS_INIT,
          dimensions: response.dimensions
        });
      },
      error: function(response){
        QBerDispatcher.dispatch({
          actionType: MessageConstants.ERROR,
          message: response.message
        });
      }
    });

    QBerAPI.retrieveCommunitySchemes({
      success: function(response){
        console.log(response);
        QBerDispatcher.dispatch({
          actionType: DatasetConstants.SCHEMES_INIT,
          schemes: response.schemes
        });
      },
      error: function(response){
        QBerDispatcher.dispatch({
          actionType: MessageConstants.ERROR,
          message: response.message
        });
      }
    });
  },

  updateScheme: function(scheme){
    QBerDispatcher.dispatch({
      actionType: MessageConstants.INFO,
      message: "Adding "+ scheme.uri +" to schemes, if needed..."
    });

    QBerDispatcher.dispatch({
      actionType: DatasetConstants.SCHEME_UPDATE,
      scheme: scheme
    });
  },

  updateConcepts: function(scheme_uri){
    console.log("Retrieving list of concepts for "+ scheme_uri);
    QBerDispatcher.dispatch({
      actionType: MessageConstants.INFO,
      message: "Retrieving concepts for "+ scheme_uri
    });

    QBerAPI.retrieveConcepts({
      scheme_uri: scheme_uri,
      success: function(response){
        console.log(response);
        QBerDispatcher.dispatch({
          actionType: DatasetConstants.CONCEPTS_UPDATE,
          uri: scheme_uri,
          concepts: response.concepts
        });
        QBerDispatcher.dispatch({
          actionType: MessageConstants.INFO,
          message: "Succesfully received concepts for "+ scheme_uri
        });
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
   * @param {object} user The user object returned by the Google SignIn
   */
  registerUser: function(user){
    console.log('Registering user '+user.getName());

    QBerDispatcher.dispatch({
      actionType: MessageConstants.SUCCESS,
      message: 'Logged in as '+user.getName()
    });
    console.log('dispatching register_user');
    QBerDispatcher.dispatch({
      actionType: DatasetConstants.REGISTER_USER,
      user: user
    });
    console.log('dispatched register_user');
  },

  /**
   * @param {string} filename
   */
  retrieveDataset: function(filename){
    console.log('Retrieving dataset from '+filename);
    QBerDispatcher.dispatch({
      actionType: MessageConstants.INFO,
      message: 'Retrieving dataset from '+filename
    });
    // Call the QBerAPI with the filename, and implement the success callback
    QBerAPI.retrieveDatasetDefinition({
      filename: filename,
      success: function(dataset){
        QBerDispatcher.dispatch({
          actionType: MessageConstants.SUCCESS,
          message: 'Successfully loaded dataset '+dataset.name
        });

        QBerDispatcher.dispatch({
          actionType: DatasetConstants.DATASET_INIT,
          dataset: dataset
        });

        QBerDispatcher.dispatch({
          actionType: DimensionConstants.SDMX_DIMENSION_INIT,
          variables: dataset.variables
        })
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
   * @param {string} variable
   */
  chooseVariable: function(variable) {
    QBerDispatcher.dispatch({
      actionType: MessageConstants.INFO,
      message: 'You selected variable '+variable
    });

    QBerDispatcher.dispatch({
      actionType: DatasetConstants.DATASET_CHOOSE_VARIABLE,
      variable: variable
    });

    QBerDispatcher.dispatch({
      actionType: DimensionConstants.SDMX_DIMENSION_SET_VARIABLE,
      variable: variable
    });
  },

  /**
   * Save the dataset to cache
   */
  saveDataset: function(dataset) {
    QBerDispatcher.dispatch({
      actionType: MessageConstants.INFO,
      message: 'Saving dataset to cache'
    });
    console.log(dataset);
    // Call the QBerAPI with the dataset, and implement the success callback
    QBerAPI.saveDataset({
      dataset: dataset,
      success: function(response){
        QBerDispatcher.dispatch({
          actionType: MessageConstants.SUCCESS,
          message: 'Successfully saved dataset to cache'
        });
      },
      error: function(response){
        QBerDispatcher.dispatch({
          actionType: MessageConstants.ERROR,
          message: 'Error saving dataset to cache '+response.message
        });
      }
    });
  },




};

module.exports = DatasetActions;
