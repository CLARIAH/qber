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

var Modal = require('./Modal.react');
var QBerModal = require('./QBerModal.react');
var DataverseStore = require('../stores/DataverseStore');
var DataverseActions = require('../actions/DataverseActions');
var DatasetActions = require('../actions/DatasetActions');

var ReactPropTypes = React.PropTypes;

/**
 * Retrieve the current dataset from the DatasetStore
 */
function getDataverseState() {
  return {
    files: DataverseStore.getFiles(),
    study: DataverseStore.getStudy(),
    modal_visible: DataverseStore.getModalVisible()
  };
}



var DataverseDOIInput = React.createClass({
  render: function(){
    return (
      <form className="form-inline" role="form">
          <div className="form-group">
            <input type="text" className="form-control" onChange={this.props.doUpdateHandle} placeholder="doi:10.7910/DVN/28993"></input>
          </div>
          <div className="form-group">
            <div className="btn btn-primary" onClick={this.props.doSubmit}>Retrieve</div>
          </div>
      </form>
    );

  },
});


var DataverseBrowser = React.createClass({

  // This React class only works if a 'visible' value is passed through its properties.
  propTypes: {
    user: ReactPropTypes.object.isRequired
  },

  getInitialState: function() {
    return getDataverseState();
  },

  componentDidMount: function() {
    DataverseStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    DataverseStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {


    // If we don't have a list of files, and the modal is not visible
    if (!this.state.modal_visible){
      // the modal is not visible
      console.log("Modal is not visible");
      return null;
    } else if (this.state.files === undefined && this.state.study === undefined) {

      return (
        <Modal title="Provide a Handle or DOI"
                visible={this.state.modal_visible}
                component={DataverseDOIInput}
                doUpdateHandle={this._updateHandle}
                doSubmit={this._handleHandle}
                doClose={this._handleHideDataverse}>
        </Modal>
      );

    } else {
      console.log(this.state.files);

      return ( <QBerModal  visible={this.state.modal_visible}
                  title="Select a dataset to load"
                  options={this.state.files}
                  doSelect={this._handleSelected}
                  doClose={this._handleHideDataverse} />
              );
    }
  },

  /**
   * Event handler for 'change' events coming from the DatasetStore
   */
  _onChange: function() {
    this.setState(getDataverseState());
  },

  /**
   * Event handler for the close Dataverse button
   */
  _handleHideDataverse: function(){
    DataverseActions.closeDataverseBrowser();
  },

  _handleHandle: function(){
    var handle = this.state.handle;
    console.log(handle);


    DataverseActions.retrieveStudy(handle);
  },

  _updateHandle: function(e){
    var handle = e.target.value;
    var new_state = this.state;
    new_state.handle = handle;
    this.setState(new_state);
  },

  /**
   * Event handler when a file or path is selected
   */
  _handleSelected: function(selection){


    console.log(selection);
    console.log(this.state.files);
    // var selected_filesc = _.find(this.state.files, 'uri', selection);

    var selected_file = _.find(this.state.files, function(o) { return o.uri == selection; });
    console.log(selected_file);
    if(selected_file.type == 'file' || selected_file.type == 'dataverse'){
      DataverseActions.retrieveDataset(selected_file, this.props.user.getEmail());
      DataverseActions.closeDataverseBrowser();
    }
  },


});

module.exports = DataverseBrowser;
