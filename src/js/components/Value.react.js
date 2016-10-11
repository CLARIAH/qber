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
    value: ReactPropTypes.object.isRequired,
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
      value_button = null;
    } else if (this.props.variable.type != 'other'){
      var mapped_uri = value_definition.uri;
      var mapped_label = value_definition.label;
      var original_uri = value_definition.original.uri;
      var original_label = value_definition.original.label;

      var browse_uri = "http://data.clariah-sdh.eculture.labs.vu.nl/browse?uri="+encodeURIComponent(mapped_uri);

      // Update the 'encoded rate' by one for each mapped uri
      if (mapped_uri != original_uri) {
        value_button = <ul className="nav nav-pills nav-pills-stacked"
                           label={original_label}
                           onClick={this._handleSelectValue}>
                        <li role="presentation">
                          <a>
                            <span className="badge label-default">
                              <a href={browse_uri}
                                 target="_blank">
                                 <span className="glyphicon glyphicon-link"></span>
                              </a>
                            </span>
                            {mapped_label}
                          </a>
                        </li>
                      </ul>;
      } else {
        value_button = <div className="btn-group"
                            label={original_label}
                            onClick={this._handleSelectValue}>
                        <button type="button" className="btn btn-default btn-xs">
                          <span className="glyphicon glyphicon-link"></span>
                        </button>
                        <button type="button" className="btn btn-default btn-xs">
                          {original_label}
                        </button>
                       </div>;
      }

    } else {
      value_button = this.props.value;
    }


    return (
        value_button
    );
  },

});

module.exports = Value;
