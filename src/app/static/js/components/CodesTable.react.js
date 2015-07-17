var React = require('react');
var ReactPropTypes = React.PropTypes;
var PillSelector = require('./PillSelector.react');


var CodesTable = React.createClass({

  // This React class only works if a list of 'codes' is passed through its properties.
  propTypes: {
    codes: ReactPropTypes.array.isRequired
  },

  getInitialState: function() {
    return {
      'visible': true
    };
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

    var caret;
    if (this.state.visible){
      caret = <span className="small glyphicon glyphicon-chevron-up"></span>;
    } else {
      caret = <span className="small glyphicon glyphicon-chevron-down"></span>;
    }

    var table;
    if (this.state.visible) {
      var codes = this.props.codes;
      var codes_rows = [];

      for (var key in codes) {
        codes_rows.push(<tr key={codes[key].id}>
                          <td> { codes[key].id } </td>
                          <td> <span className='badge pull-right'> { codes[key].count }</span></td></tr>);
      }

      table = <div style={{overflow: 'scroll', maxHeight: '300px'}}>
                <table className="table table-striped">
                  <tbody>
                    {codes_rows}
                  </tbody>
                </table>
              </div>;
    }



    return (
      <section id="codes_table">
        <h4 onClick={this._onToggle} aria-expanded={this.state.visible}>Frequency Table {caret}</h4>
        {table}
      </section>
    );
  },

  _filter: function(option){
    return (option.label.search(regexp) > -1) ? '': (option.uri.search(regexp) > -1) ? '': 'none';
  },

  /**
   * Event handler for the visible/invisible click
   */
  _onToggle: function() {
    var new_state = this.state;
    new_state.visible = !this.state.visible;
    this.setState(new_state);
  },
});

module.exports = CodesTable;
