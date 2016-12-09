var React = require('react');
var ReactPropTypes = React.PropTypes;
var DatasetActions = require('../actions/DatasetActions');
var DimensionDefinitionPanel = require('./DimensionDefinitionPanel.react');
var DatasetStore = require('../stores/DatasetStore');
var Value = require('./Value.react');
var Variable = require('./Variable.react');


/**
 * Retrieve the current visibility from the DatasetStore
 */
function getDatasetPanelState() {
  return {
    'variables': DatasetStore.getVariables(),
  };
}

var DatasetPanel = React.createClass({

  // This React class only works if a 'dataset' is passed through its properties.
  propTypes: {
    dataset: ReactPropTypes.object.isRequired,
    dimensions: ReactPropTypes.array.isRequired,
    schemes: ReactPropTypes.array.isRequired,
    doSelectVariable: ReactPropTypes.object.isRequired,
    doSelectValue: ReactPropTypes.object.isRequired,
    selectedVariable: ReactPropTypes.object.isRequired,
    selectedValue: ReactPropTypes.string.isRequired
  },

  getInitialState: function() {
    // Get the state from the store
    return getDatasetPanelState();
  },

  componentDidMount: function() {
    DatasetStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    DatasetStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
    // This section should be hidden by default
    // and shown when there is a dataset
    if (Object.keys(this.props.dataset).length < 1) {
      console.log("Dataset is empty");
      return null;
    }

    var data = this.props.dataset.data;


    var columns = [];
    var heads = []
    var numrows = 0;

    for (var col in data){
      var column = [];
      var variable = this.state.variables[col];
      var head = <Variable selectedVariable={this.props.selectedVariable}
                           selectedValue={this.props.selectedValue}
                           doSelectVariable={this.props.doSelectVariable}
                           variable={variable}
                           key={'variable-' + col}/>;

      column.push(head);

      for (var c in data[col]){
        var value = data[col][c];

        var cell = <Value selectedVariable={this.props.selectedVariable}
                          selectedValue={this.props.selectedValue}
                          value={value}
                          variable={variable}
                          doSelectValue={this.props.doSelectValue}
                          key={'value-' + col + '-' + c} />;

        column.push(cell);
      }
      columns.push(<div className="data-col" key={'column-' + col}>{column}</div>);
    }



    var table = <div id="values_table">
        {columns}
    </div>;

    return (
      <div className="col-md-12">
        <section id="dataset_panel">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h5 className="panel-title">
                Data
              </h5>
            </div>
            <div className='panel-body'>
                {table}
            </div>
          </div>
        </section>
      </div>
    );
  },

  /**
   * Event handler for 'change' events coming from the DatasetStore
   */
  _onChange: function() {
    this.setState(getDatasetPanelState());
  }
});



module.exports = DatasetPanel;
