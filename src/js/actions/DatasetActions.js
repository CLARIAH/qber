var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var QBerAPI = require('../utils/QBerAPI');
var DatasetConstants = require('../constants/DatasetConstants');
var DimensionConstants = require('../constants/DimensionConstants');
var MessageConstants = require('../constants/MessageConstants');
var NavbarConstants = require('../constants/NavbarConstants');


/**
 *  Note that the QBerAPI also dispatches actions to stores!
 */
var DatasetActions = {
  initializeStore: function(){

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

    QBerDispatcher.dispatch({
      actionType: MessageConstants.INFO,
      message: "Retrieving concepts for "+ scheme_uri
    });

    QBerAPI.retrieveConcepts({
      scheme_uri: scheme_uri,
      success: function(response){

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


    QBerDispatcher.dispatch({
      actionType: MessageConstants.SUCCESS,
      message: 'Logged in as '+user.getName()
    });

    QBerDispatcher.dispatch({
      actionType: DatasetConstants.REGISTER_USER,
      user: user
    });

  },

  /**
   * @param {string} filename
   */
  retrieveDataset: function(file_details){
    console.log('File details:');
    console.log(file_details);
    var file_path = file_details.uri;
    var file_name = file_details.label;


    QBerDispatcher.dispatch({
      actionType: MessageConstants.INFO,
      message: 'Retrieving dataset from '+file_name
    });

    // Retrieve the dataset from local storage
    dataset = JSON.parse(localStorage.getItem(file_name));
    // Initialize the % mapping completion
    // for (var variable in dataset.variables) {
    //   var mapped = 0;
    //   for (var val in variable.values) {
    //     if (val.uri != val.original.uri) {
    //       mapped += 1;
    //     }
    //   }
    //   dataset.variables[variable].mapped = mapped / dataset.variables[variable].values.length;
      //console.log('var ' + variable + ' is mapped ' + mapped);
    // }
    console.log(dataset);

    if(dataset !== null){
      // Retrieved dataset from cache
      QBerDispatcher.dispatch({
        actionType: MessageConstants.SUCCESS,
        message: 'Successfully loaded dataset '+dataset.name
      });

      QBerDispatcher.dispatch({
        actionType: DatasetConstants.DATASET_INIT,
        dataset: dataset
      });

      // QBerDispatcher.dispatch({
      //   actionType: DimensionConstants.SDMX_DIMENSION_INIT,
      //   variables: dataset.variables
      // });
    } else {
      // Nothing in cache, call the QBerAPI with the filename, and implement the success callback
      QBerAPI.retrieveDatasetDefinition({
        path: file_path,
        success: function(dataset){
          QBerDispatcher.dispatch({
            actionType: MessageConstants.SUCCESS,
            message: 'Successfully loaded dataset '+dataset.name
          });

          QBerDispatcher.dispatch({
            actionType: DatasetConstants.DATASET_INIT,
            dataset: dataset
          });

          // QBerDispatcher.dispatch({
          //   actionType: DimensionConstants.SDMX_DIMENSION_INIT,
          //   variables: dataset.variables
          // });
        },
        error: function(response){
          QBerDispatcher.dispatch({
            actionType: MessageConstants.ERROR,
            message: response.message
          });
        }
      });
    }


  },

  /**
   * @param {string} variable
   */
  chooseVariable: function(variable) {
    QBerDispatcher.dispatch({
      actionType: MessageConstants.INFO,
      message: 'You selected variable '+variable.label
    });

    QBerDispatcher.dispatch({
      actionType: DatasetConstants.DATASET_CHOOSE_VARIABLE,
      variable: variable
    });

  },

  /**
   * @param {string} value
   */
  chooseValue: function(value) {
    QBerDispatcher.dispatch({
      actionType: MessageConstants.INFO,
      message: 'You selected value '+value
    });

    QBerDispatcher.dispatch({
      actionType: DatasetConstants.DATASET_CHOOSE_VALUE,
      value: value
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

    localStorage.setItem(dataset.file, JSON.stringify(dataset));

    // Call the QBerAPI with the dataset, and implement the success callback
    QBerAPI.saveDataset({
      dataset: dataset,
      success: function(response){
        QBerDispatcher.dispatch({
          actionType: MessageConstants.SUCCESS,
          message: response.message
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
   * Submit the dataset to CSDH
   */
  submitDataset: function(user, dataset) {
    QBerDispatcher.dispatch({
      actionType: MessageConstants.INFO,
      message: 'Submitting dataset to CSDH'
    });

    // Call the QBerAPI with the dataset, and implement the success callback
    QBerAPI.submitDataset({
      dataset: dataset,
      user: user,
      success: function(response){
        QBerDispatcher.dispatch({
          actionType: MessageConstants.SUCCESS,
          message: response.message
        });
        QBerDispatcher.dispatch({
          actionType: NavbarConstants.UPDATE_URL,
          message: response.url
        });
        //console.log(response.url);
      },
      error: function(response){
        QBerDispatcher.dispatch({
          actionType: MessageConstants.ERROR,
          message: response.message
        });
      }
    });
  },



};

module.exports = DatasetActions;
