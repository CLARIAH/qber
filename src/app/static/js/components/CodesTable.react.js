var React = require('react');
var ReactPropTypes = React.PropTypes;
var PillSelector = require('./PillSelector.react');
var QBerModal = require('./QBerModal.react');


var CodesTable = React.createClass({

  // This React class only works if a list of 'codes' is passed through its properties.
  propTypes: {
    codes: ReactPropTypes.array.isRequired
  },

  getInitialState: function() {
    return {
      'visible': true,
      'modal_visible': false,
      'selected_code': undefined
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
      var button_disabled = (this.props.dimension && this.props.dimension.codelist) ? false: true;

      for (var key in codes) {

        codes_rows.push(<tr key={codes[key].id}>
                          <td> { codes[key].id } </td>
                          <td>
                            <span className='badge pull-right'> { codes[key].count }</span>
                            <span className='btn btn-default btn-xs'
                                  value={codes[key].id}
                                  onClick={this._handleShowCodes}
                                  disabled={button_disabled}>
                                  Map
                            </span>
                          </td>
                          </tr>);
      }

      var modal;
      if (this.props.dimension && this.props.dimension.codelist){
        console.log(this.props.dimension.codelist);
        // Codelist present
        modal = <QBerModal visible={this.state.modal_visible}
                   options={this.props.dimension.codelist.codes}
                   doSelect={this._handleSelected}
                   doClose={this._handleHideModal} />;
      }

      table = <div style={{overflow: 'scroll', maxHeight: '300px'}}>
                <table className="table table-striped">
                  <tbody>
                    {codes_rows}
                  </tbody>
                </table>
                {modal}
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

  _handleShowCodes: function(e){
    var new_state = this.state;
    new_state.modal_visible = !this.state.modal_visible;
    this.setState(new_state);
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
