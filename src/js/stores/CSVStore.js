var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var EventEmitter = require('events').EventEmitter;
var CSVConstants = require('../constants/CSVConstants');
var DatasetStore = require('./DatasetStore');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';


var _files;
var _study;
var _modal_visible = true;

var CSVStore = assign({}, EventEmitter.prototype, {

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
    case CSVConstants.CSV_UPDATE_FILES:
      CSVStore.setFiles(action.file_list.files);
      CSVStore.setStudy(action.file_list.study);
      CSVStore.emitChange();
      break;
    case CSVConstants.CSV_CLOSE_DROPZONE:
      CSVStore.setModalVisible(false);
      CSVStore.emitChange();
      break;
    case CSVConstants.CSV_SHOW_DROPZONE:
      console.log('Showing modal for CSV');
      CSVStore.setModalVisible(true);
      CSVStore.emitChange();
      break;
    default:

      // no op
  }
});

module.exports = CSVStore;
