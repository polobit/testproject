/**
 * Creates backbone router for contacts views management operations.
 */
var ContactViewsRouter = Backbone.Router.extend({
	
	routes : {
		"contact-view-prefs" : "editContactView",
	},	
	/**
	 * Edits contact view
	 */
	editContactView : function()
	{
		var contactView = new Base_Model_View({ url : 'core/api/contact-view-prefs', template : "contact-view",change: false, 
			restKey : "contactView", window : "contacts", postRenderCallback : function(el, modelData)
			{
				fillSelect("custom-fields-optgroup", "core/api/custom-fields/scope?scope=CONTACT", undefined, function(data)
				{
					head.js(LIB_PATH + 'lib/jquery-ui.min.js', LIB_PATH + 'lib/jquery.multi-select.js', function()
					{

						$('#multipleSelect', el).multiSelect();

						$('.ms-selection', el).children('ul').addClass('multiSelect').attr("name", "fields_set").attr("id", "fields_set").sortable();

						$.each(modelData['fields_set'], function(index, field)
						{
							$('#multipleSelect', el).multiSelect('select', field);
						});

					});

				}, '<option value="CUSTOM_{{field_label}}">{{field_label}}</option>', true, el);
			}, saveCallback : function(data)
			{
				CONTACTS_HARD_RELOAD = true;
				App_Contacts.navigate("contacts", { trigger : true });

				App_Contacts.contactViewModel.fields_set = data.fields_set;
			} });

		$("#content").html(contactView.render().el);

	}
	
});