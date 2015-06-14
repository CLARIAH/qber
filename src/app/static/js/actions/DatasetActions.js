var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var DatasetConstants = require('../constants/DatasetConstants');

var DatasetActions = {

  /**
   * @param  {string} text
   */
  create: function(text) {
    QBerDispatcher.dispatch({
      actionType: DatasetConstants.DATASET_CREATE,
      text: text
    });
  },

  /**
   * @param  {string} id The ID of the ToDo item
   * @param  {string} text
   */
  updateText: function(id, text) {
    QBerDispatcher.dispatch({
      actionType: DatasetConstants.DATASET_UPDATE_TEXT,
      id: id,
      text: text
    });
  },

  /**
   * Toggle whether a single ToDo is complete
   * @param  {object} todo
   */
  toggleComplete: function(todo) {
    var id = todo.id;
    var actionType = todo.complete ?
        DatasetConstants.DATASET_UNDO_COMPLETE :
        DatasetConstants.DATASET_COMPLETE;

    QBerDispatcher.dispatch({
      actionType: actionType,
      id: id
    });
  },

  /**
   * Mark all ToDos as complete
   */
  toggleCompleteAll: function() {
    QBerDispatcher.dispatch({
      actionType: DatasetConstants.DATASET_TOGGLE_COMPLETE_ALL
    });
  },

  /**
   * @param  {string} id
   */
  destroy: function(id) {
    QBerDispatcher.dispatch({
      actionType: DatasetConstants.DATASET_DESTROY,
      id: id
    });
  },

  /**
   * Delete all the completed ToDos
   */
  destroyCompleted: function() {
    QBerDispatcher.dispatch({
      actionType: DatasetConstants.DATASET_DESTROY_COMPLETED
    });
  }

};

module.exports = DatasetActions;
