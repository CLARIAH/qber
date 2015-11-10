var React = require('react');
var _ = require('lodash');
var ReactPropTypes = React.PropTypes;
var PillSelector = require('./PillSelector.react');
var QBerModal = require('./QBerModal.react');
var Caret = require('./Caret.react');

function findByURI(source, uri) {
    return source.filter(function( obj ) {
        return obj.uri === uri;
    })[ 0 ];
}


var ValueDefinitionTable = React.createClass({

  // This React class only works if a list of 'values' is passed through its properties.
  propTypes: {
    values: ReactPropTypes.array.isRequired
  },

  getInitialState: function() {
    return {
      'visible': true,
      'modal_visible': false,
      'selected_code_value': undefined,
      'selected_code_uri': undefined
    };
  },

  /**
   * @return {object}
   */
  render: function() {
    console.log("ValueDefinitionTable props:");
    console.log(this.props);

    // This section should be hidden by default
    // and shown when we do have variables in our dataset
    if (this.props.values === undefined || this.props.values.length < 1) {
      return null;
    }



    var table;
    if (this.state.visible) {
      var values = this.props.values;
      var values_rows = [];
      var button_disabled = (this.props.dimension && this.props.dimension.codelist) ? false: true;

      for (var key in values) {
        var mapped_uri = values[key].uri;
        var mapped_uri_icon;
        if (mapped_uri){
          mapped_uri_icon = <span className="glyphicon glyphicon-link"/>;
        }
        var browse_mapped_uri;
        if (mapped_uri){
          browse_mapped_uri = "http://data.clariah-sdh.eculture.labs.vu.nl/browse?uri="+encodeURIComponent(mapped_uri);
        }
        values_rows.push(<tr key={values[key].label}>
                          <td>
                            { values[key].label }
                          </td>
                          <td>
                            <span className='btn btn-default btn-xs'
                                  value={values[key].label}
                                  onClick={this._handleToggleModal}
                                  disabled={button_disabled}>
                                  <span className="glyphicon glyphicon-random"/>
                            </span>
                          </td>
                          <td width="100%">
                            {mapped_uri_icon}
                            <a className='small' target="_blank" href={browse_mapped_uri}>
                              {mapped_uri}
                            </a>
                          </td>
                          <td>
                            <span className='badge pull-right'> { values[key].count }</span>
                          </td>
                        </tr>);
      }

      var modal;
      if (this.props.dimension && this.props.dimension.codelist){
        console.log(this.props.dimension.codelist);
        var title = <span>Select corresponding code for <strong>{this.state.selected_code_value}</strong></span>;

        var sorted_values = _.sortBy(this.props.dimension.codelist.values,'label');
        // Codelist present
        modal = <QBerModal visible={this.state.modal_visible}
                   title={title}
                   value={this.state.selected_code_value}
                   selection={(this.state.selected_code_value !== undefined && this.props.dimension.codelist.mappings !== undefined) ? this.props.dimension.codelist.mappings[this.state.selected_code_value] : undefined}
                   options={sorted_values}
                   doSelect={this._handleSelected}
                   doClose={this._handleToggleModal} />;
      }

      table = <div style={{overflow: 'scroll', maxHeight: '300px'}}>
                <table className="table table-striped">
                  <tbody>
                    {values_rows}
                  </tbody>
                </table>
                {modal}
              </div>;
    }



    return (
      <section id="values_table">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h5 className="panel-title" onClick={this._onToggle} aria-expanded={this.state.visible}>
              Frequency Table
              <Caret visible={this.state.visible}/>
            </h5>
          </div>
          <div className={this.state.visible ? 'panel-body' : 'panel-body hidden'} >
              {table}
          </div>
        </div>
      </section>
    );
  },

  _filter: function(option){
    return (option.label.search(regexp) > -1) ? '': (option.uri.search(regexp) > -1) ? '': 'none';
  },

  _handleSelected: function(code_uri){
    // The code uri is the selected uri in the QBerModal PillSelector.
    console.log(code_uri);
    // values is the list of code values for this variable
    var values = this.props.values;
    // The selected code value, is the currently visible code value
    var selected_code_value = this.state.selected_code_value;

    // Get the index of the selected code value, and increment it by 1 (the next code value)
    var next_index = _.findIndex(values, 'id', this.state.selected_code_value) + 1;

    // Set index to 0 if the resulting index is outside the values array (looping)
    if (next_index == values.length){
      next_index = 0;
    }

    // Copy the current state
    var new_state = this.state;
    // Set the selected code value to the next id in the values array (i.e. the code at the next index)
    new_state.selected_code_value = values[next_index].label;
    // Update the state
    this.setState(new_state);

    // Call the externally defined function that handles the mappings between (external) values and the source values.
    this.props.doMapping(selected_code_value, code_uri);
  },


  _handleToggleModal: function(e){
    var new_state = this.state;
    new_state.selected_code_value = e.currentTarget.getAttribute('value');
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

module.exports = ValueDefinitionTable;
