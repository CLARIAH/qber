var React = require('react');
var Dropzone = require('react-dropzone');
var QBerModal = require('./QBerModal.react');
var CSVStore = require('../stores/CSVStore');


// store, actions

function getDropzoneState() {
  return {
    modal_visible: CSVStore.getModalVisible()
  };
}

var CSVDropzone = React.createClass({
    onDrop: function (files) {
      console.log('Received files: ', files);
    },

    getInitialState: function() {
      return getDropzoneState();
    },

    componentDidMount: function() {
      CSVStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
      CSVStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
      this.setState(getDropzoneState());
    },

    _handleHideBrowser: function(){
      CSVActions.closeCSVDropzone();
    },

    render: function () {

      // return ( <QBerModal  visible={this.state.modal_visible}
      //             title="Select a dataset to load"
      //             value={'.'}
      //             options={this.state.files}
      //             doSelect={this._handleSelected}
      //             doClose={this._handleHideBrowser}
      //             style={"slim-modal"} />
      //         );
      if (!this.state.modal_visible) {
        console.log("CSV modal is not visible");
        return null;
      } else {
        return (
            <div>
              <Dropzone onDrop={this.onDrop}>
                <div>Drop some CSV files here.</div>
              </Dropzone>
            </div>
        );
      }
    },
});

//React.render(<CSVDropzone />, document.body);

module.exports = CSVDropzone;
