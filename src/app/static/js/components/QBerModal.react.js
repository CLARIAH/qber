var React = require('react');
var ReactPropTypes = React.PropTypes;
var PillSelector = require('./PillSelector.react');


var QBerModal = React.createClass({

  // This React class only works if a list of 'variables' is passed through its properties.
  propTypes: {
    options: ReactPropTypes.object.isRequired,
    doSelect: ReactPropTypes.object.isRequired,
    doClose: ReactPropTypes.object.isRequired,
    visible: ReactPropTypes.bool.isRequired,
    value: ReactPropTypes.string.isRequired,
    selection: ReactPropTypes.string.isRequired
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

    var selection_small = this.props.selection ? <small>({this.props.selection})</small> : undefined;

    return (
      <section id="qber_modal_component" onKeyUp={this._handleKeyUp}>
        <div className="overlay" onClick={this.props.doClose}/>
        <div className="qber-modal">
          <div className="panel panel-default">
            <div className="panel-heading">
              <button type="button" className="close" onClick={this.props.doClose} aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4>{this.props.title} {selection_small}</h4>
            </div>
            <div className="panel-body">
              <PillSelector options={this.props.options} selection={this.props.selection} value={this.props.value} doSelect={this.props.doSelect} filterFunction={this._filter} />
            </div>
          </div>
        </div>
      </section>
    );
  },

  _filter: function(regexp, option){
    return (option.label.search(regexp) > -1) ? '': (option.uri.search(regexp) > -1) ? '': 'none';
  },

  _handleKeyUp: function(e){
    // If the escape key is pressed, close the modal.
    if (e.which == 27) {
      this.props.doClose(e);
    }
  }

});

module.exports = QBerModal;
