var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var QBerAPI = require('../utils/QBerAPI');
var DataverseConstants = require('../constants/DataverseConstants');
var DatasetConstants = require('../constants/DatasetConstants');
var DimensionConstants = require('../constants/DimensionConstants');
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
        console.log(response);
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

  /**
   * @param {string} filename
   */
  retrieveDataset: function(file_details){
    console.log(file_details);
    var file_id = file_details['uri'];
    var file_name = file_details['label'];


    QBerDispatcher.dispatch({
      actionType: MessageConstants.INFO,
      message: 'Retrieving Dataverse dataset from '+file_name
    });

    // Retrieve the dataset from local storage
    dataset = JSON.parse(localStorage.getItem(file_name));
    console.log(dataset);

    if(dataset !== null){
      // Retrieved dataset from cache
      QBerDispatcher.dispatch({
        actionType: MessageConstants.SUCCESS,
        message: 'Successfully loaded cached dataset '+dataset.name
      });

      QBerDispatcher.dispatch({
        actionType: DatasetConstants.DATASET_INIT,
        dataset: dataset
      });

      QBerDispatcher.dispatch({
        actionType: DimensionConstants.SDMX_DIMENSION_INIT,
        variables: dataset.variables
      });
    } else {
      // Nothing in cache, call the QBerAPI with the filename, and implement the success callback
      QBerAPI.retrieveDataverseDefinition({
        id: file_id,
        name: file_name,
        success: function(dataset){
          QBerDispatcher.dispatch({
            actionType: MessageConstants.SUCCESS,
            message: 'Successfully loaded dataset '+dataset.name
          });

          QBerDispatcher.dispatch({
            actionType: DatasetConstants.DATASET_INIT,
            dataset: dataset
          });

          QBerDispatcher.dispatch({
            actionType: DimensionConstants.SDMX_DIMENSION_INIT,
            variables: dataset.variables
          });
        },
        error: function(response){
          QBerDispatcher.dispatch({
            actionType: MessageConstants.ERROR,
            message: response.message
          });
        }
      });
    }


  },



};

module.exports = DataverseActions;
