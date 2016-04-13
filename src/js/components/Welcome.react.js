var React = require('react');
var Browser = require('./Browser.react');
var DataverseBrowser = require('./DataverseBrowser.react');
var DataverseActions = require('../actions/DataverseActions');
var BrowserActions = require('../actions/BrowserActions');

var ReactPropTypes = React.PropTypes;


var Welcome = React.createClass({

  // This React class only works if a 'visible' value is passed through its properties.
  propTypes: {
    visible: ReactPropTypes.bool.isRequired
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
    switch(this.state.mode){
      case 'csdh':
        console.log('csdh');
        csdh_browser = <Browser/>;
        break;
      case 'dataverse':
        console.log('dataverse');
        dataverse_browser = <DataverseBrowser/>;
        break;
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
              <div className="text-center center-block">
                <div className="btn btn-primary btn-space" onClick={this._openCSVBrowser}>Upload CSV</div>
                <div className="btn btn-primary btn-space" onClick={this._openCSDHBrowser}>Browse CSDH</div>
                <div className="btn btn-default btn-space" onClick={this._openDataverseBrowser}>Browse Dataverse</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
