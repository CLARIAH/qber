var React = require('react');
var ReactPropTypes = React.PropTypes;
var QBerModal = require('./QBerModal.react');
var Caret = require('./Caret.react');

var DimensionMetadata = React.createClass({

  // This React class only works if a list of 'dimensions' is passed through its properties.
  propTypes: {
    dimension: ReactPropTypes.object.isRequired,
    variable: ReactPropTypes.string.isRequired,
    doUpdate: ReactPropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      'visible': true,
      'modal_visible': false
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

    var form;
    if (this.state.visible) {
      var label;
      var description;
      var uri;
      var codelist_uri
      if (this.props.dimension !== undefined){
        label = this.props.dimension.label ? this.props.dimension.label : '';
        description = this.props.dimension.description ? this.props.dimension.description : '';
        uri = this.props.dimension.uri;
      } else {
        label = this.props.variable;
        description = '';
        uri = '';
      }

      // The variable that will hold the JSX for the codelist, if present.
      var codelist_row;
      if (this.props.dimension && this.props.dimension.codelist){
        codelist_row =  <div className="form-group">
                          <label for="inputCodelist" className="col-sm-2 control-label">Code list</label>
                          <div className="col-sm-8">
                            <input type="text"
                                   className="form-control"
                                   key={"codelist"+this.props.variable}
                                   id="inputCodelist"
                                   placeholder="Codelist"
                                   value={this.props.dimension.codelist.uri}
                                   readOnly>
                              </input>
                          </div>
                          <div className="col-sm-2">
                            <input type="button"
                                   className="form-control btn btn-default"
                                   id="inputCommunityCodeList"
                                   value="Community"
                                   onClick={this._onShowCodeLists}></input>
                          </div>
                        </div>;
      }



      form =  <form className="form-horizontal">
                <div className="form-group">
                  <label for="inputURI" className="col-sm-2 control-label">URI</label>
                  <div className="col-sm-10">
                      <input type="text"
                             className="form-control"
                             id="inputURI"
                             placeholder="URI"
                             value={uri}
                             readOnly></input>
                  </div>
                </div>
                {codelist_row}
                <div className="form-group">
                  <label for="inputName" className="col-sm-2 control-label">Name</label>
                  <div className="col-sm-10">
                    <input type="text"
                           className="form-control"
                           key={"name"+this.props.variable}
                           id="inputName"
                           placeholder="Name"
                           value={label}
                           onChange={this._onLabelChange}></input>
                  </div>
                </div>
                <div className="form-group">
                  <label for="inputDescription" className="col-sm-2 control-label">Description</label>
                  <div className="col-sm-10">
                    <textarea type="text"
                              className="form-control"
                              key={"desc"+this.props.variable}
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
        <div className="panel panel-default">
          <div className="panel-heading">
            <h5 className="panel-title" onClick={this._onToggle} aria-expanded={this.state.visible}>
              Metadata
              <Caret visible={this.state.visible}/>
            </h5>
          </div>
          <div className={this.state.visible ? 'panel-body' : 'panel-body hidden'} >
              {form}
          </div>
        </div>
        <QBerModal  visible={this.state.modal_visible}
                    title="Select a community provided codelist"
                    value={this.props.variable}
                    selection={this.state.dimension !== undefined ? this.state.dimension.uri: undefined}
                    options={this.props.codelists}
                    doSelect={this._handleSelected}
                    doClose={this._handleHideDimensions} />
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
  },

  _onShowCodeLists: function(e){
    var new_state = this.state;
    new_state.modal_visible = true;
    this.setState(new_state);
  }

});

module.exports = DimensionMetadata;
