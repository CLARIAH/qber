var React = require('react');
var ReactPropTypes = React.PropTypes;
var QBerModal = require('./QBerModal.react');
var Caret = require('./Caret.react');
var _ = require('lodash');



var xml_schema_datatypes = [
  { value: 'http://www.w3.org/2001/XMLSchema#decimal', label: 'xsd:decimal' },
  { value: 'http://www.w3.org/2001/XMLSchema#float', label: 'xsd:float' },
  { value: 'http://www.w3.org/2001/XMLSchema#double', label: 'xsd:double' },
  { value: 'http://www.w3.org/2001/XMLSchema#integer', label: 'xsd:integer' },
  { value: 'http://www.w3.org/2001/XMLSchema#positiveInteger', label: 'xsd:positiveInteger' },
  { value: 'http://www.w3.org/2001/XMLSchema#negativeInteger', label: 'xsd:negativeInteger' },
  { value: 'http://www.w3.org/2001/XMLSchema#nonPositiveInteger', label: 'xsd:nonPositiveInteger' },
  { value: 'http://www.w3.org/2001/XMLSchema#nonNegativeInteger', label: 'xsd:nonNegativeInteger' },
  { value: 'http://www.w3.org/2001/XMLSchema#long', label: 'xsd:long' },
  { value: 'http://www.w3.org/2001/XMLSchema#int', label: 'xsd:int' },
  { value: 'http://www.w3.org/2001/XMLSchema#short', label: 'xsd:short' },
  { value: 'http://www.w3.org/2001/XMLSchema#byte', label: 'xsd:byte' },
  { value: 'http://www.w3.org/2001/XMLSchema#unsignedLong', label: 'xsd:unsignedLong' },
  { value: 'http://www.w3.org/2001/XMLSchema#unsignedInt', label: 'xsd:unsignedInt' },
  { value: 'http://www.w3.org/2001/XMLSchema#unsignedShort', label: 'xsd:unsignedShort' },
  { value: 'http://www.w3.org/2001/XMLSchema#unsignedByte', label: 'xsd:unsignedByte' },
  { value: 'http://www.w3.org/2001/XMLSchema#dateTime', label: 'xsd:dateTime' },
  { value: 'http://www.w3.org/2001/XMLSchema#date', label: 'xsd:date' },
  { value: 'http://www.w3.org/2001/XMLSchema#gYearMonth', label: 'xsd:gYearMonth' },
  { value: 'http://www.w3.org/2001/XMLSchema#gYear', label: 'xsd:gYear' },
  { value: 'http://www.w3.org/2001/XMLSchema#duration', label: 'xsd:duration' },
  { value: 'http://www.w3.org/2001/XMLSchema#gMonthDay', label: 'xsd:gMonthDay' },
  { value: 'http://www.w3.org/2001/XMLSchema#gDay', label: 'xsd:gDay' },
  { value: 'http://www.w3.org/2001/XMLSchema#gMonth', label: 'xsd:gMonth' },
  { value: 'http://www.w3.org/2001/XMLSchema#string', label: 'xsd:string' },
  { value: 'http://www.w3.org/2001/XMLSchema#normalizedString', label: 'xsd:normalizedString' },
  { value: 'http://www.w3.org/2001/XMLSchema#token', label: 'xsd:token' },
  { value: 'http://www.w3.org/2001/XMLSchema#language', label: 'xsd:language' },
  { value: 'http://www.w3.org/2001/XMLSchema#NMTOKEN', label: 'xsd:NMTOKEN' },
  { value: 'http://www.w3.org/2001/XMLSchema#NMTOKENS', label: 'xsd:NMTOKENS' },
  { value: 'http://www.w3.org/2001/XMLSchema#Name', label: 'xsd:Name' },
  { value: 'http://www.w3.org/2001/XMLSchema#NCName', label: 'xsd:NCName' },
  { value: 'http://www.w3.org/2001/XMLSchema#ID', label: 'xsd:ID' },
  { value: 'http://www.w3.org/2001/XMLSchema#IDREFS', label: 'xsd:IDREFS' },
  { value: 'http://www.w3.org/2001/XMLSchema#ENTITY', label: 'xsd:ENTITY' },
  { value: 'http://www.w3.org/2001/XMLSchema#ENTITIES', label: 'xsd:ENTITIES' },
  { value: 'http://www.w3.org/2001/XMLSchema#QName', label: 'xsd:QName' },
  { value: 'http://www.w3.org/2001/XMLSchema#boolean', label: 'xsd:boolean' },
  { value: 'http://www.w3.org/2001/XMLSchema#hexBinary', label: 'xsd:hexBinary' },
  { value: 'http://www.w3.org/2001/XMLSchema#base64Binary', label: 'xsd:base64Binary' },
  { value: 'http://www.w3.org/2001/XMLSchema#anyURI', label: 'xsd:anyURI' },
  { value: 'http://www.w3.org/2001/XMLSchema#notation', label: 'xsd:notation' }
];


var DimensionMetadata = React.createClass({

  // This React class only works if a list of 'dimensions' is passed through its properties.
  propTypes: {
    variable: ReactPropTypes.object.isRequired,
    schemes: ReactPropTypes.array.isRequired,
    doUpdate: ReactPropTypes.func.isRequired,
    doSchemeUpdate: ReactPropTypes.func.isRequired,
    doApplyTransform: ReactPropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      'visible': true,
      'modal_visible': false,
      'transform_function': 'return v ;'
    };
  },

  /**
   * @return {object}
   */
  render: function() {
    // This section should be shown by default
    // and shown when we do have variables in our dataset
    // if (this.props.variable === undefined) {
    //   return null;
    // }

    var form;


    if (this.state.visible) {
      var label;
      var description;
      var uri;
      var codelist_uri
      if (this.props.variable.label !== undefined){
        label = this.props.variable.label ? this.props.variable.label : '';
        description = this.props.variable.description ? this.props.variable.description : '';
        uri = this.props.variable.uri;
      } else {
        label = this.props.variable.label;
        description = '';
        uri = '';
      }

      // The variable that will hold the JSX for the codelist, if present.
      var codelist_row;
      // The variable that will hold the transformation function, if present.
      var transform_row;
      if (this.props.variable.category == 'coded'){
        codelist_row =  <div className="form-group">
                          <label for="inputCodelist" className="col-sm-2 control-label">Code list</label>
                          <div className="col-sm-8">
                            <input type="text"
                                   className="form-control"
                                   key={"codelist"+this.props.variable.label}
                                   id="inputCodelist"
                                   placeholder="Codelist"
                                   value={this.props.variable.codelist.uri}
                                   readOnly>
                              </input>
                          </div>
                          <div className="col-sm-2">
                            <input type="button"
                                   className="form-control btn btn-default"
                                   id="inputCommunityCodeList"
                                   value="Find"
                                   onClick={this._handleShowSchemes}></input>
                          </div>
                        </div>;
      } else if(this.props.variable.category == 'other'){

        var prefix = "function transform(v){";
        var postfix = "}";
        transform_row = <div className="form-group">
                          <label for="inputTransform" className="col-sm-2 control-label">Transform</label>
                          <div className="col-sm-8">
                            {prefix}
                            <input type="text"
                                   className="form-control"
                                   key={"transform"+this.props.variable.label}
                                   id="inputTransform"
                                   placeholder="Transform function"
                                   value={this.state.transform_function}
                                   onChange={this._handleTransformUpdate}>
                              </input>
                              {postfix}
                          </div>
                          <div className="col-sm-2">
                            <input type="button"
                                   className="form-control btn btn-default"
                                   id="inputTransformButton"
                                   value="Apply"
                                   onClick={this._handleApplyTransformFunction}></input>
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
                           key={"name"+this.props.variable.label}
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
                              key={"desc"+this.props.variable.label}
                              id="inputDescription"
                              placeholder="Description"
                              value={description}
                              onChange={this._onDescriptionChange}></textarea>
                  </div>
                </div>
                {transform_row}
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
                    value={this.props.variable.label}
                    selection={this.props.variable.codelist.uri}
                    options={this.props.schemes}
                    doSelect={this._handleSelectScheme}
                    doClose={this._handleHideSchemes} />
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
    var new_dimension = this.props.variable;
    new_dimension.label = value;
    // Propagate the new dimension details upward
    this.props.doUpdate(new_dimension);
  },

  _onDescriptionChange: function(e){
    var value = e.target.value;
    var new_dimension = this.props.variable;
    new_dimension.description = value;
    // Propagate the new dimension details upward
    this.props.doUpdate(new_dimension);
  },

  _handleTransformUpdate: function(e){
    var func = e.target.value;
    var new_state = this.state;
    new_state.transform_function = func;
    this.setState(new_state);
  },

  _handleApplyTransformFunction: function(e){
    var func = this.state.transform_function;
    this.props.doApplyTransform(func);
  },

  _handleShowSchemes: function(e){
    var new_state = this.state;
    new_state.modal_visible = true;
    this.setState(new_state);
  },

  _handleHideSchemes: function(e){
    var new_state = this.state;
    new_state.modal_visible = false;
    this.setState(new_state);
  },

  _handleSelectScheme: function(scheme_uri){
    this._handleHideSchemes();
    console.log("Scheme URI: "+scheme_uri);
    var scheme = _.find(this.props.schemes, {'uri': scheme_uri});
    console.log(scheme)
    this.props.doSchemeUpdate(scheme);
  }

});

module.exports = DimensionMetadata;
