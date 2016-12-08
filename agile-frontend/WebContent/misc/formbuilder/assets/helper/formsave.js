define([
	'jquery', 'underscore', 'backbone', 'helper/pubsub'
], function($, _, Backbone, PubSub)
{
	return { agile_form_save : function(e){

		var target = $("#"+e.target.id);
		target.attr("disabled", "disabled");

		var url = window.location.protocol + '//' + window.location.host + '/' + 'core/api/forms';
		var form = {};
		form.formName = saveform[0].fields.name.value;
		form.formJson = saveform;
		form.formHtml = $("#render").val();
		if(formNumber){
			form.id = formNumber;
		}
		$.ajax({
			type : 'POST',
			url : url,
			async : true,
			contentType : 'application/json',
			data : JSON.stringify(form),
			success: function(){
				if(formNumber){
					alert("Form saved successfuly.Click on Preview option to view the updated form.");
					$("#form-save").removeAttr("disabled");
				}
				else{
					var url = window.location.origin + "/#forms";
					window.location.replace(url);	
				}
			},
			error: function(){
				alert("Form with this name is already saved, or this is an invalid form name. Please change form name and try again.");
				target.removeAttr("disabled");
			}});
	}}
});
