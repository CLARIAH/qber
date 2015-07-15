var React = require('react');
var ReactPropTypes = React.PropTypes;

var cx = require('classnames');

var Pill = React.createClass({

  // This React class only works if a list of 'variables' is passed through its properties.
  propTypes: {
    text: ReactPropTypes.string.isRequired,
    isSelected: ReactPropTypes.bool.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    // This section should be hidden by default
    // and shown when we do have variables in our dataset
    if (this.props.text === undefined) {
      return null;
    }


    var text = <span>{this.props.text}</span>;
    var link;
    var badge;
    if (this.props.uri){
      link = <span className="small">&nbsp;&lt;{this.props.uri}&gt;</span>;
    }
    if (this.props.badge){
      badge = <span className="badge pull-right">{this.props.badge}</span>;
    }

    var classes = cx({
      'active': this.props.isSelected
    });

    var value;
    if (this.props.uri){
      value = this.props.uri;
    } else {
      value = this.props.text;
    }
    var anchor = <a href="#" value={value}
                             className={classes}
                             title={this.props.uri}
                             onClick={this.props.onClicked}>{text}{link}{badge}</a>;


    return (
        <li role="presentation" style={this.props.style}>
          {anchor}
        </li>
    );
  },

});

module.exports = Pill;
