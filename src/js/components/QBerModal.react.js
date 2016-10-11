var React = require('react');
var ReactPropTypes = React.PropTypes;
var PillSelector = require('./PillSelector.react');


var QBerModal = React.createClass({

  // This React class only works if a list of 'variables' is passed through its properties.
  propTypes: {
    // Options should have a label and a uri (or file:/// path)
    options: ReactPropTypes.object.isRequired,
    doSelect: ReactPropTypes.func.isRequired,
    doClose: ReactPropTypes.func.isRequired,
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

    var style = "qber-modal";
    if (this.props.style !== undefined){
      style = this.props.style;
    }

    var selection_small = this.props.selection ? <small>({this.props.selection})</small> : undefined;

    var previous_button, next_button;

    if (this.props.doNext && this.props.doPrevious){
      previous_button = <button className="pull-right" onClick={this.props.doPrevious} aria-label="Previous"><span className="glyphicon glyphicon-chevron-left"></span></button>;
      next_button = <button className="pull-right" onClick={this.props.doNext} aria-label="Next"><span className="glyphicon glyphicon-chevron-right"></span></button>;
    }

    return (
      <section id="qber_modal_component" onKeyUp={this._handleKeyUp}>
        <div className="overlay" onClick={this.props.doClose}/>
        <div className={style}>
          <div className="panel panel-default">
            <div className="panel-heading">
              <button type="button" className="close" onClick={this.props.doClose} aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4>{this.props.title} {selection_small}</h4>
            </div>
            <div className="panel-body">
              <PillSelector options={this.props.options}
                            selection={this.props.selection}
                            value={this.props.value}
                            doSelect={this.props.doSelect}
                            filterFunction={this._filter} />
            </div>
            <div className="panel-footer">
              &nbsp;
              {next_button}
              {previous_button}
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
