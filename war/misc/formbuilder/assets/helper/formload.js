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
				var formLabel = saveform[0].fields.name.value;
				$('#form-label').text('Editing form "'+ formLabel + '"');
				new MyFormView({ title : "Original", collection : new MyFormSnippetsCollection(saveform) });
			}
		});
	}}
});