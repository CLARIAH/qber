var React = require('react');
var ReactPropTypes = React.PropTypes;
var Caret = require('./Caret.react');


var DimensionType = React.createClass({

  // This React class only works if a list of 'dimensions' is passed through its properties.
  propTypes: {
    doSelectDimension: ReactPropTypes.object.isRequired,
    doBuildDimension: ReactPropTypes.object.isRequired,
    doBuildIdentifier: ReactPropTypes.object.isRequired,
    doBuildMeasurement: ReactPropTypes.object.isRequired,
    type: ReactPropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      'visible': true
    };
  },

  /**
   * @return {object}
   */
  render: function() {


    var options;
    if (this.state.visible) {
      console.log(this.props.type);
      var community_active = (this.props.type == 'community') ? 'active': '';
      var community = <li role="presentation"
                          className={community_active}>
                        <a href="#" onClick={this.props.doSelectDimension}>Community</a>
                      </li>;

      var coded_active = (this.props.type == 'coded') ? 'active': '';
      console.log(coded_active);
      var coded = <li role="presentation"
                      className={coded_active}>
                    <a href="#" onClick={this.props.doBuildDimension}>Coded</a>
                  </li>;

      var identifier_active = (this.props.type == 'identifier') ? 'active': '';
      var identifier = <li role="presentation"
                           className={identifier_active}>
                          <a href="#" onClick={this.props.doBuildIdentifier}>Identifier</a>
                        </li>;

      var other_active = (this.props.type == 'other') ? 'active': '';
      var other = <li role="presentation"
                      className={other_active}>
                    <a href="#" onClick={this.props.doBuildOther}>Other</a>
                  </li>;

      options = <ul className="nav nav-pills nav-justified">
                  {community}
                  {coded}
                  {identifier}
                  {other}
                </ul>;
    }

    console.log("Now returning code, including Caret");
    return (
      <section id="dimension_type_menu">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h5 className="panel-title" onClick={this._onToggle} aria-expanded={this.state.visible}>
              <span>Variable Type</span>
              <Caret visible={this.state.visible}/>
            </h5>
          </div>
          <div className={this.state.visible ? 'panel-body' : 'panel-body hidden'} >
              <div className="row">
                <div className="col-sm-1" style={{textAlign: 'right'}}>
                  <small>Select a type</small>
                </div>
                <div className="col-sm-11">
                  {options}
                </div>
              </div>
            </div>
        </div>
      </section>
    );
  },

  /**
   * Event handler for 'change' events coming from the MessageStore
   */
  _onToggle: function() {
    var new_state = this.state;
    new_state.visible = !this.state.visible;
    this.setState(new_state);
  },

});

module.exports = DimensionType;
