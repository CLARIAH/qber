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
var PillSelector = require('./PillSelector.react');
var VariablePanel = require('./VariablePanel.react');
var Sidebar = require('./Sidebar.react');
var Browser = require('./Browser.react');
var SignIn = require('./SignIn.react');

var MessagePanel = require('./MessagePanel.react');
var DatasetStore = require('../stores/DatasetStore');
var DatasetActions = require('../actions/DatasetActions');
var BrowserActions = require('../actions/BrowserActions');

/**
 * Retrieve the current dataset from the DatasetStore
 */
function getDatasetState() {
  return {
    dataset: DatasetStore.get(),
    variable_names: DatasetStore.getVariableNames(),
    variable: DatasetStore.getVariable(),
    user: DatasetStore.getUser()
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
    console.log("QBer.react render");
    if (this.state.user === undefined ){
      return (
        <div>Sign in first...</div>
      );
    } else if (this.state.dataset === undefined){
      return (
        <Browser/>
      );
    } else {
    	return (
        <div className="row">
          <Sidebar
            options={this.state.variable_names}
          />
          <VariablePanel
            dataset={this.state.dataset} variable={this.state.variable}
          />
        </div>
    	);
    }
  },

  /**
   * Event handler for 'change' events coming from the DatasetStore
   */
  _onChange: function() {
    this.setState(getDatasetState());
  }

});

module.exports = QBer;
