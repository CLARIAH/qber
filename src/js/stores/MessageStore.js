var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var EventEmitter = require('events').EventEmitter;
var MessageConstants = require('../constants/MessageConstants');
var DatasetStore = require('./DatasetStore');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _message;
var _message_type;

/**
 * Update a DATASET item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function setMessage(message, message_type) {
  _message = message;
  _message_type = message_type;
}



var MessageStore = assign({}, EventEmitter.prototype, {
  getMessage: function() {
    return {
      'message': _message,
      'isError': _message_type == 'error',
      'isWarning': _message_type == 'warning',
      'isSuccess': _message_type == 'success',
      'isInfo': _message_type == 'info'};
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
  
  switch(action.actionType) {
    case MessageConstants.ERROR:
      setMessage(action.message, 'error');
      MessageStore.emitChange();
      break;
    case MessageConstants.WARNING:
      setMessage(action.message, 'warning');
      MessageStore.emitChange();
      break;
    case MessageConstants.SUCCESS:
      setMessage(action.message, 'success');
      MessageStore.emitChange();
      break;
    case MessageConstants.INFO:
      setMessage(action.message, 'info');
      MessageStore.emitChange();
      break;
    default:
      
      // no op
  }
});

module.exports = MessageStore;
