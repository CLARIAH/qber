module.exports = {
  retrieveDataset: function(settings) {
    $.get('/metadata',{'file': settings.filename}, function(dataset){
      console.log(dataset);
      settings.success(dataset);
    }).fail(function(){
      settings.error(settings.filename);
    });
  },

  retrieveDimension: function(settings) {
    $.get('/variable/resolve', {'uri': settings.dimension}, function(dimension_details){
      console.log("QBerAPI retrieveDimension");
      console.log(dimension_details);
      if(dimension_details == 'error'){
        settings.error(settings.dimension);
      } else {
        settings.success(dimension_details);
      }
    }).fail(function(){
      settings.error(settings.dimension);
    });
  },

  retrieveCodes: function(settings) {
    $.get('/codelist/concepts', {'uri': settings.codelist_uri}, function(codes){
      console.log("QBerAPI retrieveCodes");
      console.log(codes);
      if(codes.response && codes.response == 'error'){
        settings.error(settings.codelist_uri);
      } else {
        settings.success(codes.codelist);
      }
    }).fail(function(){
      settings.error(settings.codelist_uri);
    });
  },

  retrieveFileList: function(settings) {
    $.get('/browse', {'path': settings.path}, function(data){
      console.log("QBerAPI retrieveFileList");
      console.log(data);
      if(data.response == 'error'){
        settings.error(settings.path);
      } else {
        settings.success(data);
      }
    }).fail(function(){
      settings.error(settings.path);
    });
  },

  retrieveIRI: function(settings) {
    $.get('/iri', {'iri': settings.iri}, function(data){
      console.log("QBerAPI retrieveIRI");
      console.log(data);
      if(data.response == 'error'){
        settings.error(settings.iri);
      } else {
        settings.success(data.response);
      }
    }).fail(function(){
      settings.error(settings.iri);
    });
  }
};
