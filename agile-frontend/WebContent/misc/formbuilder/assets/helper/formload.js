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
					for ( var j = 0; j < fields.length; j++)
						{
							var value = {};
							value.value = fields[j].field_label;
							value.label = fields[j].field_label;
							value.selected = false;
							for ( var i = 0; i < saveform.length; i++)
						{
							if(saveform[i].fields.agilefield)
								saveform[i].fields.agilefield.value.push(value);
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