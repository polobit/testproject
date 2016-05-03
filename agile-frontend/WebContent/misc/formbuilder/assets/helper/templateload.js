define([
		'jquery', 'underscore', 'backbone', 'helper/pubsub', 'collections/my-form-snippets', 'views/my-form'], function($, _, Backbone, PubSub, MyFormSnippetsCollection, MyFormView)
{
	return { agile_template_load : function(api)
	{
		var url = window.location.protocol + '//' + window.location.host + '/' + 'misc/formbuilder/templates/' +formTemplate + '/index.json';
		console.log(url);

		$.ajax({
			url : url,
			type: 'GET',
			dataType: 'json',
			success: function(data){
				
				saveform = JSON.parse(data.formJson);
				console.log(saveform);
				saveform[0].fields.agiledomain.value = window.location.hostname.split('.')[0];
				saveform[0].fields.agileapi.value = api.api_key;
				console.log(saveform);
				
				//Loads form view in form.jsp page
				if($('#agileFormHolder').length != 0) {
					$('#form-label').text('Edit Form');
					new MyFormView({ title : "Original", collection : new MyFormSnippetsCollection(saveform) });
					var formHtml = $("#render").val();
			    	  if(formHtml != '') {
			    		  $('#agileFormHolder').html(formHtml);
			    		  // $('#agileFormHolder style').remove();

			    		  if(typeof data.formHtml == "undefined" || data.formHtml == "") {
			    		  	data.formHtml = formHtml;
			    		  	try{window.parent.updateAgileFormDB(data);}catch(err){}
			    		  }
			    	  }
				} else {
					$.getJSON( "/core/api/custom-fields", function(fields) {
					
					var count = 0;
					if(fields.length != 0)
					{ 
					for ( var i = 0; i < fields.length; i++)
						{
							var value = {};
							value.value = fields[i].field_label;
							value.label = fields[i].field_label;
							value.selected = false;

							for ( var j = 0; j < saveform.length; j++){
							if(saveform[j].fields.agilefield){							
							var field = saveform[j].fields.agilefield.value;
							if(field.length>15 && count == 0){
								for(var k=field.length; k>15; k--)
									field.pop(field[k]);								
							}								
							field.push(value);
							count++;		
						}
					}
				}
			}else{
						for ( var i = 0; i < saveform.length; i++){
							
							if(saveform[i].fields.agilefield){		
							var field = saveform[i].fields.agilefield.value;							
							if(field.length>15){
								for(var j=field.length; j>15; j--)
									field.pop(field[j]);								
							}
						}
					}
				}
					$('#form-label').text('Edit Form');
					new MyFormView({ title : "Original", collection : new MyFormSnippetsCollection(saveform) });				
				});
				}
				
			}
		});
	}}
});