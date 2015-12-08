
var CSDH_API = "http://localhost:5000"


module.exports = {
  retrieveDatasetDefinition: function(settings) {
    $.get(CSDH_API + '/dataset/definition',{'name': settings.file_name, 'id': settings.file_id, 'type': settings.file_type}, function(response){
      console.log("Retrieved dataset definition");
      console.log(response);
      settings.success(response);
    }).fail(function(){
      settings.error(response);
    });
  },

  retrieveCommunityDimensions: function(settings) {
    $.get(CSDH_API + '/community/dimensions', function(response){

      settings.success(response);
    }).fail(function(){
      settings.error(response);
    });
  },

  retrieveCommunitySchemes: function(settings) {
    $.get(CSDH_API + '/community/schemes', function(response){

      settings.success(response);
    }).fail(function(){
      settings.error(response);
    });
  },

  saveDataset: function(settings) {
    $.post(CSDH_API + '/dataset/save',data=JSON.stringify({'dataset': settings.dataset}), function(response){

      settings.success(response);
    }).fail(function(response){
      settings.error(response);
    });
  },

  submitDataset: function(settings) {
    console.log("Submitting dataset to CSDH");
    console.log(settings.dataset);
    console.log(settings.user);
    $.post(CSDH_API + '/dataset/submit',data=JSON.stringify({'dataset': settings.dataset, 'user': settings.user}), function(response){
      settings.success(response);
    }).fail(function(response){
      settings.error(response);
    });
  },

  retrieveDimension: function(settings) {
    $.get(CSDH_API + '/community/definition', {'uri': settings.dimension}, function(response){


      settings.success(response);
    }).fail(function(response){
      settings.error(response);
    });
  },

  retrieveConcepts: function(settings) {
    $.get(CSDH_API + '/community/concepts', {'uri': settings.scheme_uri}, function(response){

      settings.success(response);
    }).fail(function(response){
      settings.error(response);
    });
  },

  retrieveFileList: function(settings) {
    $.get(CSDH_API + '/browse', {'path': settings.path}, function(response){


      settings.success(response);
    }).fail(function(response){
      settings.error(response);
    });
  },

  retrieveStudy: function(settings) {
    $.get(CSDH_API + '/dataverse/dataset', {'handle': settings.handle}, function(response){
      settings.success(response);
    }).fail(function(response){
      settings.error(response);
    });
  },

  retrieveIRI: function(settings) {
    $.get(CSDH_API + '/iri', {'iri': settings.iri}, function(response){


      settings.success(response);
    }).fail(function(response){
      settings.error(response);
    });
  }
};
