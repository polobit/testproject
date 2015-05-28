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
				$('#form-label').text('Edit Form');
				new MyFormView({ title : "Original", collection : new MyFormSnippetsCollection(saveform) });
				
				//Loads form view in form.jsp page
				if($('#agileFormHolder').length != 0) {
					var formHtml = $("#render").val();
			    	  if(formHtml != '') {
			    		  $('#agileFormHolder').html(formHtml);
			    		  $('#agileFormHolder style').remove();
			    		  
			    		  //resetting generated form values to meet requirement.
			    		  
			    		  _agile.set_account($("#_agile_api").val(), $("#_agile_domain").val());
			    		  
			    		  $('#agile-form').attr("method","POST");
			    		  var agileFormSubmitURL = "#";
			    		  $('#agile-form').attr("action",agileFormSubmitURL);
			    		  
			    		  var newRedirectHiddenField = $("#_agile_redirect_url").val();
			    		  if(typeof newRedirectHiddenField != "undefined") {
			    			  $("#_agile_redirect_url").val("#");
			    		  }
			    		 
			    		  //changing redirect url - for old form support
			    		  if($('#agile-form-data').length != 0) {
			    			  var agile_form_data = $('#agile-form-data').attr('name').split(" ");
				    		  agile_form_data[2] = agileFormSubmitURL;
				    		  $('#agile-form-data').attr('name',agile_form_data.join(" "));  
			    		  }			    		  
			    		  
			    	  }
				}
				
				
			}
		});
	}}
});