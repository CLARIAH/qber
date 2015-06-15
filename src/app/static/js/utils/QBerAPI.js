var DatasetActions = require('../actions/DatasetActions');

module.exports = {
  retrieveDataset: function(filename) {
    $.get('/metadata',{'file': filename}, function(dataset){
      DatasetActions.initDataset(dataset);
    });
  },

  retrieveDimension: function(dimension) {
    $.get('/variable/resolve',{'uri': dimension}, function(dimension_definition){
      if(dimension_definition == 'error'){
        DatasetActions.loadingFailed("Could not retrieve dimension "+ dimension);
      } else {
        DatasetActions.setDimension(dimension);
      }
    });
  }
};
