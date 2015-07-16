var React = require('react');
var ReactPropTypes = React.PropTypes;


var SDMXDimensionForm = React.createClass({

  // This React class only works if a list of 'dimensions' is passed through its properties.
  propTypes: {
    dimension: ReactPropTypes.object.isRequired,
    doUpdate: ReactPropTypes.object.isRequired
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
    // This section should be hidden by default
    // and shown when we do have variables in our dataset
    if (this.props.dimension === undefined) {
      return null;
    }
    console.log(this.props.dimension);

    var caret;
    if (this.state.visible){
      caret = <span className="small glyphicon glyphicon-chevron-up"></span>;
    } else {
      caret = <span className="small glyphicon glyphicon-chevron-down"></span>;
    }


    var form;
    if (this.state.visible) {
      form =  <form className="form-horizontal">
                <div className="form-group">
                  <label for="inputName" className="col-sm-1 control-label">Name</label>
                  <div className="col-sm-11">
                    <input type="text"
                           className="form-control"
                           id="inputName"
                           placeholder="Name"
                           value={this.props.dimension.label}
                           onChange={this._onLabelChange}></input>
                  </div>
                </div>
                <div className="form-group">
                  <label for="inputURI" className="col-sm-1 control-label">URI</label>
                  <div className="col-sm-11">
                    <input type="text"
                           className="form-control"
                           id="inputURI"
                           placeholder="URI"
                           value={this.props.dimension.uri}
                           readOnly></input>
                  </div>
                </div>
                <div className="form-group">
                  <label for="inputDescription" className="col-sm-1 control-label">Description</label>
                  <div className="col-sm-11">
                    <textarea type="text"
                              className="form-control"
                              id="inputDescription"
                              placeholder="Description"
                              value={this.props.dimension.description}
                              onChange={this._onDescriptionChange}></textarea>
                  </div>
                </div>
              </form>;
    }

    return (
      <section id="dimension_form">
        <h4 onClick={this._onToggle} aria-expanded={this.state.visible}>Dimension Metadata {caret}</h4>
        {form}
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

  _onLabelChange: function(e){
    var value = e.target.value;
    var new_dimension = this.props.dimension;
    new_dimension.label = value;
    // Propagate the new dimension details upward
    this.props.doUpdate(new_dimension);
  },

  _onDescriptionChange: function(e){
    var value = e.target.value;
    var new_dimension = this.props.dimension;
    new_dimension.description = value;
    // Propagate the new dimension details upward
    this.props.doUpdate(new_dimension);
  }

});

module.exports = SDMXDimensionForm;
