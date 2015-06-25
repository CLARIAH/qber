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
var VariablesList = require('./VariablesList.react');
var VariablePanel = require('./VariablePanel.react');
var MessagePanel = require('./MessagePanel.react');
var DatasetStore = require('../stores/DatasetStore');

/**
 * Retrieve the current dataset from the DatasetStore
 */
function getDatasetState() {
  return {
    dataset: DatasetStore.get(),
    variable: DatasetStore.getVariable()
  };
}

var QBer = React.createClass({

  getInitialState: function() {
    return getDatasetState();
  },

  componentDidMount: function() {
    DatasetStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    DatasetStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
  	return (
      <div className="row">
        <div className="col-md-2">
          <VariablesList/>
        </div>
        <div className="col-md-10">
          <VariablePanel
            dataset={this.state.dataset} variable={this.state.variable}
          />
        </div>
      </div>
  	);
  },

  /**
   * Event handler for 'change' events coming from the DatasetStore
   */
  _onChange: function() {
    this.setState(getDatasetState());
  }

});

module.exports = QBer;
