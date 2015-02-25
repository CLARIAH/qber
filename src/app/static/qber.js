function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

var variables, metadata, examples, dimensions, schemes;

$( document ).ready(function() {
  console.log("Document loaded");
  
  
  
  $('#variable-panel').hide();

  $.get('/metadata',function(data){
    variables = data['variables'];
    metadata = data['metadata'];
    examples = data['examples'];
    dimensions = data['dimensions'];
    schemes = data['schemes'];
    
    initialize_menu();
    
    
  });
  
});


function initialize_menu(){
  
  $.post('/menu',data=JSON.stringify({'items': metadata}), function(data){
    $('#menu').html(data);
    
    $('#variable-menu').selectize({
        create: true,
        sortField: 'text'
    });
    
    $("#variable-menu").on('change',function(){
      var variable_id = $(this).val();

      initialize_variable_panel(variable_id);
    });
    
    $("#submit").on('click',function(e){
      keys = $.localStorage.keys();
      
      data = {'variables': {}}
      
      for (n in keys) {
        data['variables'][keys[n]] = $.localStorage.get(keys[n]);
      };
      
      $.post('/save',data=JSON.stringify(data),function(data){
        console.log(data);
      });
    });
    
    $("#reset").on('click',function(e){
      alert("Emptied the local storage... you'll need to start all over again.")
      $.localStorage.removeAll();
    });
    
  });
}


function initialize_variable_panel(variable_id){

  $.post('/variable',data=JSON.stringify({'id': variable_id, 'description': metadata[variable_id], 'examples': examples[variable_id]}), function(data){

    $('#variable-panel').hide();
    $('#variable-panel').html(data);
    
    var variable_panel = $('#var_'+variable_id);
    
    fill_selects(variable_id, variable_panel);
    
    $('#variable-panel').show();
    
  });
  
  
};


function fill_selects(variable_id, variable_panel){
  var uri_field = variable_panel.attr('uri_field');
  var skos_field = variable_panel.attr('skos_field');
  var save_button = variable_panel.attr('save_button');
  var form = variable_panel.attr('form');



  variable_panel.children(".list-group-item-text").show();
  
  $(save_button).on('click',function(){
    var form = $(this).attr('form');
    console.log(form);
    var variable_id = $(this).attr('target');
    
    console.log($(form));
    var data = $(form).toObject();
    
    $.localStorage.set(variable_id,data);
    
    console.log(data);
  });

  // The drop down menu for external dimensions.
  $(uri_field).selectize({
    maxItems: 1,
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
  
  
  $(uri_field).on('change', function(){
    var dimension_uri = $(uri_field).val();
    $.get('/dimension',data={'uri': dimension_uri}, function(data){
      console.log(data);
    });
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


  $(".regex").on('keyup', function(){
    var example_input = $($(this).attr('example'));
    
    example_input.on('keyup',function(){
      $(".regex").keyup();
    });
    
    var example = example_input.val();
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
  
  var data = $.localStorage.get(variable_id);
  
  if (data) {
    js2form($('form'), data);
    
    $('.data').each(function(){
      var field = $(this).attr('name'); 
    
      if (field in data){
        var value = data[field];
      
        if($(this).hasClass('selectized')){
          $(this)[0].selectize.setValue(value);
        } else {
          if(value == 'on') {
            $(this).prop('checked',true);
          } else {
            $(this).val(value);
          }
        }
      }
    });
    
    $(".regex").keyup();
  }
  
}



