var React = require('react');
var ReactPropTypes = React.PropTypes;
var SDMXDimensionActions = require('../actions/SDMXDimensionActions');
var SDMXDimensionList = require('./SDMXDimensionList.react');

var SDMXDimensionPanel = React.createClass({

  // This React class only works if a list of 'dimensions' is passed through its properties.
  // propTypes: {
  //   dimensions: ReactPropTypes.object.isRequired,
  // },

  /**
   * @return {object}
   */
  render: function() {
    // This section should be hidden by default
    // and shown when there is a dataset and variable.
    // if (Object.keys(this.props.dimensions).length < 1 || this.props.dimensions === undefined) {
    //   return null;
    // }


    return (
      <section id="sdmx_dimension_panel">
        <div className="overlay"></div>
        <div className="qber-modal">
          <div className="container">
            <SDMXDimensionList/>
          </div>
        </div>
      </section>
    );
  },

});

module.exports = SDMXDimensionPanel;
