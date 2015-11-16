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
    category: ReactPropTypes.string.isRequired
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
      console.log(this.props.category);
      var community_active = " btn btn-default form-control";
      var community = <a role="button"
                          className={community_active}
                          href="#"
                          onClick={this.props.doSelectDimension}>Community</a>;

      var coded_active = (this.props.category == 'coded') ? 'active': '';
      coded_active += " btn btn-primary form-control";
      var coded = <a role="button"
                      className={coded_active}
                      href="#" onClick={this.props.doBuildDimension}>Coded</a>;

      var identifier_active = (this.props.category == 'identifier') ? 'active': '';
      identifier_active += " btn btn-primary form-control";
      var identifier = <a role="button"
                           className={identifier_active}
                           href="#" onClick={this.props.doBuildIdentifier}>Identifier</a>;

      var other_active = (this.props.category == 'other') ? 'active': '';
      other_active += " btn btn-primary form-control";
      var other = <a role="button"
                      className={other_active}
                      href="#" onClick={this.props.doBuildOther}>Other</a>;

      options =  <form className="form-horizontal">
                  <div className="form-group">
                    <label for="inputCodelist" className="col-sm-2 control-label">Select a type</label>
                    <div className="col-sm-8">
                      <div className="btn-group btn-group-justified" role="group">
                        {coded}
                        {identifier}
                        {other}
                      </div>
                    </div>
                    <div className="col-sm-2">
                        {community}
                    </div>
                  </div>
                </form>;
    }

    console.log("Now returning code, including Caret");
    return (
      <section id="dimension_type_menu">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h5 className="panel-title" onClick={this._onToggle} aria-expanded={this.state.visible}>
              Variable Category
              <Caret visible={this.state.visible}/>
            </h5>
          </div>
          <div className={this.state.visible ? 'panel-body' : 'panel-body hidden'} >
              {options}
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
