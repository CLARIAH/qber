var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var QBerAPI = require('../utils/QBerAPI');
var DataverseConstants = require('../constants/DataverseConstants');
var CSVConstants = require('../constants/CSVConstants');
var DatasetConstants = require('../constants/DatasetConstants');
var DimensionConstants = require('../constants/DimensionConstants');
var MessageConstants = require('../constants/MessageConstants');

/**
 *  Note that the QBerAPI also dispatches actions to stores!
 */
var CSVActions = {

  /**
   */
  closeCSVDropzone: function() {
    QBerDispatcher.dispatch({
      actionType: CSVConstants.CSV_CLOSE_DROPZONE
    });
  },

  /**
   */
  showCSVDropzone: function() {
    console.log('CSV dropzone action');
    QBerDispatcher.dispatch({
      actionType: CSVConstants.CSV_SHOW_DROPZONE
    });
  },



};

module.exports = CSVActions;
