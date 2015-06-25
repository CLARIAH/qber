var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var QBerAPI = require('../utils/QBerAPI');
var DatasetConstants = require('../constants/DatasetConstants');
var VariableSelectConstants = require('../constants/VariableSelectConstants');
var MessageConstants = require('../constants/MessageConstants');

/**
 *  Note that the QBerAPI also dispatches actions to stores!
 */
var DatasetActions = {

  /**
   * @param {string} filename
   */
  retrieveDataset: function(filename){
    console.log('Retrieving dataset from '+filename);
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
          actionType: VariableSelectConstants.VARIABLE_SELECT_INIT,
          variables: dataset.variables
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
      message: 'You chose variable '+variable
    });

    QBerDispatcher.dispatch({
      actionType: DatasetConstants.DATASET_CHOOSE_VARIABLE,
      variable: variable
    });
  },

  /**
   * @param {string} dimension
   */
  chooseDimension: function(dimension) {
    QBerDispatcher.dispatch({
      actionType: MessageConstants.INFO,
      message: 'Retrieving details for '+dimension
    });

    QBerAPI.retrieveDimension({
      dimension: dimension,
      success: function(dimension_details){
        QBerDispatcher.dispatch({
          actionType: MessageConstants.SUCCESS,
          message: "Successfully retrieved dimension "+ dimension
        });
        QBerDispatcher.dispatch({
          actionType: DatasetConstants.DATASET_SET_DIMENSION,
          dimension_details: dimension_definition
        });
      },
      error: function(dimension){
        QBerDispatcher.dispatch({
          actionType: MessageConstants.ERROR,
          message: "Could not retrieve dimension "+ dimension
        });
      }
    });
  },

};

module.exports = DatasetActions;
