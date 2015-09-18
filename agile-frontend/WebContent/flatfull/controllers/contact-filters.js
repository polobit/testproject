/**
 * Creates backbone router for contacts filters management operations.
 */
var ContactFiltersRouter = Backbone.Router.extend({
	
	routes : {
		

		/* Contact-Filters */
		
		"contact-filters" : "contactfilters",
		
		"contact-filter-add" : "contactFilterAdd",
		
		"contact-filter-edit/:id" : "contactFilterEdit",
		
		"contact-filter/:id" : "showFilterContacts"
		
	},
	
	/**
	 * Shows contact filters list
	 */
	contactfilters : function()
	{
		this.contactFiltersList = new Base_Collection_View({ url : '/core/api/filters', restKey : "ContactFilter", templateKey : "contact-filter",
			individual_tag_name : 'tr', sort_collection : false,
			postRenderCallback : function(el)
			{
							head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
							{
											$(".created_time", el).timeago();
							});

			}});

		this.contactFiltersList.collection.fetch();
		$("#content").html(this.contactFiltersList.render().el);
	},
	
	/**
	 * Adds new filter to get specific contacts
	 */
	contactFilterAdd : function()
	{

		var contacts_filter = new Base_Model_View({ url : 'core/api/filters', template : "filter-contacts", isNew : "true", window : "contact-filters",
			postRenderCallback : function(el)
			{
				head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
				{
					chainFiltersForContactAndCompany(el, undefined, function()
					{
						$('#content').html(el);
						scramble_input_names($(el).find('#filter-settings'));
						$("#contact_type").trigger('change');
					});
				});				
			} });
		$("#content").html(LOADING_HTML);
		contacts_filter.render();		
	},
	
	/**
	 * Edits filter created
	 */
	contactFilterEdit : function(id)
	{
		if (!this.contactFiltersList || this.contactFiltersList.collection.length == 0 || this.contactFiltersList.collection.get(id) == null)
		{
			this.navigate("contact-filters", { trigger : true });
			return;
		}

		$("#content").html(LOADING_HTML);
		var contact_filter = this.contactFiltersList.collection.get(id);
		var ContactFilter = new Base_Model_View({ url : 'core/api/filters', model : contact_filter, template : "filter-contacts",
			window : 'contact-filters', postRenderCallback : function(el)
			{
				$(el).on('agile_model_loaded', function(e) {
					$("#contact_type").trigger('change');
				})
				$("#content").html(LOADING_HTML);
				head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
				{
					$("#content").html(LOADING_HTML);
					// setTimeout(function(){
						chainFiltersForContactAndCompany(el, contact_filter.toJSON(), function()
						{
							$('#content').html(el);
						});
					scramble_input_names($(el).find('#filter-settings')); 						
					// }, 0);
					

				})
			}, saveCallback : function(data)
			{
				var filterValue = readCookie('contact_filter');
				if (filterValue && filterValue == data.id)
					CONTACTS_HARD_RELOAD = true;
			} });

		$("#content").html(LOADING_HTML);
		ContactFilter.render();

	},

	/**
	 * Fetches contacts based on filter_id
	 */
	showFilterContacts : function(filter_id)
	{
		if (App_Contacts)
			App_Contacts.contacts(undefined, filter_id);
	}
	
	
});