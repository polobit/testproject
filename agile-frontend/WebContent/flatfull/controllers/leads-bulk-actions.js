var LeadsBulkActionRouter = Backbone.Router.extend({

	routes : {
		
		"lead-bulk-tags" : "addBulkTags"
		
	},

	/**
	 * Loads the tags template to add tags to the selected leads
	 */
	addBulkTags : function()
	{
		// On reloading redirecting to leads list
		if (!App_Leads.leadsListView)
		{
			Backbone.history.navigate("leads", { trigger : true });
		}
		else
		{
			var addBulkTagsView = new Leads_Bulk_Action_Events_View({ data : {}, template : "bulk-actions-leads-tags", isNew : true,
				postRenderCallback : function(el)
				{
					setup_tags_typeahead();
				} 
			});
			$('#content').html(addBulkTagsView.render().el);
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

		var options = {
		"+ Add new" : "verify_email"
		};

	fetchAndFillSelect(
			'core/api/account-prefs/verified-emails/all',
			"email",
			"email",
			undefined,
			options,
			$('#from_email'),
			"prepend",
			function($select, data) {
			
			var ownerEmail = $select.find('option[value = \"'+CURRENT_DOMAIN_USER.email+'\"]').val();
			
				if(typeof(ownerEmail) == "undefined")
				{
				$select
						.find("option:first")
						.before(
								"<option value="+CURRENT_DOMAIN_USER.email+">"+CURRENT_DOMAIN_USER.email+"</option>");

					$select.val(CURRENT_DOMAIN_USER.email).attr("selected", "selected");
				}
				else
				$select.find('option[value = \"'+CURRENT_DOMAIN_USER.email+'\"]').attr("selected", "selected");
				
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