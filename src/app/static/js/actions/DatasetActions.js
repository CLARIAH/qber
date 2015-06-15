var QBerDispatcher = require('../dispatcher/QBerDispatcher');
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



};

module.exports = DatasetActions;
