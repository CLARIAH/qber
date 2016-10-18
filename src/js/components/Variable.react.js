var React = require('react');
var ReactPropTypes = React.PropTypes;
var _ = require('lodash');

var cx = require('classnames');

function isString(o) {
    return (typeof o == "string" || o['constructor'] === String);
}


var Variable = React.createClass({

  // This React class only works if a list of 'variables' is passed through its properties.
  propTypes: {
    variable: ReactPropTypes.object.isRequired,
    doSelectVariable: ReactPropTypes.object.isRequired,
  },

  /**
   * @return {object}
   */
  render: function() {
    // This section should be hidden by default
    // and shown when we do have a variable and a variable
    if (this.props.variable === undefined ) {
      return null;
    }

    var variable_button = <div className="data-head" key={this.props.variable.label} onClick={this.props.doSelectVariable.bind(this, this.props.variable)}>{this.props.variable.label}</div>
    return (
        variable_button
    );
  },

});

module.exports = Variable;
