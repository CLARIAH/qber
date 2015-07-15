var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var QBerAPI = require('../utils/QBerAPI');
var SDMXDimensionConstants = require('../constants/SDMXDimensionConstants');
var DatasetConstants = require('../constants/DatasetConstants');
var MessageConstants = require('../constants/MessageConstants');

/**
 *  Note that the QBerAPI also dispatches actions to stores!
 */
var SDMXDimensionActions = {


  // /**
  //  * @param {string} search
  //  */
  // selectDimension: function(dimension) {
  //   QBerDispatcher.dispatch({
  //     actionType: MessageConstants.INFO,
  //     message: 'You selected dimension '+dimension
  //   });
  //   console.log("In searchDimension action");
  //   QBerDispatcher.dispatch({
  //     actionType: SDMXDimensionConstants.SELECT_DIMENSION,
  //     dimension: dimension
  //   });
  //
  //   QBerDispatcher.dispatch({
  //     actionType: DatasetConstants.DATASET_CHOOSE_DIMENSION,
  //     dimension: dimension
  //   });
  // },

  /**
   * @param {string} dimension
   */
  chooseDimension: function(dimension) {
    QBerDispatcher.dispatch({
      actionType: MessageConstants.INFO,
      message: 'Retrieving details for '+dimension
    });

    QBerDispatcher.dispatch({
      actionType: SDMXDimensionConstants.SDMX_DIMENSION_HIDE,
      dimension: dimension
    });
    QBerAPI.retrieveDimension({
      dimension: dimension,
      success: function(dimension_details){
        QBerDispatcher.dispatch({
          actionType: MessageConstants.SUCCESS,
          message: "Successfully retrieved dimension "+ dimension
        });
        QBerDispatcher.dispatch({
          actionType: DatasetConstants.DATASET_SET_DIMENSION,
          dimension_details: dimension_details
        });
      },
      error: function(dimension){
        QBerDispatcher.dispatch({
          actionType: MessageConstants.ERROR,
          message: "Could not retrieve dimension "+ dimension
        });
      }
    });
  },


  /**
   *
   */
  showDimensions: function() {
    QBerDispatcher.dispatch({
      actionType: SDMXDimensionConstants.SDMX_DIMENSION_SHOW,
    });
  },

  /**
   *
   */
  hideDimensions: function() {
    QBerDispatcher.dispatch({
      actionType: SDMXDimensionConstants.SDMX_DIMENSION_HIDE,
    });
  },

};

module.exports = SDMXDimensionActions;
