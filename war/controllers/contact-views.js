/**
 * Creates backbone router for contacts views management operations.
 */
var ContactViewsRouter = Backbone.Router.extend({
	
	routes : {
		
		/* Views */

		"contact-views" : "contactViews", 
		
		"contact-view-add" : "contactViewAdd",
		
		"contact-custom-view-edit/:id" : "editContactView",
	},
	
	/**
	 * Shows contact view lists
	 */
	contactViews : function()
	{
		this.contactViewListView = new Base_Collection_View({ url : '/core/api/contact-view', restKey : "contactView",
			templateKey : "contact-custom-view", individual_tag_name : 'tr' });
		this.contactViewListView.collection.fetch();
		$('#content').html(this.contactViewListView.render().el);
	},
	
	/**
	 * Adds new view for contact list
	 */
	contactViewAdd : function()
	{
		var view = new Base_Model_View({ url : 'core/api/contact-view', isNew : true, window : "contact-views", template : "contact-view",
			postRenderCallback : function(el)
			{
				// Check if model is new or not. If it is not new then
				// there is no need to perform post render
				if (view.model && view.model.get('id'))
					return;
				fillSelect("custom-fields-optgroup", "core/api/custom-fields", undefined, function(data)
				{
					console.log(data);
					head.js(LIB_PATH + 'lib/jquery-ui.min.js', LIB_PATH + 'lib/jquery.multi-select.js', function()
					{
						$("#content").html(el);
						$('#multipleSelect', el).multiSelect();
						$('.ms-selection', el).children('ul').addClass('multiSelect').attr("name", "fields_set").sortable();

					});
				}, '<option value="CUSTOM_{{field_label}}">{{field_label}}</option>', true, el);

			} });
		$("#content").html(LOADING_HTML);
		view.render();
	},
	
	/**
	 * Edits contact view
	 */
	editContactView : function(id)
	{

		if (!App_Contact_Views.contactViewListView || App_Contact_Views.contactViewListView.collection.length == 0 || App_Contact_Views.contactViewListView.collection
				.get(id) == null)
		{
			this.navigate("contact-views", { trigger : true });
			return;
		}
		var contact_view_model = App_Contact_Views.contactViewListView.collection.get(id);

		var contactView = new Base_Model_View({ url : 'core/api/contact-view/', model : contact_view_model, template : "contact-view",
			restKey : "contactView", window : "contact-views", postRenderCallback : function(el)
			{
				fillSelect("custom-fields-optgroup", "core/api/custom-fields", undefined, function(data)
				{
					head.js(LIB_PATH + 'lib/jquery-ui.min.js', LIB_PATH + 'lib/jquery.multi-select.js', function()
					{

						$('#multipleSelect', el).multiSelect();

						$('.ms-selection', el).children('ul').addClass('multiSelect').attr("name", "fields_set").attr("id", "fields_set").sortable();

						$.each(contact_view_model.toJSON()['fields_set'], function(index, field)
						{
							$('#multipleSelect', el).multiSelect('select', field);
						});

					});

				}, '<option value="CUSTOM_{{field_label}}">{{field_label}}</option>', true, el);
			}, saveCallback : function(data)
			{
				var viewValue = readCookie('contact_view');
				if (viewValue && viewValue == data.id)
				{
					CONTACTS_HARD_RELOAD = true;
					App_Contacts.contactViewModel = undefined;
				}
			} });

		$("#content").html(contactView.render().el);

	},
	
});