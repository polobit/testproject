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
		
		"company-bulk-email" : "companyEmailBulk",

		"company-bulk-tags" : "companyTagsBulk",

		"company-bulk-tags-remove" : "companyTagsRemoveBulk",
		
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
			getTemplate("bulk-actions-owner", {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));	
				$('body').trigger('fill_owners');




			}, "#content");
			
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
			getTemplate("bulk-actions-campaign", {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));	
				$('body').trigger('fill_campaigns');
			}, "#content");			
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
		else{

			getTemplate("bulk-actions-tags", {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));
			}, "#content");	

		}
			
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
			getTemplate("bulk-actions-tags-remove", {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));
			}, "#content");	
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
			$("#content").html('<div id="send-email-listener-container"></div>');
			getTemplate("send-email", {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#send-email-listener-container').html($(template_ui));
				$("#emailForm").find('.add-attachment-select').hide();
				$('body').trigger('fill_emails');
				initializeSendEmailListeners();
				sendEmailAttachmentListeners("send-email-listener-container");

			}, "#send-email-listener-container");			
		}

		var options = {};
		options[_agile_get_translated_val('others','add-new')] = "verify_email";
		

	fetchAndFillSelect(
			'core/api/account-prefs/verified-emails/all',
			"email",
			"email",
			undefined,
			options,
			$('#from_email'),
			"prepend",
			function($select, data) {
			
			if($select.find('option').size()===1){
					$select.find("option:first").before("<option value='NOEMAIL'>-No Verified Email-</option>");
					$select.find('option[value ="NOEMAIL"]').attr("selected", "selected");
			}
			else
					$select.val($select.find('option')[0].value);
				rearrange_from_email_options($select, data);
			});
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
			getTemplate("bulk-actions-company-owner", {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));	
				$('body').trigger('fill_owners');
			}, "#content");
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

			$("#content").html('<div id="send-email-listener-container"></div>');
			getTemplate("send-email-company", {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
					
				$('#send-email-listener-container').html($(template_ui));	
				$("#emailForm").find('.add-attachment-select').hide();
				$('body').trigger('fill_emails');
				initializeSendEmailListeners();
				sendEmailAttachmentListeners("send-email-listener-container");

			}, "#send-email-listener-container");
		}
	},

	/**
	 * Loads the tags template to remove tags to the selected contacts
	 */
	companyTagsRemoveBulk : function()
	{
		// On reloading redirecting to contacts list
		if (!App_Companies.companiesListView)
			Backbone.history.navigate("companies", { trigger : true });
		else
			getTemplate("bulk-actions-companies-tags-remove", {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));
			}, "#content");	
	},

	/**
	 * Loads the tags template to add tags to the selected contacts
	 */
	companyTagsBulk : function()
	{
		// On reloading redirecting to contacts list
		if (!App_Companies.companiesListView)
			Backbone.history.navigate("companies", { trigger : true });
		else{

			getTemplate("bulk-actions-companies-tags", {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));
			}, "#content");	

		}
	}
	
});
