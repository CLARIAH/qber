var React = require('react');
var ReactPropTypes = React.PropTypes;
var DatasetActions = require('../actions/DatasetActions');
var DimensionDefinitionPanel = require('./DimensionDefinitionPanel.react');
var Value = require('./Value.react');

var DatasetPanel = React.createClass({

  // This React class only works if a 'dataset' is passed through its properties.
  propTypes: {
    variable: ReactPropTypes.string.isRequired,
    dataset: ReactPropTypes.object.isRequired,
    dimensions: ReactPropTypes.array.isRequired,
    schemes: ReactPropTypes.array.isRequired
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

    var variable = this.props.variable;
    var data = this.props.dataset.data;

    var columns = [];
    var heads = []
    var numrows = 0;

    for (var col in data){
      var column = [];
      var head = <div className="data-head" key={col}>{col}</div>;

      column.push(head);

      for (var c in data[col]){
        var value = data[col][c];
        var variable = this.props.dataset.variables[col];

        var cell = <Value value={value}
                           variable={variable} />;

        column.push(cell);
      }
      columns.push(<div className="data-col" key={col}>{column}</div>);
    }





    var table = <div id="values_table">
        {columns}
    </div>;

    return (
      <div className="col-md-12 main">
        <section id="dataset_panel">
          {table}
        </section>
      </div>
    );
  }
});



module.exports = DatasetPanel;
