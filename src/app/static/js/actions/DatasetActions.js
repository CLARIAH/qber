var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var QBerAPI = require('../utils/QBerAPI');
var DatasetConstants = require('../constants/DatasetConstants');

/**
 *  Note that the QBerAPI also dispatches actions to stores!
 */
var DatasetActions = {

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

};

module.exports = DatasetActions;
