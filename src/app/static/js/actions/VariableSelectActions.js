var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var QBerAPI = require('../utils/QBerAPI');
var PillSelectorConstants = require('../constants/PillSelectorConstants');
var DatasetConstants = require('../constants/DatasetConstants');
var MessageConstants = require('../constants/MessageConstants');

/**
 *  Note that the QBerAPI also dispatches actions to stores!
 */
var VariableSelectActions = {

  /**
   * @param {string} search
   */
  searchVariable: function(search) {
    console.log("In searchVariable action: "+search);
    QBerDispatcher.dispatch({
      actionType: PillSelectorConstants.SEARCH,
      search: search
    });
  },

  /**
   * @param {string} search
   */
  selectVariable: function(variable) {
    QBerDispatcher.dispatch({
      actionType: MessageConstants.INFO,
      message: 'You selected variable '+variable
    });
    console.log("In searchVariable action");
    QBerDispatcher.dispatch({
      actionType: PillSelectorConstants.SELECT,
      variable: variable
    });
    QBerDispatcher.dispatch({
      actionType: DatasetConstants.DATASET_CHOOSE_VARIABLE,
      variable: variable
    });
  }
};

module.exports = VariableSelectActions;
