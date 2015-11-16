/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the DatasetStore and passes the new data to its children.
 */

var React = require('react');
var _ = require('lodash');

var QBerModal = require('./QBerModal.react');

var BrowserStore = require('../stores/BrowserStore');
var BrowserActions = require('../actions/BrowserActions');
var DatasetActions = require('../actions/DatasetActions');

/**
 * Retrieve the current dataset from the DatasetStore
 */
function getBrowserState() {
  return {
    files: BrowserStore.getFiles(),
    path: BrowserStore.getPath(),
    modal_visible: BrowserStore.getModalVisible()
  };
}

var QBer = React.createClass({

  getInitialState: function() {
    return getBrowserState();
  },

  componentDidMount: function() {
    BrowserStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    BrowserStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
    
    
    // If we don't have a list of files, and the modal is not visible
    if (this.state.files === undefined && !this.state.modal_visible){
      BrowserActions.retrieveFileList('.');
      BrowserActions.showBrowser();
      return (<div>Loading...</div>);
    } else {

      return ( <QBerModal  visible={this.state.modal_visible}
                  title="Select a dataset to load"
                  value={'.'}
                  options={this.state.files}
                  doSelect={this._handleSelected}
                  doClose={this._handleHideBrowser} />
              );
    }
  },

  /**
   * Event handler for 'change' events coming from the DatasetStore
   */
  _onChange: function() {
    this.setState(getBrowserState());
  },

  /**
   * Event handler for the close Browser button
   */
  _handleHideBrowser: function(){
    BrowserActions.closeBrowser();
  },

  /**
   * Event handler when a file or path is selected
   */
  _handleSelected: function(selection){
    

    // var selection = event.currentTarget.getAttribute('value');

    

    var selected_file = _.find(this.state.files, 'uri', selection);
    
    if(selected_file.type == 'file'){
      
      DatasetActions.retrieveDataset(selected_file.uri);
      BrowserActions.closeBrowser();
    } else {
      
      BrowserActions.retrieveFileList(selected_file.uri);
    }
  },


});

module.exports = QBer;
