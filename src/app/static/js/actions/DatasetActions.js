var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var QBerAPI = require('../utils/QBerAPI');
var DatasetConstants = require('../constants/DatasetConstants');
var VariableSelectConstants = require('../constants/VariableSelectConstants');

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
        console.log(dataset);
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
        console.log('Error retrieving dataset from {}'.format(filename));
      }
    });
  },

  /**
   * @param {string} variable
   */
  chooseVariable: function(variable) {
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
      actionType: DatasetConstants.DATASET_RETRIEVING_DIMENSION,
      status: 'loading',
      dimension: dimension
    });
    
    QBerAPI.retrieveDimension({
      dimension: dimension,
      success: function(dimension_details){
        QBerDispatcher.dispatch({
          actionType: DatasetConstants.DATASET_SET_DIMENSION,
          dimension_details: dimension_definition
        });
      },
      error: function(dimension){
        QBerDispatcher.dispatch({
          actionType: DatasetConstants.LOADING_FAILED,
          message: "Could not retrieve dimension "+ dimension
        });
      }
    });
  },

};

module.exports = DatasetActions;
