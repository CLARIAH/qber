var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var QBerAPI = require('../utils/QBerAPI');
var BrowserConstants = require('../constants/BrowserConstants');
var MessageConstants = require('../constants/MessageConstants');

/**
 *  Note that the QBerAPI also dispatches actions to stores!
 */
var BrowserActions = {

  /**
   * @param {string} path
   */
  retrieveFileList: function(path){

    // QBerDispatcher.dispatch({
    //   actionType: MessageConstants.INFO,
    //   message: 'Retrieving file list from '+path
    // });

    // Call the QBerAPI with the filename, and implement the success callback
    QBerAPI.retrieveFileList({
      path: path,
      success: function(file_list){

        QBerDispatcher.dispatch({
          actionType: MessageConstants.SUCCESS,
          message: 'Successfully retrieved file list ' + file_list.path
        });
        
        QBerDispatcher.dispatch({
          actionType: BrowserConstants.UPDATE_FILES,
          file_list: file_list
        });

      },
      error: function(path){
        QBerDispatcher.dispatch({
          actionType: MessageConstants.ERROR,
          message: 'Error retrieving file list from '+ path
        });
      }
    });
  },

  /**
   */
  closeBrowser: function() {
    QBerDispatcher.dispatch({
      actionType: BrowserConstants.CLOSE_BROWSER
    });
  },

  /**
   */
  showBrowser: function() {
    QBerDispatcher.dispatch({
      actionType: BrowserConstants.SHOW_BROWSER
    });
  },





};

module.exports = BrowserActions;
