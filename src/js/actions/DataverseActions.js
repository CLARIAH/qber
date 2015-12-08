var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var QBerAPI = require('../utils/QBerAPI');
var DataverseConstants = require('../constants/DataverseConstants');
var MessageConstants = require('../constants/MessageConstants');

/**
 *  Note that the QBerAPI also dispatches actions to stores!
 */
var DataverseActions = {

  /**
   * @param {string} handle
   */
  retrieveStudy: function(handle){
    // Call the QBerAPI with the handle or doi, and implement the success callback
    QBerAPI.retrieveStudy({
      handle: handle,
      success: function(file_list){
        console.log(file_list);
        QBerDispatcher.dispatch({
          actionType: MessageConstants.SUCCESS,
          message: 'Successfully retrieved file list for ' + handle
        });

        QBerDispatcher.dispatch({
          actionType: DataverseConstants.DV_UPDATE_FILES,
          file_list: file_list
        });

      },
      error: function(response){
        QBerDispatcher.dispatch({
          actionType: MessageConstants.ERROR,
          message: response.message
        });
      }
    });
  },

  /**
   */
  closeDataverseBrowser: function() {
    QBerDispatcher.dispatch({
      actionType: DataverseConstants.DV_CLOSE_BROWSER
    });
  },

  /**
   */
  showDataverseBrowser: function() {
    QBerDispatcher.dispatch({
      actionType: DataverseConstants.DV_SHOW_BROWSER
    });
  },





};

module.exports = DataverseActions;
