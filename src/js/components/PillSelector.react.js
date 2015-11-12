var React = require('react');
var ReactPropTypes = React.PropTypes;
var Pill = require('./Pill.react');

function isString(o) {
    return (typeof o == "string" || o['constructor'] === String);
}

var PillSelector = React.createClass({
  input: undefined,

  // This React class only works if a list of 'options' is passed through its properties.
  propTypes: {
    options: ReactPropTypes.array.isRequired,
    doSelect: ReactPropTypes.object.isRequired
  },

  visibleItems: [],

  getInitialState: function() {
    // Search is the value of the input field
    // Selected is the id of the selected Pill
    return {
            'search': this.props.value,
            'selected': this.props.selection
          };
  },

  componentDidMount: function() {
    var input = React.findDOMNode(this.refs.dimensionInput);

    if (this.props.selection !== undefined) {
      input.value = this.props.selection;
    } else if (this.props.value !== undefined){
      input.value = this.props.value;
    }
  },

  componentWillReceiveProps: function(nextProps){
    // Make sure that the value of the input is set to the selected mapping, or the value of the next item.
    // e.g. if a variable value is 'f', then the input should be set to 'f' and the PillSelector
    // should show only the pills that contain 'f'
    var input = React.findDOMNode(this.refs.dimensionInput);

    if (nextProps.selection !== undefined) {
      input.value = nextProps.selection;
      this.state.selected = nextProps.selection;
      this.state.search = nextProps.selection;
    } else if (nextProps.value !== undefined){
      input.value = nextProps.value;
      this.state.search = nextProps.value;
    } else {
      input.setAttribute('value','');
    }
  },

  /**
   * @return {object}
   */
  render: function() {
    var options = this.props.options;

    // The search string
    var search = this.state.search;
    // The selected item
    var selected = this.state.selected;

    // If search turns out to be undefined, we will use the value provided through the props..
    if (this.props.selection && search === undefined ) {
      search = this.props.selection;
    } if (this.props.value && search === undefined ) {
      search = this.props.value;
    }

    // A custom filter function (e.g. one that filters on multiple attributes of the pills)
    var filter;
    if (this.props.filterFunction){
      filter = this.props.filterFunction;
    } else {
      filter = this._filter;
    }

    // The list of items (the Pills we will build from the options)
    var items = [];

    // Reset the visible items
    this.visibleItems = [];

    for (var key in options) {
      // The style attributes
      var style;
      if (search !== undefined && search.length > 0 && search !== "") {
        regexp = new RegExp(search,"i");
        var visible = filter(regexp, options[key]);
        style = {
          'display': visible
        };
        if (visible !== 'none'){
          this.visibleItems.push(options[key]);
        }
      } else {
        this.visibleItems.push(options[key]);
      }

      items.push(
        <Pill key={key} style={style}
                        option={options[key]}
                        isSelected={options[key] == selected}
                        onClicked={this._handleClick}/>
      );
    }


    // If we don't have any items to show, then we should show something else
    var body;
    if (this.visibleItems.length > 0){
      body = <ul className="nav nav-pills nav-stacked" role="tablist">
               {items}
             </ul>;
    } else {
      body = <div className="alert alert-warning" role="alert"><strong>Warning:</strong> no matching items for {search}</div>;
    }

    var input = <input className="form-control"
                       ref="dimensionInput"
                       width="100%"
                       onChange={this._handleChange}
                       onKeyUp={this._handleKeyUp}
                       value={this.state.value}
                       type="text"/>;


    return (
        <section>
          { input }
          { body }
        </section>
    );
  },

  _filter: function(regexp, option){
    return (option.search(regexp) > -1) ? '': 'none'
  },

  /**
   * Event handler for a selection in the list.
   */
  _handleClick: function(event) {
    var value = event.currentTarget.getAttribute('value');

    // Now that we have the value, we can use it to actually 'select' the pill.
    this._handleSelect(value);
  },

  /**
   * Event handler for a change in the input element
   */
  _handleChange: function(event) {
    var new_state = {
      'search': event.target.value,
      'selected': this.state.selected
    };
    this.setState(new_state);
  },

  /**
   * Event handler for a change in the selection
   */
  _handleSelect: function(value) {
    // We update the state with the selected value.
    var new_state = {
      'search': undefined,
      'selected': value
    };

    this.setState(new_state);
    this.props.doSelect(value);
  },

  _handleKeyUp: function(e){
    console.log(e.which);
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
