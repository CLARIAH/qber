var React = require('react');
var ReactPropTypes = React.PropTypes;
var VariableSelectActions = require('../actions/VariableSelectActions');
var PillSelector = require('./PillSelector.react');



var VariableSelectPanel = React.createClass({

  // This React class only works if a list of 'options' is passed through its properties.
  propTypes: {
    options: ReactPropTypes.array.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    return (
      <section id="variable_select_panel">
        <h4>Variables</h4>
        <PillSelector options={this.props.options} doSelect={this._onSelected}/>
      </section>
    );
  },

  /**
   * Event handler for selections in the PillSelector
   */
  _onSelected: function(value) {
    VariableSelectActions.selectVariable(value);
  }

});

module.exports = VariableSelectPanel;
