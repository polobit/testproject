/**
 * Creates backbone router for contacts bulk actions management operations.
 */
var ContactBulkActionRouter = Backbone.Router.extend({
	
	routes : {
		
		/* Contact bulk actions */
		
		"bulk-owner" : "ownerBulk",
		
		"bulk-campaigns" : "campaignsBulk",
		
		"bulk-tags" : "tagsBulk",
		
		"bulk-tags-remove" : "tagsRemoveBulk",
		
		"bulk-email" : "emailBulk", 
		
		"company-bulk-owner" : "companyOwnerBulk",
		
		"company-bulk-email" : "companyEmailBulk"
		
	},

	/**
	 * Loads the owners template to subscribe the selected contacts to a
	 * campaign and triggers the custom event 'fill_owners' to fill the
	 * owners select drop down. This event is
	 */
	ownerBulk : function()
	{

		// On reloading redirecting to contacts/companies list
		if (!App_Contacts.contactsListView)
			Backbone.history.navigate("contacts", { trigger : true });
		else
		{
			$("#content").html(getTemplate("bulk-actions-owner", {}));
			$('body').trigger('fill_owners');
		}
	},

	/**
	 * Loads the campaign template to subscribe the selected contacts to
	 * a campaign and triggers an event, which fills the campaigns
	 * select drop down. This event is binded to trigger on loading of
	 * the template
	 */
	campaignsBulk : function()
	{

		// On reloading redirecting to contacts list
		if (!App_Contacts.contactsListView)
			Backbone.history.navigate("contacts", { trigger : true });
		else
		{
			$("#content").html(getTemplate("bulk-actions-campaign", {}));
			$('body').trigger('fill_campaigns');
		}

	},

	/**
	 * Loads the tags template to add tags to the selected contacts
	 */
	tagsBulk : function()
	{
		// On reloading redirecting to contacts list
		if (!App_Contacts.contactsListView)
			Backbone.history.navigate("contacts", { trigger : true });
		else
			$("#content").html(getTemplate("bulk-actions-tags", {}));
	},
	/**
	 * Loads the tags template to add tags to the selected contacts
	 */
	tagsRemoveBulk : function()
	{
		// On reloading redirecting to contacts list
		if (!App_Contacts.contactsListView)
			Backbone.history.navigate("contacts", { trigger : true });
		else
			$("#content").html(getTemplate("bulk-actions-tags-remove", {}));
	},

	/**
	 * Loads the email template to send email to the selected contacts
	 * and triggers an event, which fills send email details. This event
	 * is binded to trigger on loading of the template
	 */
	emailBulk : function()
	{

		// On reloading redirecting to contacts list
		if (!App_Contacts.contactsListView)
			Backbone.history.navigate("contacts", { trigger : true });
		else
		{
			$("#content").html(getTemplate("send-email", {}));
			$("#emailForm").find('.add-attachment-select').hide();
			$('body').trigger('fill_emails');
		}
	},
	
	/**
	 * Loads the owners template to subscribe the selected contacts to a
	 * campaign and triggers the custom event 'fill_owners' to fill the
	 * owners select drop down. This event is
	 */
	companyOwnerBulk : function()
	{

		// On reloading redirecting to contacts/companies list
		if (!App_Companies.companiesListView)
			Backbone.history.navigate("companies", { trigger : true });
		else
		{
			$("#content").html(getTemplate("bulk-actions-company-owner", {}));
			$('body').trigger('fill_owners');
		}
	},

	/**
	 * Loads the email template to send email to the selected contacts
	 * and triggers an event, which fills send email details. This event
	 * is binded to trigger on loading of the template
	 */
	companyEmailBulk : function()
	{

		// On reloading redirecting to contacts list
		if (!App_Companies.companiesListView)
			Backbone.history.navigate("companies", { trigger : true });
		else
		{
			$("#content").html(getTemplate("send-email-company", {}));
			$("#emailForm").find('.add-attachment-select').hide();
			$('body').trigger('fill_emails');
		}
	}
	
});