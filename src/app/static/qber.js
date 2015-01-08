function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}



$( document ).ready(function() {
  console.log("Document loaded");

  $(".dimension-type-select").selectize({
    valueField: 'uri',
    searchField: 'label',
    options: [
      {
        'label': 'Dimension',
        'uri': 'http://purl.org/linked-data/cube#DimensionProperty',
        'description': 'Dimension properties are used to identify an observation'
      },
      {
        'label': 'Measure',
        'uri': 'http://purl.org/linked-data/cube#MeasureProperty',
        'description': 'The measure is the observed value'
      },
      {
        'label': 'Attribute',
        'uri': 'http://purl.org/linked-data/cube#AttributeProperty',
        'description': 'Attributes provide additional information, such as units of measures, etc.'
      },
    ],
    render: {
      option: function(data, escape) {
        return '<div class="option">' +
            '<span class="title">' + escape(data.label) + '</span> ' +
            '<span class="description small">' + escape(data.description) + '</span>' +
          '</div>';
      },
      item: function(data, escape) {
        return '<div class="item"><a href="' + escape(data.uri) + '">' + escape(data.label) + '</a></div>';
      }
    },
    create: false
  
  });


  $(".variable").on('click', function(){
    var initialized = $(this).attr('initialized');
    
    if (!initialized) {
      var uri_field = $(this).attr('uri_field');
      var skos_field = $(this).attr('skos_field');
    
      $(this).children(".list-group-item-text").show();
    
      $(uri_field).selectize({
        maxItems: null,
        valueField: 'uri',
        searchField: 'label',
        options: dimensions,
        render: {
          option: function(data, escape) {
            return '<div class="option">' +
                '<span class="title">' + escape(data.label) + ' <span class="badge">'+ escape(data.refs) +'</span></span> ' +
                '<span class="uri small">' + escape(data.uri) + '</span>' +
              '</div>';
          },
          item: function(data, escape) {
            return '<div class="item"><a href="' + escape(data.uri) + '">' + escape(data.label) + '</a></div>';
          }
        },
        create: function(input){
          return {
            'label': input,
            'uri': 'http://sdh.clariah.org/vocab/dimension/'+input
          }
        
        }
      });
      
      $(skos_field).selectize({
        maxItems: null,
        valueField: 'uri',
        searchField: 'label',
        options: schemes,
        render: {
          option: function(data, escape) {
            return '<div class="option">' +
                '<span class="title">' + escape(data.label) + ' </span> ' +
                '<span class="uri small">' + escape(data.uri) + '</span>' +
              '</div>';
          },
          item: function(data, escape) {
            return '<div class="item"><a href="' + escape(data.uri) + '">' + escape(data.label) + '</a></div>';
          }
        },
        create: function(input){
          return {
            'label': input,
            'uri': 'http://sdh.clariah.org/vocab/scheme/'+input
          }
        
        }
      });
    
    } else {
      $(this).attr('initialized',true);
      
    }
    
    
  });

  
  
});

