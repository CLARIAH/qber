var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var QBerAPI = require('../utils/QBerAPI');
var DatasetConstants = require('../constants/DatasetConstants');
var SDMXDimensionConstants = require('../constants/SDMXDimensionConstants');

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
          actionType: SDMXDimensionConstants.SDMX_DIMENSION_INIT,
          dimensions: dataset.dimensions
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
   * @param {string} variable
   */
  showDimensions: function() {
    QBerDispatcher.dispatch({
      actionType: SDMXDimensionConstants.SDMX_DIMENSION_SHOW,
    });
  },



};

module.exports = DatasetActions;
