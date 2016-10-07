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
    variable: ReactPropTypes.object.isRequired,
    schemes: ReactPropTypes.array.isRequired
  },

  getInitialState: function() {
    return {
      'visible': true,
      'modal_visible': false,
      'selected_value_uri': undefined,
      'selected_value_label': undefined
    };
  },

  /**
   * @return {object}
   */
  render: function() {



    // This section should be hidden by default
    // and shown when we do have variables in our dataset
    if (this.props.variable.values === undefined || this.props.variable.values.length < 1) {
      return null;
    }

    var table;
    if (this.state.visible) {
      var values = this.props.variable.values;
      var values_rows = [];

      var uri_column
      if (this.props.variable.category!== 'other'){
        uri_column = <th>URI</th>
      }
      values_rows.push(
        <tr>
        <th>#</th>
        <th>Original Value</th>
        <th></th>
        <th width='100%'>Interpreted Value</th>
        {uri_column}
        </tr>
      )

      // The button is enabled if there's a variable, and the variable is of category community or coded
      var button_disabled = (this.props.variable && (this.props.variable.category == 'community' || this.props.variable.category == 'coded' )) ? false: true;

      var encoded_rate = 0;
      for (var key in values) {
        var mapping, mapped_uri_col;

        if(this.props.variable.category !== 'other'){
          // If we're dealing with a coded or identity variable, we need to show the URI
          var mapped_uri = values[key].uri;
          var mapped_label = values[key].label;
          if (mapped_uri != values[key].original.uri) {
            encoded_rate++;
          }
          var mapped_uri_icon;
          if (mapped_uri){
            mapped_uri_icon = <span className="glyphicon glyphicon-link"/>;
          }
          var browse_mapped_uri;
          if (mapped_uri){
            browse_mapped_uri = "http://data.clariah-sdh.eculture.labs.vu.nl/browse?uri="+encodeURIComponent(mapped_uri);
          }

          // Strip to something more readable as long as it is not mapped.
          if (mapped_uri == values[key].original.uri) {
            mapped_uri = "value:" +_.last(_.split(mapped_uri, '/'));
          }

          mapping = <div>
                          {mapped_uri_icon}
                          <a className='small' target="_blank" href={browse_mapped_uri}>
                            {mapped_uri}
                          </a>
                        </div>;
        } else {
          // Otherwise, we show the 'literal' value for the variable
          mapping = <div>
                      <code>{values[key].label}</code>
                    </div>;
        }


        values_rows.push(<tr key={values[key].original.label}>
                          <td>
                            { values[key].original.label }
                          </td>
                          <td>
                            <span className='btn btn-default btn-xs'
                                  label={values[key].original.label}
                                  onClick={this._handleSelectValue}
                                  disabled={button_disabled}>
                                  <span className="glyphicon glyphicon-random"/>
                            </span>
                          </td>
                          <td width="100%">
                            { mapping }
                          </td>
                          <td>
                            <span className='badge pull-right'> { values[key].count }</span>
                          </td>
                        </tr>);
      }
      // console.log('rate');
      // console.log(encoded_rate/this.props.variable.values.length);

      var modal;
      // We only prepare the modal if we have a community or coded variable
      if (this.props.variable && (this.props.variable.category == 'community' || this.props.variable.category == 'coded' )){
        var title = <span>Select corresponding code for <strong>{this.state.selected_value_label}</strong></span>;

        var scheme = _.find(this.props.schemes, {'uri': this.props.variable.codelist.uri});

        var sorted_values;
        // If we have a stored scheme, sort the concepts by label
        if(scheme !== undefined) {

          sorted_values = _.sortBy(scheme.concepts,'label');
        } else {
          // Otherwise, we simply sort the values of the variable (i.e. the defaults)
          sorted_values = _.sortBy(this.props.variable.values,'label');
        }

        // Codelist present
        modal = <QBerModal visible={this.state.modal_visible}
                   title={title}
                   value={this.state.selected_value_label}
                   selection={this.state.selected_value_uri}
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


    // values is the list of code values for this variable
    var values = this.props.variable.values;
    // The selected code value, is the currently visible code value
    var selected_value_uri = this.state.selected_value_uri;

    // Get the index of the selected code value, and increment it by 1 (the next code value)
    var next_index = _.findIndex(values, 'uri', this.state.selected_value_uri) + 1;

    // Set index to 0 if the resulting index is outside the values array (looping)
    if (next_index == values.length){
      next_index = 0;
    }

    // Copy the current state
    var new_state = this.state;
    // Set the selected code value to the next id in the values array (i.e. the code at the next index)
    new_state.selected_value_uri = values[next_index].uri;
    new_state.selected_value_label = values[next_index].label;
    // Update the state
    this.setState(new_state);

    // Call the externally defined function that handles the mappings between (external) values and the source values.
    this.props.doMapping(selected_value_uri, code_uri);
  },

  _handleSelectValue: function(e){
    var new_state = this.state;

    new_state.selected_value_label = e.currentTarget.getAttribute('label');
    var key = (isNaN(new_state.selected_value_label)) ? new_state.selected_value_label : Number(new_state.selected_value_label);
    new_state.selected_value_uri = _.find(this.props.variable.values, 'label', key).uri;

    this.setState(new_state);
    this._handleToggleModal()
  },

  _handleToggleModal: function(){
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

module.exports = ValueDefinitionTable;
