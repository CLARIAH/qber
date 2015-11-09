
var CSDH_API = "http://localhost:5000"


module.exports = {
  retrieveDatasetDefinition: function(settings) {
    $.get(CSDH_API + '/dataset/definition',{'file': settings.filename}, function(response){
      console.log(response);
      settings.success(response);
    }).fail(function(){
      settings.error(response);
    });
  },

  retrieveCommunityDimensions: function(settings) {
    $.get(CSDH_API + '/community/dimensions', function(response){
      console.log(response);
      settings.success(response);
    }).fail(function(){
      settings.error(response);
    });
  },

  retrieveCommunitySchemes: function(settings) {
    $.get(CSDH_API + '/community/schemes', function(response){
      console.log(response);
      settings.success(response);
    }).fail(function(){
      settings.error(response);
    });
  },

  saveDataset: function(settings) {
    $.post(CSDH_API + '/dataset/save',data=JSON.stringify({'dataset': settings.dataset}), function(response){
      console.log(response);
      settings.success(response);
    }).fail(function(){
      settings.error(response);
    });
  },

  retrieveDimension: function(settings) {
    $.get(CSDH_API + '/community/definition', {'uri': settings.dimension}, function(dimension_details){
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
    $.get(CSDH_API + '/community/concepts', {'uri': settings.codelist_uri}, function(codes){
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
    $.get(CSDH_API + '/browse', {'path': settings.path}, function(data){
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
    $.get(CSDH_API + '/iri', {'iri': settings.iri}, function(data){
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
