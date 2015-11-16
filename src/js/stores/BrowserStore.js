var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var EventEmitter = require('events').EventEmitter;
var BrowserConstants = require('../constants/BrowserConstants');
var DatasetStore = require('./DatasetStore');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';


var _files;
var _path;
var _modal_visible = false;

var BrowserStore = assign({}, EventEmitter.prototype, {

  getModalVisible: function(){
    return _modal_visible;
  },

  setModalVisible: function(visible_or_not){
    _modal_visible = visible_or_not;
  },

  getFiles: function() {
    return _files;
  },

  setFiles: function(files, parent) {
    _files = files;

    
    if (parent !== null){
      _files.push(parent);
    }


  },

  getPath: function() {
    return _path;
  },

  setPath: function(path) {
    _path = path;
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
    case BrowserConstants.UPDATE_FILES:
      BrowserStore.setFiles(action.file_list.files, action.file_list.parent);
      BrowserStore.setPath(action.file_list.path);
      BrowserStore.emitChange();
      break;
    case BrowserConstants.CLOSE_BROWSER:
      BrowserStore.setModalVisible(false);
      BrowserStore.emitChange();
      break;
    case BrowserConstants.SHOW_BROWSER:
      BrowserStore.setModalVisible(true);
      BrowserStore.emitChange();
      break;
    default:
      
      // no op
  }
});

module.exports = BrowserStore;
