var React = require('react');
var ReactPropTypes = React.PropTypes;
var DatasetActions = require('../actions/DatasetActions');

var CodesTable = React.createClass({

  // This React class only works if a list of 'codes' is passed through its properties.
  propTypes: {
    codes: ReactPropTypes.array.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    // This section should be hidden by default
    // and shown when we do have variables in our dataset
    if (this.props.codes === undefined || this.props.codes.length < 1) {
      return null;
    }

    var codes = this.props.codes;
    var codes_rows = [];

    for (var key in codes) {
      codes_rows.push(<tr key={codes[key].id}><td> { codes[key].id } <span className='badge pull-right'> { codes[key].count }</span></td></tr>);
    }

    return (
      <div style={{overflow: 'scroll', height: '200px'}}>
        <table className="table table-striped">
          <tbody>
            {codes_rows}
          </tbody>
        </table>
      </div>
    );
  }
});

module.exports = CodesTable;
