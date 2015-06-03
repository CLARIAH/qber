function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

(function ($) {
      $.each(['show', 'hide'], function (i, ev) {
        var el = $.fn[ev];
        $.fn[ev] = function () {
          this.trigger(ev);
          return el.apply(this, arguments);
        };
      });
    })(jQuery);



// Global variables
var variables, metadata, examples, dimensions, schemes, variable;


// Once the document is loaded
$( document ).ready(function() {

  // Hide the signout button
  $('#signout').hide();

  // Hide the load button
  $('#load-menu').hide();

  // Hide the variable panel
  $('#variable-panel').hide();

  // Click handler for the file opening dialog
  $('#open-dataset-modal').on('show', function(){
    // Start the file browser with the current directory as the starting path.
    browse('#browser','.');
  });
});




// Store the Google user profile in a global variable
var profile;

// This is called when the g-signin2 button is clicked
function on_sign_in(googleUser) {
  profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId());
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());

  var img = $('<img></img>');
  img.attr('src',profile.getImageUrl());
  img.attr('height','20px');
  $('#profile-image').append(img);
  $('#profile-name').html(profile.getName());

  $('#load-menu').show();
  $('#signout').show();
  $('.g-signin2').hide();
}

// This is called when the #signout button is clicked
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
  $('#signout').hide();
  $('#profile-image').empty();
  $('#profile-name').empty();
  $('.g-signin2').show();
}


function load_dataset(file){
  console.log('Loading '+ file);

  $.get('/metadata',data={'file':file}, function(data){
    console.log(data);
    variables = data['variables'];
    metadata = data['metadata'];
    examples = data['examples'];
    dimensions = data['dimensions'];
    schemes = data['schemes'];
    cache = data['cache'];

    for (variable in cache) {
      $.localStorage.set(variable,cache[variable]);
    };

    $.localStorage.set('file', data['file']);
    $.localStorage.set('path', data['path']);

    $('#dataset-name').text(data['file']);

    var close_button = $('<div class="btn btn-xs"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></div>');
    $('#dataset-name').append(close_button);

    close_button.on('click',function(){
      $('#dataset-name').empty();
      $('#menu').empty();
      $('#variable-panel').empty();
      $('#load-menu').show();

      $.localStorage.removeAll();

    });

    $('#load-menu').hide();
    initialize_menu();
  });
}


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
      console.log('Submitting to CSDH');
      keys = $.localStorage.keys();

      data = {'variables': {}}

      for (n in keys) {
        if (keys[n] != 'file' && keys[n] != 'path') {
          data['variables'][keys[n]] = $.localStorage.get(keys[n]);
        }
      };

      data['file'] = $.localStorage.get('file');
      data['path'] = $.localStorage.get('path');

      data['profile'] = {}

      data['profile']['id'] = profile.getId();
      data['profile']['name'] = profile.getName();
      data['profile']['image'] = profile.getImageUrl();
      data['profile']['email'] = profile.getEmail();

      console.log(data);

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
  if (variable_id == '') { return ;}

  var payload = JSON.stringify({'id': variable_id, 'description': metadata[variable_id], 'examples': examples[variable_id]})

  variable = variable_id;

  console.log('The stuff sent to the server to retrieve the variable UI');
  console.log(payload);

  $.post('/variable/ui',data=payload, function(data){

    $('#variable-panel').hide();
    $('#variable-panel').html(data);

    var variable_panel = $('#var_'+variable_id);

    // fill_selects uses the local storage to retrieve 'saved' information about the variable
    // to fill the select elements in the variable panel.
    fill_selects(variable_id, variable_panel);

    $('#variable-panel').show();

  });


};


// This function fills the select dropdowns on the left hand side of the variable panel.
function fill_selects(variable_id, variable_panel){

  // Get the variable-specific identifiers of the fields we need.
  var lod_variable_field = variable_panel.attr('lod_variable_field');
  var codelist_field = variable_panel.attr('codelist_field');
  var codelist_checkbox = variable_panel.attr('codelist_checkbox');
  var learn_codelist_checkbox = variable_panel.attr('learn_codelist_checkbox');

  var save_button = variable_panel.attr('save_button');
  var form = variable_panel.attr('form');



  // The drop down menu for external dimensions.
  $(lod_variable_field).selectize({
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





  $(codelist_field).selectize({
    maxItems: 1,
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



  $(".dimension-type-select").selectize({
    valueField: 'uri',
    searchField: 'label',
    options: [
      {
        'label': 'Dimension Variable',
        'uri': 'http://purl.org/linked-data/cube#DimensionProperty',
        'description': 'Dimension variables are used to identify an observed value (e.g. location, gender)'
      },
      {
        'label': 'Measure Variable',
        'uri': 'http://purl.org/linked-data/cube#MeasureProperty',
        'description': 'A measure variable reflects an observed value (e.g. population size)'
      },
      {
        'label': 'Attribute',
        'uri': 'http://purl.org/linked-data/cube#AttributeProperty',
        'description': 'Attributes provide additional information about an observed value (e.g. unit of measure, currency)'
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


  // Get the data for the selected variable from local storage.
  var data = $.localStorage.get(variable_id);

  if (data) {
    console.log(data);
    $('.data').each(function(){
      var field = $(this).attr('name');
      console.log('Field is '+field);

      if (field in data){
        var value = data[field];
        console.log('Populating '+field);
        console.log(value);

        if($(this).hasClass('selectized')){
          $(this)[0].selectize.setValue(value);
        } else {
          if(value == true) {
            $(this).prop('checked',true);
          } else {
            $(this).val(value);
          }
        }
      }
    });
  }

  // Initialize the event handlers.

  // Save the entered data to local storage
  $(save_button).on('click',function(){
    var data = {};

    // For each data element, get its value and store it
    $('.data').each(function(index, element){
      var element_id = $(element).prop('name');
      var value;

      if ($(element).prop('type') == 'checkbox'){
        console.log(element_id + ' is a checkbox');

        value = $(element).prop('checked');

      } else {
        console.log(element_id + ' is not a checkbox');

        value = $(element).val();
      }

      data[element_id] = value;

    });


    // Get values
    data['values'] = examples[variable_id];

    // For each mapping, store the mapping
    mappings = []
    $('.mapping.selectized').each(function(index, element){
      var code_id = $(element).prop('name');
      var value = $(element).val();

      mappings.push({'id': code_id, 'value': value});
    });

    data['mappings'] = mappings;

    // Set the data in local storage
    $.localStorage.set(variable_id,data);
    console.log(data);
  });

  // If we import an external dimension with a code list, add a select button for every row in the value examples table.
  // TODO: This is not efficient for many possible codes (e.g. HISCO for occupations in the Utrecht 1829 dataset)
  $(lod_variable_field).on('change', function(){
    var dimension_uri = $(lod_variable_field).val();
    console.log('Lod variable field changed, and set to '+ dimension_uri);
    console.log(this);
    var dimension_type = $('#'+$(this).attr('data-dimension-type'))[0].selectize;
    var skos_codelist_select = $('#'+$(this).attr('data-skos-codelist'))[0].selectize;

    dimension_type.enable();
    dimension_type.setValue('');
    skos_codelist_select.setValue('');
    skos_codelist_select.enable();

    $(learn_codelist_checkbox).removeAttr('disabled');
    $(learn_codelist_checkbox).attr('checked',true);

    // If an empty dimension uri is selected, we reset everything to the default
    if (dimension_uri == '') {
      console.log('Dimension uri empty');
      console.log(dimension_uri);
      dimension_type.enable();
      skos_codelist_select.enable();
      $(learn_codelist_checkbox).attr('checked',false);
      return;
    }

    $.get('/variable/resolve',data={'uri': dimension_uri}, function(data){
      console.log(data);
      // Set dimension select value to the type given by the dimension specification we pulled from the web
      if (data['type'] != ''){
        dimension_type.setValue(data['type']);
        dimension_type.disable();
      }

      // We remove existing code cells from the rows
      $('.valuerow .codecell').each(function(){
        $(this).remove();
      });



      // If the dimension specifies a code book/code list
      // we need to use that information to populate dropdowns in the the values pane, to allow for mappings.
      if (data['codelist']) {
        // Codelist

        // Make sure to check the appropriate checkboxes
        $(codelist_checkbox).attr('checked',true);
        $(codelist_checkbox).attr('disabled',true);
        $(learn_codelist_checkbox).attr('checked', true);
        $(learn_codelist_checkbox).attr('disabled',true);

        // Add the name of the codelist to the codelist_field
        add_codelist(skos_codelist_select, data['codelist'][0]['cl'], data['codelist'][0]['cl_label']);

        // Populate select dropdowns in list of values.
        // NOTE: No need as this is now done by the change handler on the codelist_field element
        // populate_value_selects(data['codelist']);

        // $('#mappingcol').show();

        console.log(data['codelist']);
      } else {
        // No codelist
        console.log('No codelist');

        $(codelist_checkbox).attr('checked',false);
        $(codelist_checkbox).removeAttr('disabled');
        skos_codelist_select.setValue('');

      }
    });
  });

  $(codelist_checkbox).on('change', function(){
    // We remove existing code cells from the rows
    $('.valuerow .codecell').each(function(){
      $(this).remove();
    });

    // We set the codelist_field to null
    $(codelist_field)[0].selectize.setValue('');
  });


  $(codelist_field).on('change', function(){
    var codelist_uri = $(codelist_field).val();
    console.log('#codelist_field changed, selected value: ' + codelist_uri);

    $.get('/codelist/concepts',data={'uri': codelist_uri}, function(data){
      // We remove existing code cells from the rows
      $('.valuerow .codecell').each(function(){
        $(this).remove();
      });

      // If the SKOS vocabulary actually specifies a codelist
      // we need to use that information to populate dropdowns in the the values pane, to allow for mappings.
      if (data['codelist']) {
        // Make sure to check the appropriate checkboxes
        $(codelist_checkbox).attr('checked',true);
        $(learn_codelist_checkbox).attr('checked', true);
        $(learn_codelist_checkbox).attr('disabled', true);

        // Populate select dropdowns in list of values.
        populate_value_selects(data['codelist']);

        $('#mappingcol').show();

        console.log(data['codelist']);
      } else {
        // No codelist
        console.log('No codelist');
      }

    });
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

  // Make sure the code list is used to create the select cells
  $(codelist_field).trigger('change');


}



function add_codelist(skos_codelist_select, codelist_uri, codelist_label){
  // Disable the selection of an external code list, as this is already provided by the dimension specification
  skos_codelist_select.disable();

  skos_codelist_select.addOption({'uri': codelist_uri, 'label': codelist_label });
  skos_codelist_select.addItem(codelist_uri);
}


function populate_value_selects(codelist){
  console.log(codelist)

  // Use the global variable 'variable' to retrieve the mappings
  var variable_data = $.localStorage.get(variable);

  var mappings = [];

  if (variable_data != null){
    mappings = variable_data['mappings']
  }

  // We populate each row with a new cell that contains the code list
  $('.valuerow').each(function(){
    var row = $(this);

    // Get the value of the code in this row
    var code_id = row.attr('value');

    var td = $('<td></td>');
    td.addClass('codecell');
    td.attr('style','min-width: 30%;');

    var show_select_button = $('<span>Select code</span>');
    show_select_button.addClass('btn');
    show_select_button.addClass('btn-xs');
    show_select_button.addClass('btn-default');

    show_select_button.on('click', function(e){
      show_select_button.hide();
      var select = $('<select></select>');
      select.prop('name',code_id);



      select.addClass('mapping');
      td.append(select);

      select.selectize({
        maxItems: 1,
        valueField: 'concept',
        labelField: 'label',
        searchField: 'label',
        options: codelist,
        create: false
      });

      for (n in mappings) {
        var mapping = mappings[n];
        console.log('Checking mapping');
        console.log(mapping);
        if (code_id == mapping['id']) {
          console.log('Setting mapping for  '+code_id+' to '+mapping['value']);
          select[0].selectize.setValue(mapping['value']);
        }
      }

    })

    td.append(show_select_button);
    row.append(td);
  });
}





function browse(browsepane, path) {
    console.log('Will browse relative path: '+ path)

    // Retrieve JSON list of files
    $.get('/browse', {
        path: path
    }, function(data) {
        var parent = data.parent;
        var files = data.files;

        // Clear the DIV containing the file browser.
        $(browsepane).empty();


        var heading = $('<h4></h4>');

        if (path.length < 50) {
            heading.append(path);
        } else {
            heading.append(path.substring(0, 10) + '...' + path.substring(path.length - 40));
        }


        $(browsepane).append(heading);


        var list = $('<div></div>');
        list.toggleClass('list-group');

        if (parent != '') {
            var up = $('<a class="list-group-item"><span class="glyphicon glyphicon-folder-open"></span><span style="padding-left: 1em;">..</span></a>');
            up.on("click", function(e) {
                browse(browsepane, parent);
            });

            $(list).append(up);
        }



        $.each(files, function(index, value) {
            console.log(value);

            var a = $('<a></a>');

            a.toggleClass('list-group-item');

            if (value.type == 'dir') {
                var icon = $('<span class="glyphicon glyphicon-folder-open"></span>');
                a.append(icon);
                a.append('<span style="padding-left: 1em;">' + value.name + '</span>');
                a.on('click', function(e) {
                    browse(browsepane, value.path);
                });
            } else {
                var icon = $('<span class="glyphicon glyphicon-file"></span>');
                a.append(icon);
                a.append('<span style="padding-left: 1em;">' + value.name + '</span>');

                var badge = $('<span></span>');
                badge.append(" (" + value.mimetype + ")");
                badge.toggleClass('badge');
                a.append(badge);

                a.on('click', function(e) {
                  $('#open-dataset-modal').toggle();
                  load_dataset(value.path);
                });
            }


            list.append(a);
        });


        $(browsepane).append(list);
    });
}
