var React = require('react');
var ReactPropTypes = React.PropTypes;

var cx = require('classnames');

function isString(o) {
    return (typeof o == "string" || o['constructor'] === String);
}


var Pill = React.createClass({

  // This React class only works if a list of 'variables' is passed through its properties.
  propTypes: {
    option: ReactPropTypes.object.isRequired,
    isSelected: ReactPropTypes.bool.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    // This section should be hidden by default
    // and shown when we do have variables in our dataset
    if (this.props.option === undefined) {
      return null;
    }

    var value, text, link, badge;

    if (isString(this.props.option)){
      console.log("It is a string...");
      text = <span>{this.props.option}</span>;
      value = this.props.option;
    } else {
      console.log("It is an object...");

      text = <span>{this.props.option.label}</span>;
      if (this.props.option.uri){
        link = <span className="small">&nbsp;&lt;{this.props.option.uri}&gt;</span>;
        value = this.props.option.uri;
      } else {
        value = this.props.option.label;
      }
      if (this.props.option.refs){
        badge = <span className="badge pull-right">{this.props.option.refs}</span>;
      }
    }

    var classes = cx({
      'active': this.props.isSelected
    });

    var anchor = <a href="#" value={value}
                             className={classes}
                             title={value}
                             onClick={this.props.onClicked}>{text}{link}{badge}</a>;


    return (
        <li role="presentation" style={this.props.style}>
          {anchor}
        </li>
    );
  },

});

module.exports = Pill;
