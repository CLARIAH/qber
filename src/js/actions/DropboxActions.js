var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var QBerAPI = require('../utils/QBerAPI');
var DatasetConstants = require('../constants/DatasetConstants');
var DimensionConstants = require('../constants/DimensionConstants');
var MessageConstants = require('../constants/MessageConstants');
var _ = require('lodash');

/**
 *  Note that the QBerAPI also dispatches actions to stores!
 */
var DropboxActions = {

  /**
   * @param {string} url
   */
  retrieveDataset: function(file_url, user){
    console.log(file_url);

    var user_id = user.getEmail();

    QBerDispatcher.dispatch({
      actionType: MessageConstants.INFO,
      message: 'Retrieving Dropbox dataset from '+file_url
    });

    var file_name = _.last(_.split(file_url,'/'));
    var contextual_file_name = user_id + "/" + file_name

    console.log(contextual_file_name);

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
      // Nothing in cache, call the QBerAPI with the file url, and implement the success callback
      QBerAPI.retrieveURLBasedDefinition({
        url: file_url,
        name: contextual_file_name,
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

module.exports = DropboxActions;
