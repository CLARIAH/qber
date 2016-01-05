var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var EventEmitter = require('events').EventEmitter;
var DataverseConstants = require('../constants/DataverseConstants');
var DatasetStore = require('./DatasetStore');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';


var _files;
var _study;
var _modal_visible = true;

var DataverseStore = assign({}, EventEmitter.prototype, {

  getModalVisible: function(){
    return _modal_visible;
  },

  setModalVisible: function(visible_or_not){
    _modal_visible = visible_or_not;
  },

  getFiles: function() {
    return _files;
  },

  setFiles: function(files) {
    _files = files;
  },

  getStudy: function() {
    return _study;
  },

  setStudy: function(study) {
    _study = study;
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
    case DataverseConstants.DV_UPDATE_FILES:
      DataverseStore.setFiles(action.file_list.files);
      DataverseStore.setStudy(action.file_list.study);
      DataverseStore.emitChange();
      break;
    case DataverseConstants.DV_CLOSE_BROWSER:
      DataverseStore.setModalVisible(false);
      DataverseStore.emitChange();
      break;
    case DataverseConstants.DV_SHOW_BROWSER:
      DataverseStore.setModalVisible(true);
      DataverseStore.emitChange();
      break;
    default:

      // no op
  }
});

module.exports = DataverseStore;
