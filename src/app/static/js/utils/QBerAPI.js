var DatasetActions = require('../actions/DatasetActions');

module.exports = {

  getDataset: function(filename) {
    $.get('/metadata',{'file': filename}, function(dataset){
      DatasetActions.receiveDataset(dataset);
    });
  }
};
