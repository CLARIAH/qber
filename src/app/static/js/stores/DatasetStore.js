var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var EventEmitter = require('events').EventEmitter;
var DatasetConstants = require('../constants/DatasetConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _dataset = {};

/**
 * Create a DATASET item.
 * @param  {string} text The content of the DATASET
 */
function create(text) {
  // Hand waving here -- not showing how this interacts with XHR or persistent
  // server-side storage.
  // Using the current timestamp + random number in place of a real id.
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  _dataset[id] = {
    id: id,
    complete: false,
    text: text
  };
}

/**
 * Update a DATASET item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
  _dataset[id] = assign({}, _dataset[id], updates);
}

/**
 * Update all of the DATASET items with the same object.
 *     the data to be updated.  Used to mark all DATASETs as completed.
 * @param  {object} updates An object literal containing only the data to be
 *     updated.
 */
function updateAll(updates) {
  for (var id in _dataset) {
    update(id, updates);
  }
}

/**
 * Delete a DATASET item.
 * @param  {string} id
 */
function destroy(id) {
  delete _dataset[id];
}

/**
 * Delete all the completed DATASET items.
 */
function destroyCompleted() {
  for (var id in _dataset) {
    if (_dataset[id].complete) {
      destroy(id);
    }
  }
}

var DatasetStore = assign({}, EventEmitter.prototype, {

  /**
   * Tests whether all the remaining DATASET items are marked as completed.
   * @return {boolean}
   */
  areAllComplete: function() {
    for (var id in _dataset) {
      if (!_dataset[id].complete) {
        return false;
      }
    }
    return true;
  },

  /**
   * Get the entire collection of DATASETs.
   * @return {object}
   */
  getAll: function() {
    return _dataset;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
QBerDispatcher.register(function(action) {
  var text;

  switch(action.actionType) {
    case DatasetConstants.DATASET_CREATE:
      text = action.text.trim();
      if (text !== '') {
        create(text);
        DatasetStore.emitChange();
      }
      break;

    case DatasetConstants.DATASET_TOGGLE_COMPLETE_ALL:
      if (DatasetStore.areAllComplete()) {
        updateAll({complete: false});
      } else {
        updateAll({complete: true});
      }
      DatasetStore.emitChange();
      break;

    case DatasetConstants.DATASET_UNDO_COMPLETE:
      update(action.id, {complete: false});
      DatasetStore.emitChange();
      break;

    case DatasetConstants.DATASET_COMPLETE:
      update(action.id, {complete: true});
      DatasetStore.emitChange();
      break;

    case DatasetConstants.DATASET_UPDATE_TEXT:
      text = action.text.trim();
      if (text !== '') {
        update(action.id, {text: text});
        DatasetStore.emitChange();
      }
      break;

    case DatasetConstants.DATASET_DESTROY:
      destroy(action.id);
      DatasetStore.emitChange();
      break;

    case DatasetConstants.DATASET_DESTROY_COMPLETED:
      destroyCompleted();
      DatasetStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = DatasetStore;
