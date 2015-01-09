function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}



$( document ).ready(function() {
  console.log("Document loaded");
  
  $('.variable-panel').hide();
  
  $(".variable-menu-item").on('click',function(){
    var variable_panel = $($(this).attr('target'));
    $('.variable-panel').hide();
    initialize(variable_panel);
    variable_panel.show();
  });

  $(".regex").on('keyup', function(){
    
    var example = $($(this).attr('example')).val();
    var matches_div_id = $(this).attr('matches');
    
    try {
      var regex = XRegExp($(this).val(),'gi');
      
      parts = XRegExp.exec(example, regex)
      console.log(parts)
      $(matches_div_id).empty();
      
      if (parts != null ){ 
        var re = /\d+/; 
        var match = $('<table>');
        match.addClass('table');
        match.addClass('table-striped');
        for (p in parts){
          if (re.exec(p) == null && p != 'index' && p != 'input'){
            match.append('<tr><th>' + p + '</th><td>' + parts[p] + '</td></tr>');
          }
        }
        $(matches_div_id).append(match);
      } else {
        console.log("No matches");
        $(matches_div_id).text("No matches");
      }
    } catch (err) {
      $(matches_div_id).text("Invalid regular expression...");
    }
    
    
    
  });

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




  
  
});

function initialize(variable_panel) {
  var initialized = variable_panel.attr('initialized');
  
  if (!initialized) {
    var uri_field = variable_panel.attr('uri_field');
    var skos_field = variable_panel.attr('skos_field');
  
    variable_panel.children(".list-group-item-text").show();
  
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
    variable_panel.attr('initialized',true);
    
  }
  
  
}

