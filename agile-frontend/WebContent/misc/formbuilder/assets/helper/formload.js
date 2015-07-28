define([
		'jquery', 'underscore', 'backbone', 'helper/pubsub', 'collections/my-form-snippets', 'views/my-form'], function($, _, Backbone, PubSub, MyFormSnippetsCollection, MyFormView)
{
	return { agile_form_load : function()
	{
		var url = window.location.protocol + '//' + window.location.host + '/' + 'core/api/forms/form?formId=' + formNumber;
		
		if(typeof formLoadDomain != 'undefined' && window.location.hostname.split('.')[0] == "my")
			url = 'https://my.agilecrm.com/fbformload?formId=' + formNumber + '&domain=' + formLoadDomain;
		
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
			    		  if(typeof formLoadDomain != 'undefined'){
			    			  $('#agile-form').attr("action","https://"+ formLoadDomain +".agilecrm.com/formsubmit");
			    		  }
			    	  }
				}
				
				
			}
		});
	}}
});