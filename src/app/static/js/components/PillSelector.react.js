var React = require('react');
var ReactPropTypes = React.PropTypes;
var Pill = require('./Pill.react');


var PillSelector = React.createClass({

  // This React class only works if a list of 'options' is passed through its properties.
  propTypes: {
    options: ReactPropTypes.array.isRequired,
    doSelect: ReactPropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
            'search': undefined,
            'selected': undefined
          };
  },

  /**
   * @return {object}
   */
  render: function() {
    console.log("In PillSelector render");

    var options = this.props.options;

    var filter;
    if (this.props.filterFunction){
      filter = this.props.filterFunction;
    } else {
      filter = this._filter;
    }

    var search = this.state.search;
    var selected = this.state.selected;

    var visible_items = [];



    for (var key in options) {
      var style;
      if (search !== undefined && search.length > 1 && search !== "") {
        regexp = new RegExp(search,"i");
        style = {
          'display': filter(options[key])
        };
      }
      visible_items.push(
        <Pill key={key} style={style}
                        option={options[key]}
                        isSelected={options[key] == selected}
                        onClicked={this._handleClick}/>
      );
    }

    var input = <input className="form-control" width="100%" onChange={this._handleChange} type="text"/>;

    return (
        <section>
          { input }
          <ul className="nav nav-pills nav-stacked" role="tablist">
            {visible_items}
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

    var new_state = {
      'search': this.state.search,
      'selected': value
    };

    this.props.doSelect(value);
    this.setState(new_state);
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


});

module.exports = PillSelector;
