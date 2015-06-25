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
    $.get('/variable/resolve', {'uri': settings.dimension}, function(dimension_definition){
      if(dimension_definition == 'error'){
        settings.error(settings.dimension);
      } else {
        settings.success(settings.dimension_definition);
      }
    }).fail(function(){
      settings.error(settings.dimension);
    });
  }
};
