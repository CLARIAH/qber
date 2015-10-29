var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var QBerAPI = require('../utils/QBerAPI');
var DatasetConstants = require('../constants/DatasetConstants');
var DimensionConstants = require('../constants/DimensionConstants');

var MessageConstants = require('../constants/MessageConstants');

/**
 *  Note that the QBerAPI also dispatches actions to stores!
 */
var DatasetActions = {

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
    QBerAPI.retrieveDataset({
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
          dimensions: dataset.dimensions,
          mappings: dataset.mappings
        });
      },
      error: function(filename){
        QBerDispatcher.dispatch({
          actionType: MessageConstants.ERROR,
          message: 'Error retrieving dataset from '+filename
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
