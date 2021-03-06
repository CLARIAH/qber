var React = require('react');
var ReactPropTypes = React.PropTypes;
var DimensionStore = require('../stores/DimensionStore');
var DatasetActions = require('../actions/DatasetActions');
var PillSelector = require('./PillSelector.react');

var Sidebar = React.createClass({

  // This React class only works if a list of 'options' is passed through its properties.
  propTypes: {
    options: ReactPropTypes.array.isRequired
  },

  getInitialState: function() {
    return { 'variables' : DimensionStore.getVariableNames() };
  },

  componentDidMount: function() {
    DimensionStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    DimensionStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
    return (
      <div className="col-md-2 col-sm-3 sidebar">
        <section id="variable_select_panel">
          <h4>Variables</h4>
          <PillSelector options={this.state.variables} dataset={this.props.dataset} doSelect={this._onSelected} filterFunction={this._filter}/>
        </section>
      </div>
    );
  },

  _filter: function(regexp, option){
    return (option.label.search(regexp) > -1) ? '': 'none';
  },

  /**
   * Event handler for selections in the PillSelector
   */
  _onSelected: function(value) {

    // If we haven't yet retrieved the codelist...
    if (this.props.dataset.variables[value].codelist.codes == undefined){
      scheme_uri = this.props.dataset.variables[value].codelist.uri
      // Retrieve the list of concepts belonging to this scheme
      DatasetActions.updateConcepts(scheme_uri);
    }
    DatasetActions.chooseVariable(value);
  },

  /**
   * Event handler for changes coming from the DatasetStore
   */
  _onChange: function() {
    this.setState({ 'variables' : DimensionStore.getVariableNames() });
  }

});

module.exports = Sidebar;
