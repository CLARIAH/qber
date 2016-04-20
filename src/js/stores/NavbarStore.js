var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var EventEmitter = require('events').EventEmitter;
var NavbarConstants = require('../constants/NavbarConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

// TODO: migrate props of the Navbar component that whould be in this store

var _url;

function setURL(url) {
  // Sets the download URL of the Download QB button
  _url = url;
}

var NavbarStore = assign({}, EventEmitter.prototype, {
  getNavbar: function() {
    return {
      'url': _url,
      };
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
    case NavbarConstants.UPDATE_URL:
      console.log("Updating navbar URL to: " + action.url);
      setURL(action.message);
      NavbarStore.emitChange();
      break;
    default:

      // no op
  }
});

module.exports = NavbarStore;
