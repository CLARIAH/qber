var React = require('react');
var ReactPropTypes = React.PropTypes;
var TodoActions = require('../actions/DatasetActions');
// var Mapping = require('./Mapping.react');

var VariablePanel = React.createClass({

  propTypes: {
    allDatasets: ReactPropTypes.object.isRequired,
    areAllComplete: ReactPropTypes.bool.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    // This section should be hidden by default
    // and shown when there are datasets.
    if (Object.keys(this.props.allDatasets).length < 1) {
      return null;
    }

    var allDatasets = this.props.allDatasets;
    var datasets = [];

    for (var key in allDatasets) {
      datasets.push(<li> {key} </li>);
    }

    return (
      <section id="main">
        <input
          id="toggle-all"
          type="checkbox"
          onChange={this._onToggleCompleteAll}
          checked={this.props.areAllComplete ? 'checked' : ''}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul id="dataset-list">{datasets}</ul>
      </section>
    );
  },

  /**
   * Event handler to mark all TODOs as complete
   */
  _onToggleCompleteAll: function() {
    TodoActions.toggleCompleteAll();
  }

});

module.exports = VariablePanel;
