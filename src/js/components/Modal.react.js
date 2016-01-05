var React = require('react');
var ReactPropTypes = React.PropTypes;
var PillSelector = require('./PillSelector.react');


var Modal = React.createClass({

  // This React class only works if a list of 'variables' is passed through its properties.
  propTypes: {
    // Options should have a label and a uri (or file:/// path)
    doSelect: ReactPropTypes.func.isRequired,
    doClose: ReactPropTypes.func.isRequired,
    visible: ReactPropTypes.bool.isRequired,
    title: ReactPropTypes.string.isRequired,
    component: ReactPropTypes.object.isRequired,
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

    var Component = this.props.component;

    return (
      <section id="qber_modal_component" onKeyUp={this._handleKeyUp}>
        <div className="overlay" onClick={this.props.doClose}/>
        <div className="slim-modal">
          <div className="panel panel-default">
            <div className="panel-heading">
              <button type="button" className="close" onClick={this.props.doClose} aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4>{this.props.title}</h4>
            </div>
            <div className="panel-body">
              <Component {...this.props}/>
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

module.exports = Modal;
