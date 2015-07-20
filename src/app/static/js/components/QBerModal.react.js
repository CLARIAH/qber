var React = require('react');
var ReactPropTypes = React.PropTypes;
var PillSelector = require('./PillSelector.react');


var QBerModal = React.createClass({

  // This React class only works if a list of 'variables' is passed through its properties.
  propTypes: {
    options: ReactPropTypes.object.isRequired,
    doSelect: ReactPropTypes.object.isRequired,
    doClose: ReactPropTypes.object.isRequired,
    visible: ReactPropTypes.bool.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    // This section should be hidden by default
    // and shown when we set the prop to visible
    if (this.props.visible === undefined || !this.props.visible) {
      return null;
    }

    return (
      <section id="qber_modal_component" onKeyUp={this._handleKeyUp}>
        <div className="overlay" onClick={this.props.doClose}/>
        <div className="qber-modal">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h4>{this.props.title}</h4>
            </div>
            <div className="panel-body">
              <PillSelector options={this.props.options} doSelect={this.props.doSelect} filterFunction={this._filter} />
            </div>
          </div>
        </div>
      </section>
    );
  },

  _filter: function(option){
    return (option.label.search(regexp) > -1) ? '': (option.uri.search(regexp) > -1) ? '': 'none';
  },

  _handleKeyUp: function(e){
    // If the escape key is pressed, close the modal.
    if (e.which == 27) {
      this.props.doClose();
    }
  }

});

module.exports = QBerModal;
