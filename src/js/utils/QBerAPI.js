
var CSDH_API = "http://api.clariah-sdh.eculture.labs.vu.nl"


module.exports = {
  retrieveDatasetDefinition: function(settings) {
    $.get(CSDH_API + '/dataset/definition',{'path': settings.path}, function(response){
      console.log("Retrieved dataset definition from file");
      console.log(response);
      settings.success(response.dataset);
    }).fail(function(response){
      settings.error(response.responseJSON);
    });
  },

  retrieveDataverseDefinition: function(settings) {
    $.get(CSDH_API + '/dataverse/definition',{'name': settings.name, 'id': settings.id}, function(response){
      console.log("Retrieved dataset definition from dataverse");
      console.log(response);
      settings.success(response.dataset);
    }).fail(function(response){
      settings.error(response.responseJSON);
    });
  },

  retrieveCommunityDimensions: function(settings) {
    $.get(CSDH_API + '/community/dimensions', function(response){
      settings.success(response);
    }).fail(function(response){
      settings.error(response.responseJSON);
    });
  },

  retrieveCommunitySchemes: function(settings) {
    $.get(CSDH_API + '/community/schemes', function(response){
      settings.success(response);
    }).fail(function(response){
      settings.error(response.responseJSON);
    });
  },

  saveDataset: function(settings) {
    $.post(CSDH_API + '/dataset/save',data=JSON.stringify({'dataset': settings.dataset}), function(response){
      settings.success(response);
    }).fail(function(response){
      settings.error(response.responseJSON);
    });
  },

  submitDataset: function(settings) {
    console.log("Submitting dataset to CSDH");
    console.log(settings.dataset);
    console.log(settings.user);
    $.post(CSDH_API + '/dataset/submit',data=JSON.stringify({'dataset': settings.dataset, 'user': settings.user}), function(response){
      settings.success(response);
    }).fail(function(response){
      settings.error(response.responseJSON);
    });
  },

  retrieveDimension: function(settings) {
    $.get(CSDH_API + '/community/definition', {'uri': settings.dimension}, function(response){
      settings.success(response);
    }).fail(function(response){
      settings.error(response.responseJSON);
    });
  },

  retrieveConcepts: function(settings) {
    $.get(CSDH_API + '/community/concepts', {'uri': settings.scheme_uri}, function(response){
      settings.success(response);
    }).fail(function(response){
      settings.error(response.responseJSON);
    });
  },

  retrieveFileList: function(settings) {
    $.get(CSDH_API + '/browse', {'path': settings.path}, function(response){
      settings.success(response);
    }).fail(function(response){
      settings.error(response.responseJSON);
    });
  },

  retrieveStudy: function(settings) {
    $.get(CSDH_API + '/dataverse/dataset', {'handle': settings.handle}, function(response){
      settings.success(response);
    }).fail(function(response){
      console.log(response);
      settings.error(response.responseJSON);
    });
  },

  retrieveIRI: function(settings) {
    $.get(CSDH_API + '/iri', {'iri': settings.iri}, function(response){
      settings.success(response);
    }).fail(function(response){
      settings.error(response.responseJSON);
    });
  }
};
