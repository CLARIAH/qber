var React = require('react');
var ReactPropTypes = React.PropTypes;
var PillSelector = require('./PillSelector.react');


var SDMXDimensionModal = React.createClass({

  // This React class only works if a list of 'variables' is passed through its properties.
  propTypes: {
    dimensions: ReactPropTypes.object.isRequired,
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
      <section id="sdmx_dimension_modal" onKeyUp={this._handleKeyUp}>
        <div className="overlay" onClick={this.props.doClose}/>
        <div className="qber-modal">
          <PillSelector options={this.props.dimensions} doSelect={this.props.doSelect} filterFunction={this._filter} />
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

module.exports = SDMXDimensionModal;
