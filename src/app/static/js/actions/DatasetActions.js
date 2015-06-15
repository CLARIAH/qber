var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var QBerAPI = require('../utils/QBerAPI');
var DatasetConstants = require('../constants/DatasetConstants');


var DatasetActions = {

  /**
   * @param  {object} dataset
   */
  initDataset: function(dataset) {
    QBerDispatcher.dispatch({
      actionType: DatasetConstants.DATASET_INIT,
      dataset: dataset
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
    QBerAPI.retrieveDimension(dimension);
  },

  /**
   * @param {string} message
   */
  loadingFailed: function(message) {
    QBerDispatcher.dispatch({
      actionType: DatasetConstants.LOADING_FAILED,
      message: message
    });
  },

  /**
   * @param {object} dimension_details
   */
  setDimension: function(dimension_details) {
    QBerDispatcher.dispatch({
      actionType: DatasetConstants.DATASET_SET_DIMENSION,
      dimension_details: dimension_details
    });
  }
};

module.exports = DatasetActions;
