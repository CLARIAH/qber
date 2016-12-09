var React = require('react');
var ReactPropTypes = React.PropTypes;
var _ = require('lodash');

var cx = require('classnames');

function isString(o) {
    return (typeof o == "string" || o['constructor'] === String);
}


var Value = React.createClass({

  // This React class only works if a list of 'variables' is passed through its properties.
  propTypes: {
    doSelectValue: ReactPropTypes.object.isRequired,
    selectedValue: ReactPropTypes.string.isRequired,
    selectedVariable: ReactPropTypes.object.isRequired,
    value: ReactPropTypes.string.isRequired,
    variable: ReactPropTypes.object.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    // This section should be hidden by default
    // and shown when we do have a variable and a variable
    if (this.props.value === undefined || this.props.variable === undefined ) {
      return null;
    }

    var values = this.props.variable.values;
    var value_definition = _.find(values, {'label': this.props.value});
    var value_button;

    if (value_definition === undefined){
      value_button = <div className="data-cell">&nbsp;</div>;
    } else if (this.props.variable.category != 'other'){
      var mapped_uri = value_definition.uri;
      var mapped_label = value_definition.label;
      var original_uri = value_definition.original.uri;
      var original_label = value_definition.original.label;

      var browse_uri = "http://data.clariah-sdh.eculture.labs.vu.nl/browse?uri="+encodeURIComponent(mapped_uri);


      var star;

      if (mapped_uri != original_uri && this.props.variable.category == 'coded'){
        console.log("Coded property with mapped URI")
        star = <span className="glyphicon glyphicon-star text-success"></span>;
      } else if (this.props.variable.category == 'coded') {
        console.log("Coded property with unmapped URI")
        star = <span className="glyphicon glyphicon-star-empty text-warning"></span>;
      }



      /* Make sure that selected values are visually recognisable in the UI */
      var active = (this.props.variable == this.props.selectedVariable) && (this.props.value == this.props.selectedValue) && this.props.selectedValue != undefined
      var classes = cx({
        'data-cell': true,
        'data-cell-active': active
      });

      value_button = <div className={classes}
                          label={original_label}
                          onClick={this._handleSelectValue}>
                          <div className="data-label">
                            {original_label}
                          </div>
                          <div className="data-link">
                            {star}
                            <span className="glyphicon glyphicon-link text-info"></span>
                          </div>
                     </div>;
    } else {
      value_button = <div className="data-cell"><div className='data-label'>{this.props.value}</div></div>;
    }


    return (
        value_button
    );
  },

  _handleSelectValue: function(){
    console.log("You just selected variable "+this.props.variable.label+" with value "+this.props.value);
    console.log(this.props.variable);
    this.props.doSelectValue(this.props.variable, this.props.value);
  }

});

module.exports = Value;
