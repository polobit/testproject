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
		$("#form-save").text("Saving...");
		$.ajax({
			type : 'POST',
			url : url,
			async : true,
			contentType : 'application/json',
			data : JSON.stringify(form),
			success: function(data){
				if(data!=null){					
					$("#form-save").text("Save");
					$("#form-save").removeAttr("disabled");
					$("#form_preview").removeAttr("disabled");
					if(!formNumber){
						formNumber=data.id;
						if(window.history)
							window.history.replaceState(null,null,window.location.origin+"/formbuilder?form="+formNumber);
					}
					$("#form_preview").attr("href",window.location.origin+"/forms/"+formNumber);
					
				}
			},
			error: function(){
				alert("Form with this name is already saved, or this is an invalid form name. Please change form name and try again.");
				target.removeAttr("disabled");
				$("#form-save").text("Save");
					
			}});
	}}
});
