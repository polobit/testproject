define([
       "jquery" , "underscore" , "backbone"
       , "collections/snippets" , "collections/my-form-snippets"
       , "views/tab" , "views/my-form"
       , "text!data/input.json", "text!data/radio.json", "text!data/select.json", "text!data/buttons.json"
       , "text!templates/app/render.html"
], function(
  $, _, Backbone
  , SnippetsCollection, MyFormSnippetsCollection
  , TabView, MyFormView
  , inputJSON, radioJSON, selectJSON, buttonsJSON
  , renderTab, aboutTab
){
  return {
    initialize: function(){
    	var fields;
    	getAgileFields(fields, function(fields){
    		addAgileFields([inputJSON, radioJSON, selectJSON], fields, function(json){
    			
    		      //Bootstrap tabs from json.
    		      new TabView({
    		        title: "Input"
    		        , collection: new SnippetsCollection(json[0])
    		      });
    		      new TabView({
    		        title: "Radios / Checkboxes"
    		        , collection: new SnippetsCollection(json[1])
    		      });
    		      new TabView({
    		        title: "Select"
    		        , collection: new SnippetsCollection(json[2])
    		      });
    		      new TabView({
    		        title: "Buttons"
    		        , collection: new SnippetsCollection(JSON.parse(buttonsJSON))
    		      });
    		      new TabView({
    		        title: "<b>Source code</b>"
    		        , content: renderTab
    		      });

    		      //Make the first tab active!
    		      $("#components .tab-pane").first().addClass("active");
    		      $("#formtabs li").first().addClass("active");

    		      $('#toggle_bs_style').on('click', function(e) {
    		        e.preventDefault();
    		        if ($('#bootstrap-classic-theme').attr('href') == '') {
    		          $('#bootstrap-classic-theme').attr('href', 'assets/css/lib/bootstrap-3.0.0/dist/css/bootstrap-theme.min.css');
    		        } else {
    		          $('#bootstrap-classic-theme').attr('href', '');
    		        }

    		      });

    		      // Bootstrap "My Form" with 'Form Name' snippet.
    		      new MyFormView({
    		        title: "Original"
    		        , collection: new MyFormSnippetsCollection([
    		          { "title" : "Form Name"
    		            , "fields": {
    		              "name" : {
    		                "label"   : "Form Name"
    		                , "type"  : "input"
    		                , "value" : "Form Name"
    		              }
    		            }
    		          }
    		        ])
    		      });
    		});
    	});
    }
  }
});
