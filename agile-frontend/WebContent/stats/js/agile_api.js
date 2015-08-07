/**
 * agile_api.js deals with the _agile object used to define the api calls
 * 
 * @module stats
 */
var _agile = {

		set_account : function(APIKey, domain)
		{
			agile_setAccount(APIKey, domain);						// Set account
		}, 
		set_email : function(email)
		{
			agile_setEmail(email);									// Set contact email
		},
		track_page_view : function(callback)
		{
			agile_trackPageview(callback);							// Track a particular page
		}, 
		set_tracking_domain : function(host)
		{
		    agile_trackingDomain(host);								// Set tracking domain
		},
		create_contact : function(properties, callback)
		{
			agile_createContact(properties, callback);				// Create a contact
		},
		get_contact : function(email, callback)
		{
			agile_getContact(email, callback);						// Get contact
		},
		delete_contact : function(email, callback)
		{
			agile_deleteContact(email, callback);					// Delete a contact
		}, 
		add_tag : function(tags, callback, email)
		{
			agile_addTag(tags, callback, email);					// Add tags
		}, 
		remove_tag : function(tags, callback, email)
		{
			agile_removeTag(tags, callback, email);					// Remove tags
		}, 
		add_score : function(score, callback, email)
		{
			agile_addScore(score, callback, email);					// Add score to contact
		}, 
		subtract_score : function(score, callback, email)
		{
			agile_subtractScore(score, callback, email);			// Subtract score from contact
		}, 
		add_note : function(data, callback, email)
		{
			agile_addNote(data, callback, email); 					// Add note to contact
		},
		set_property : function(data, callback, email)
		{
			agile_setProperty(data, callback, email);				// Add or update property to contact
		},
		add_task : function(data, callback, email)
		{
			agile_addTask(data, callback, email);					// Add a to do
		},
		add_deal : function(data, callback, email)
		{
			agile_addDeal(data, callback, email);					// Add a opportunity
		},
		get_score : function (callback, email)
		{
			agile_getScore(callback, email);						// Get score from contact
		},
		get_tags : function (callback, email)
		{
			agile_getTags(callback, email);							// Get tags related to contact
		},
		get_notes : function (callback, email)
		{
			agile_getNotes(callback, email);						// Get notes related to contact
		},
		get_tasks : function (callback, email)
		{
			agile_getTasks(callback, email);						//	Get tasks related to contact
		},
		get_deals : function (callback, email)
		{
			agile_getDeals(callback, email);						// Get deals related to contact
		},
		add_campaign : function (data, callback, email)
		{
			agile_addCampaign(data, callback, email); 				// Add campaign to contact
		},
		get_campaigns : function (callback, email)
		{
			agile_getCampaigns(callback, email);					// Get campaign from contact
		},
		get_campaign_logs : function (callback, email)
		{
			agile_getCampaignlogs(callback, email);					// Get campaign logs of contact
		},
		get_workflows : function (callback)
		{
			agile_getWorkflows(callback);							// Get all work-flows created by domain user
		},
		get_pipelines : function (callback)
		{
			agile_getPipelines(callback);							// Get pipelines (Tracks)
		},
		get_milestones : function (callback)
		{
			agile_getMilestones(callback);							// Get milestones
		},
		get_milestones_by_pipeline : function (pipeline_id,callback)
		{
			agile_getMilestones_by_pipeline(pipeline_id,callback);	// Get milestones based on pipeline id.
		},
		update_contact : function (data, callback, email)
		{
			agile_updateContact(data, callback, email);				// Update contact
		},
		get_email : function (callback)
		{
			agile_getEmail(callback);								// Get email
		},
		create_company : function(data, callback)
		{
			agile_createCompany(data, callback);					// Create company
		},
		get_property : function (name, callback, email)
		{
			agile_getProperty(name, callback, email);				// Get property
		},
		remove_property : function (name, callback, email)
		{
			agile_removeProperty(name,callback,email);				// Remove property
		},
		add_property : function(data, callback, email)
		{
			agile_setProperty(data, callback, email);				// Add or update property to contact
		},
		web_rules : function(callback)
		{
			agile_webRules(callback);								// Get all web rules associated with domain
		},
		unsubscribe_campaign : function(data, callback, email)
		{
			agile_unsubscribeCampaign(data, callback, email);		// Unsubscribe a contact from campaign based on email
		},
		allowed_domains : function(callback)
		{
			agile_allowedDomains(callback);							// Get string of allowed domains
		},
		get_all_users : function(callback)
		{
			agile_getAllUsers(callback);							// Get string of allowed domains
		},
		create_case : function(callback)
		{
			agile_createCase(callback);								// Create case and add to contact with email set
		},
		update_deal : function(data, callback, email)
		{
			agile_updateDeal(data, callback, email);				// Update deal of contact
		}
};