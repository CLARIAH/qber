var React = require('react');
var ReactPropTypes = React.PropTypes;


var SDMXDimensionForm = React.createClass({

  // This React class only works if a list of 'dimensions' is passed through its properties.
  propTypes: {
    dimension: ReactPropTypes.object.isRequired,
    variable: ReactPropTypes.string.isRequired,
    doUpdate: ReactPropTypes.object.isRequired,
    doSelectDimension: ReactPropTypes.object.isRequired,
    doBuildDimension: ReactPropTypes.object.isRequired
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
    // This section should be shown by default
    // and shown when we do have variables in our dataset
    // if (this.props.dimension === undefined) {
    //   return null;
    // }

    var caret;
    if (this.state.visible){
      caret = <span className="small glyphicon glyphicon-chevron-up"></span>;
    } else {
      caret = <span className="small glyphicon glyphicon-chevron-down"></span>;
    }


    var form;
    if (this.state.visible) {
      var label;
      var description;
      var uri;
      if (this.props.dimension !== undefined){
        label = this.props.dimension.label ? this.props.dimension.label : '';
        description = this.props.dimension.description ? this.props.dimension.description : '';
        uri = this.props.dimension.uri;
      } else {
        label = this.props.variable;
        description = '';
        uri = '';
      }


      form =  <form className="form-horizontal">
                <div className="form-group">
                  <label for="inputURI" className="col-sm-1 control-label">URI</label>
                  <div className="col-sm-11">
                    <div className="input-group">
                      <input type="text"
                             className="form-control"
                             id="inputURI"
                             placeholder="URI"
                             value={uri}
                             readOnly></input>
                      <span className="input-group-btn">
                        <button className="btn btn-primary"
                              onClick={this.props.doSelectDimension}>Select</button>
                      </span>
                      <span className="input-group-btn">
                        <span className="btn btn-default"
                              onClick={this.props.doBuildDimension}>Build</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label for="inputName" className="col-sm-1 control-label">Name</label>
                  <div className="col-sm-11">
                    <input type="text"
                           className="form-control"
                           id="inputName"
                           placeholder="Name"
                           value={label}
                           onChange={this._onLabelChange}></input>
                  </div>
                </div>
                <div className="form-group">
                  <label for="inputDescription" className="col-sm-1 control-label">Description</label>
                  <div className="col-sm-11">
                    <textarea type="text"
                              className="form-control"
                              id="inputDescription"
                              placeholder="Description"
                              value={description}
                              onChange={this._onDescriptionChange}></textarea>
                  </div>
                </div>
              </form>;
    }

    return (
      <section id="dimension_form">
        <h4 onClick={this._onToggle} aria-expanded={this.state.visible}>Metadata {caret}</h4>
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
