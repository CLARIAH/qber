var DatasetActions = require('../actions/DatasetActions');

module.exports = {

  retrieveDataset: function(filename) {
    $.get('/metadata',{'file': filename}, function(dataset){
      DatasetActions.initDataset(dataset);
    });
  }
};
