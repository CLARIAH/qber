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

    var header = [];
    var numrows = 0;

    for (var col in data){
      var head = <th key={col}>{col}</th>;
      header.push(head);
      // Take the length of the column to determine the number of rows
      // TODO: Fix this, because it now happens for every column, which is nonsense
      numrows = data[col].length;
    }

    console.log("Number of rows: " + numrows)


    var rows = [];
    for (var i=0; i < numrows; i++){
      var row = [];
      for (var col in data){
        var value = data[col][i];
        var variable = this.props.dataset.variables[col];

        var cell = <td key={col + "_" + i}>
                    <Value value={value}
                           variable={variable} />
                   </td>;

        row.push(cell);
      }
      rows.push(<tr key={row + "_" + i}>{row}</tr>);
    }

    var table = <table id="values_table" className='table table-striped table-responsive'>
      <thead>
        {header}
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>;

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
