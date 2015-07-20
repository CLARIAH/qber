var React = require('react');
var ReactPropTypes = React.PropTypes;
var Pill = require('./Pill.react');

function isString(o) {
    return (typeof o == "string" || o['constructor'] === String);
}

var PillSelector = React.createClass({

  // This React class only works if a list of 'options' is passed through its properties.
  propTypes: {
    options: ReactPropTypes.array.isRequired,
    doSelect: ReactPropTypes.object.isRequired
  },

  visibleItems: [],

  getInitialState: function() {
    return {
            'search': undefined,
            'selected': undefined
          };
  },

  componentDidMount: function() {
    React.findDOMNode(this.refs.dimensionInput).focus();
  },

  /**
   * @return {object}
   */
  render: function() {
    var options = this.props.options;

    var filter;
    if (this.props.filterFunction){
      filter = this.props.filterFunction;
    } else {
      filter = this._filter;
    }

    var search = this.state.search;
    var selected = this.state.selected;
    var items = [];
    // Reset the visible items
    this.visibleItems = [];

    if (this.props.value && search === undefined ) {
      search = this.props.value;
    }

    for (var key in options) {
      var style;
      if (search !== undefined && search.length > 1 && search !== "") {
        regexp = new RegExp(search,"i");
        var visible = filter(options[key]);
        style = {
          'display': visible
        };
        if (visible !== 'none'){
          this.visibleItems.push(options[key]);
        }
      }
      items.push(
        <Pill key={key} style={style}
                        option={options[key]}
                        isSelected={options[key] == selected}
                        onClicked={this._handleClick}/>
      );
    }


    var input = <input className="form-control"
                       ref="dimensionInput"
                       width="100%"
                       onChange={this._handleChange}
                       onKeyUp={this._handleKeyUp}
                       type="text"/>;

    return (
        <section>
          { input }
          <ul className="nav nav-pills nav-stacked" role="tablist">
            {items}
          </ul>
        </section>
    );
  },

  _filter: function(option){
    return (option.search(regexp) > -1) ? '': 'none'
  },

  /**
   * Event handler for a selection in variable list nav .
   */
  _handleClick: function(event) {
    var value = event.currentTarget.getAttribute('value');

    this._handleSelect(value);
  },

  /**
   * Event handler for a selection in the Select element.
   */
  _handleChange: function(event) {
    var new_state = {
      'search': event.target.value,
      'selected': this.state.selected
    };
    this.setState(new_state);
  },

  _handleSelect: function(value) {
    var new_state = {
      'search': this.state.search,
      'selected': value
    };

    this.props.doSelect(value);
    this.setState(new_state);
  },

  _handleKeyUp: function(e){
    // If the return/enter key is pressed, and the list of visible items is of length 1, select that option.
    if (e.which == 13 && this.visibleItems.length == 1){
      var value = this.visibleItems[0];
      if (isString(value)) {
        this._handleSelect(value);
      } else {
        this._handleSelect(value.uri);
      }
    }
  },


});

module.exports = PillSelector;
