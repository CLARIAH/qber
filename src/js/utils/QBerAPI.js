
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
    }).fail(function(response){
      settings.error(response);
    });
  },

  retrieveDimension: function(settings) {
    $.get(CSDH_API + '/community/definition', {'uri': settings.dimension}, function(response){
      console.log("QBerAPI retrieveDimension");
      console.log(response);
      settings.success(response);
    }).fail(function(response){
      settings.error(response);
    });
  },

  retrieveConcepts: function(settings) {
    $.get(CSDH_API + '/community/concepts', {'uri': settings.scheme_uri}, function(response){
      console.log("QBerAPI retrieveConcepts");
      settings.success(response);
    }).fail(function(response){
      settings.error(response);
    });
  },

  retrieveFileList: function(settings) {
    $.get(CSDH_API + '/browse', {'path': settings.path}, function(response){
      console.log("QBerAPI retrieveFileList");
      console.log(response);
      settings.success(response);
    }).fail(function(response){
      settings.error(response);
    });
  },

  retrieveIRI: function(settings) {
    $.get(CSDH_API + '/iri', {'iri': settings.iri}, function(response){
      console.log("QBerAPI retrieveIRI");
      console.log(response);
      settings.success(response);
    }).fail(function(response){
      settings.error(response);
    });
  }
};
