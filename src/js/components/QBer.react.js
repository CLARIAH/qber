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
var Navbar = require('./Navbar.react');

var MessagePanel = require('./MessagePanel.react');
var DatasetStore = require('../stores/DatasetStore');
var DimensionStore = require('../stores/DimensionStore');
var DatasetActions = require('../actions/DatasetActions');
var BrowserActions = require('../actions/BrowserActions');

/**
 * Retrieve the current dataset from the DatasetStore
 */
function getDatasetState() {
  return {
    dataset: DatasetStore.get(),
    variable_names: DatasetStore.getVariableNames(),
    variable: DatasetStore.getSelectedVariable(),
    dimensions: DatasetStore.getDimensions(),
    schemes: DatasetStore.getSchemes(),
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



    var navbar = <Navbar doSignIn={this._handleSignedIn}
                         doSave={this._handleSave}
                         doSubmit={this._handleSubmit}
                         user={this.state.user}
                         variable={this.state.variable} />;

    var body;
    if (this.state.dataset === undefined){

      body = <Browser/>;
    } else {
    	body =
        <div className="container-fluid" id="qber_body">
          <div className="row">
            <Sidebar
              options={this.state.variable_names}
            />
            <VariablePanel
              dataset={this.state.dataset}
              variable={this.state.variable}
              schemes={this.state.schemes}
              dimensions={this.state.dimensions}
            />
          </div>
        </div>;
    }

    return (
      <section id='qber_content'>
        {navbar}
        {body}
      </section>
    );
  },

  /**
   * Event handler for 'change' events coming from the DatasetStore
   */
  _onChange: function() {
    this.setState(getDatasetState());
  },

  _handleSignedIn: function(user) {

    user_profile = user.getBasicProfile();
    DatasetActions.registerUser(user_profile);
  },

  _handleSave: function() {
    var variables = DimensionStore.getVariables();
    var dataset = DatasetStore.get();
    var user = DatasetStore.getUser();

    dataset.variables = variables;
    user_id = user.getId();

    DatasetActions.saveDataset(dataset);
  },

  _handleSubmit: function() {
    var variables = DimensionStore.getVariables();
    var dataset = DatasetStore.get();
    var profile = DatasetStore.getUser();

    var user = {};

    user.name = profile.getName();
    user.id = profile.getId();
    user.image = profile.getImageUrl();
    user.email = profile.getEmail();

    dataset.variables = variables;


    DatasetActions.submitDataset(user, dataset);
  },

});

module.exports = QBer;
