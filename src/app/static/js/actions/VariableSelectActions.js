var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var QBerAPI = require('../utils/QBerAPI');
var VariableSelectConstants = require('../constants/VariableSelectConstants');
var DatasetConstants = require('../constants/DatasetConstants');

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
      actionType: VariableSelectConstants.VARIABLE_SELECT_SEARCH,
      search: search
    });
  },

  /**
   * @param {string} search
   */
  selectVariable: function(variable) {
    console.log("In searchVariable action");
    QBerDispatcher.dispatch({
      actionType: VariableSelectConstants.SELECT_VARIABLE,
      variable: variable
    });
    QBerDispatcher.dispatch({
      actionType: DatasetConstants.DATASET_CHOOSE_VARIABLE,
      variable: variable
    });
  }
};

module.exports = VariableSelectActions;
