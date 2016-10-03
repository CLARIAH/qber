var React = require('react');
var Browser = require('./Browser.react');
var DataverseBrowser = require('./DataverseBrowser.react');
var DataverseActions = require('../actions/DataverseActions');
var CSVActions = require('../actions/CSVActions');
var DropboxActions = require('../actions/DropboxActions');
var CSVDropzone = require('./CSVDropzone.react')
var BrowserActions = require('../actions/BrowserActions');

var ReactPropTypes = React.PropTypes;


var Welcome = React.createClass({

  // This React class only works if a 'visible' value is passed through its properties.
  propTypes: {
    visible: ReactPropTypes.bool.isRequired,
    user: ReactPropTypes.object.isRequired,
  },

  getInitialState: function() {
    return {
      mode: 'initial',
    };
  },

  /**
   * @return {object}
   */
  render: function() {
    // This section should be hidden by default
    // and shown when the welcome screen should be visible
    if (this.props.visible === undefined || !this.props.visible) {
      return null;
    }

    var csdh_browser;
    var dataverse_browser;
    var csv_dropzone;
    switch(this.state.mode){
      case 'csdh':
        console.log('csdh');
        csdh_browser = <Browser user={this.props.user}/>;
        break;
      case 'dataverse':
        console.log('dataverse');
        dataverse_browser = <DataverseBrowser user={this.props.user}/>;
        break;
      // case 'csv':
      //   console.log('csv');
      //   csv_dropzone = <div className="div-csv">
      //                   <center><CSVDropzone/></center>
      //                 </div>;
      //   break;
    }

    var load_dataset_actions;
    if (this.props.user != null){
      load_dataset_actions = <div className="text-center center-block">
        <div className="btn btn-primary btn-space" onClick={this._openCSDHBrowser}>Browse <strong>data</strong>legend</div>
        <div className="btn btn-info btn-space" onClick={this._openDropboxChooser}>Browse Dropbox</div>
        <div className="btn btn-default btn-space" onClick={this._openDataverseBrowser}>Browse Dataverse</div>
      </div>;
    } else {
      load_dataset_actions = <div className="alert alert-info" role="alert">Please login first...</div>
    }


    return (
      <div className="container-fluid" id="welcome_body">
        {csdh_browser}
        {dataverse_browser}
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <div className="welcome">
              <h1>QBer</h1>
              <h4>Connect your data to the cloud</h4>
              {load_dataset_actions}
            </div>
          </div>
        </div>
      </div>
    );
  },

  _openDropboxChooser: function(e) {
    var newstate = this.state;
    var user = this.props.user;

    if(user == null) {
      console.log("Not logged in...");
      return;
    }

    newstate.mode = 'dropbox';
    console.log('Setting state to dropbox');


    options = {
      // Required. Called when a user selects an item in the Chooser.
      success: function(files) {
          DropboxActions.retrieveDataset(files[0].link, user);
      },

      // Optional. Called when the user closes the dialog without selecting a file
      // and does not include any parameters.
      cancel: function() {
        newstate = this.state;
        newstate.mode = 'initial';
        this.setState(newstate);
      },
      linkType: "direct", // or "direct"
      multiselect: false, // or true
      extensions: ['.csv', '.tsv', '.tab', '.xls', '.xlsx'],
    };

    Dropbox.choose(options);

    this.setState(newstate);
  },

  _openCSVDropzone: function(e) {
    var newstate = this.state;
    newstate.mode = 'csv';
    console.log('Setting state to csv');
    CSVActions.showCSVDropzone();
    this.setState(newstate);
  },

  _openCSDHBrowser: function(e){
    var newstate = this.state;
    newstate.mode = 'csdh';
    console.log('Setting state to csdh');
    BrowserActions.showBrowser();
    this.setState(newstate);
  },

  _openDataverseBrowser: function(e){
    var newstate = this.state;
    newstate.mode = 'dataverse';
    DataverseActions.showDataverseBrowser();
    this.setState(newstate);
  },
});

module.exports = Welcome;


//
// Browse Datasets on CSDH
// <img src="img/sdh-logo-draft.png"></img>
// Browse Datasets on Dataverse
// <img src="img/dataverse-logo-fake.png"></img>
