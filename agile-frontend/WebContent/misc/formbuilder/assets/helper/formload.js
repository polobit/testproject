define([
		'jquery', 'underscore', 'backbone', 'helper/pubsub', 'collections/my-form-snippets', 'views/my-form'], function($, _, Backbone, PubSub, MyFormSnippetsCollection, MyFormView)
{
	return { agile_form_load : function()
	{
		var url = window.location.protocol + '//' + window.location.host + '/' + 'core/api/forms/form?formId=' + formNumber;
		
		$.ajax({
			url : url,
			type: 'GET',
			dataType: 'json',
			success: function(data){
				
				saveform = JSON.parse(data.formJson);
				
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

					for ( var j = 0; j < saveform.length; j++){

							if(saveform[j].fields.agilefield){							
							
							var field = saveform[j].fields.agilefield.value;
							
							var agileFields = field.slice(0,15);
							
							if(field.length>15){
								for(var k=field.length-1; k>=15; k--){
									if(field[k].selected)
										agileFields.push(field[k]);
								}
							}								
					
					if(fields.length != 0)
					{ 
					for ( var i = 0; i < fields.length; i++)
						{
							var value = {};
							value.value = fields[i].field_label;
							value.label = fields[i].field_label;
							value.selected = false;
							var count = 0;
							for(var k=agileFields.length-1; k>=15; k--){
								if(value.label == agileFields[k].label)
									count++;								
							}
							if(count == 0)
								agileFields.push(value);
						}
						saveform[j].fields.agilefield.value = agileFields;
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