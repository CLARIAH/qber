module.exports = {
  retrieveDataset: function(settings) {
    $.get('/metadata',{'file': settings.filename}, function(dataset){
      console.log(dataset);
      settings.success(dataset);
    }).fail(function(){
      settings.error(filename);
    });
  },

  retrieveDimension: function(settings) {
    $.get('/variable/resolve', {'uri': settings.dimension}, function(dimension_definition){
      if(dimension_definition == 'error'){
        settings.error(dimension);
      } else {
        settings.success(dimension_definition);
      }
    }).fail(function(){
      settings.error(dimension);
    });
  }
};
