var React = require('react');
var _ = require('lodash');
var ReactPropTypes = React.PropTypes;
var PillSelector = require('./PillSelector.react');
var QBerModal = require('./QBerModal.react');

function findByURI(source, uri) {
    return source.filter(function( obj ) {
        return obj.uri === uri;
    })[ 0 ];
}


var CodesTable = React.createClass({

  // This React class only works if a list of 'codes' is passed through its properties.
  propTypes: {
    codes: ReactPropTypes.array.isRequired
  },

  getInitialState: function() {
    return {
      'visible': true,
      'modal_visible': false,
      'selected_value': undefined
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
                          <td>
                            { codes[key].id }
                          </td>
                          <td>
                            <span className='btn btn-default btn-xs'
                                  value={codes[key].id}
                                  onClick={this._handleToggleModal}
                                  disabled={button_disabled}>
                                  <span className="glyphicon glyphicon-random"/>
                            </span>
                          </td>
                          <td width="100%">
                            <span className='badge pull-right'> { codes[key].count }</span>
                          </td>
                        </tr>);
      }

      var modal;
      if (this.props.dimension && this.props.dimension.codelist){
        console.log(this.props.dimension.codelist);
        var title = <span>Select corresponding code for <strong>{this.state.selected_value}</strong></span>;

        var sorted_codes = _.sortBy(this.props.dimension.codelist.codes,'label');
        // Codelist present
        modal = <QBerModal visible={this.state.modal_visible}
                   title={title}
                   value={this.state.selected_value}
                   options={sorted_codes}
                   doSelect={this._handleSelected}
                   doClose={this._handleToggleModal} />;
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

  _handleSelected: function(code){
    console.log(code);
    var codes = this.props.codes;
    var selected_value = this.state.selected_value;
    // Get the index of this element + 1 (the next element)
    var index = _.findIndex(codes, 'id', this.state.selected_value) + 1;

    // Set index to 0 if the index is outside the codes array
    if (index == codes.length){
      index = 0;
    }

    // TODO: Add mapping between the selected code and the external code value (in 'value')

    var new_state = this.state;
    new_state.selected_value = codes[index].id;
    this.setState(new_state);

    this.props.doMapping(selected_value, value);
  },


  _handleToggleModal: function(e){
    var new_state = this.state;
    new_state.selected_value = e.currentTarget.getAttribute('value');
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
