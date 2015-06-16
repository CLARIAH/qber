var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var DatasetConstants = require('../constants/DatasetConstants');

module.exports = {
  retrieveDataset: function(filename) {
    $.get('/metadata',{'file': filename}, function(dataset){
      QBerDispatcher.dispatch({
        actionType: DatasetConstants.DATASET_INIT,
        dataset: dataset
      });
    });
  },

  retrieveDimension: function(dimension) {
    $.get('/variable/resolve',{'uri': dimension}, function(dimension_definition){
      if(dimension_definition == 'error'){
        QBerDispatcher.dispatch({
          actionType: DatasetConstants.LOADING_FAILED,
          message: "Could not retrieve dimension "+ dimension
        });
      } else {
        QBerDispatcher.dispatch({
          actionType: DatasetConstants.DATASET_SET_DIMENSION,
          dimension_details: dimension_definition
        });
      }
    });
  }
};
