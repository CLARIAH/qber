var React = require('react');
var ReactPropTypes = React.PropTypes;


var SDMXDimensionActions = require('../actions/SDMXDimensionActions');

var SDMXDimensionStore = require('../stores/SDMXDimensionStore');
var Pill = require('./Pill.react');

/**
 * Retrieve the current dataset from the DatasetStore
 */
function getSDMXDimensionState() {
  return {
    dimensions: SDMXDimensionStore.get(),
    search: SDMXDimensionStore.getDimensionSearch(),
    selected_dimension: SDMXDimensionStore.getSelectedDimension()
  };
}

var SDMXDimensionList = React.createClass({

  getInitialState: function() {
    return getSDMXDimensionState();
  },

  componentDidMount: function() {
    SDMXDimensionStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    SDMXDimensionStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
    console.log("In SDMXDimensionList render");
    var dimensions = this.state.dimensions;
    var search = this.state.search;
    var selected_dimension = this.state.selected_dimension;
    var dimension_items = [];

    console.log(dimensions);

    if (search === undefined || search.length < 1 || search === "") {
      console.log("Search is undefined or zero");
      for (var key in dimensions) {
        dimension_items.push(
          <Pill key={key} variable={dimensions[key].uri} value={dimensions[key].label} isSelected={dimensions[key].uri == selected_dimension} onClicked={this._handleClick} />
        );
      }
    } else {
      console.log("Search is: '"+search+"'");
      regexp = new RegExp(search,"i");
      for (var key in dimensions) {
        if (dimensions[key].label.search(regexp) > -1) {
          dimension_items.push(
            <Pill key={key} variable={dimensions[key].uri} value={dimensions[key].label} isSelected={dimensions[key].uri == selected_dimension} onClicked={this._handleClick}/>
          );
        }
      }
    }

    var input;
    if (this.props.justSelected) {
      input = <input className="form-control" width="100%" onChange={this._handleChange} type="text" value={search}/>;
    } else {
      input = <input className="form-control" width="100%" onChange={this._handleChange} type="text"/>;
    }

    return (
        <section id="dimensions_list">
          { input }
          <ul className="nav nav-pills" role="tablist">
            {dimension_items}
          </ul>
        </section>
    );
  },


  /**
   * Event handler for a selection in variable list nav .
   */
  _handleClick: function(event) {
    SDMXDimensionActions.selectDimension(event.target.text);
  },

  /**
   * Event handler for a selection in the Select element.
   */
  _handleChange: function(event) {
    SDMXDimensionActions.searchDimension(event.target.value);
  },

  /**
   * Event handler for 'change' events coming from the DatasetStore
   */
  _onChange: function() {
    this.setState(getSDMXDimensionState());
  }

});

module.exports = SDMXDimensionList;
