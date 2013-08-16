/**
 * agile_api.js deals with the _agile object used to define the api calls
 * 
 * @module stats
 */
var _agile = {

		set_account : function(APIKey, domain)
		{
			agile_setAccount(APIKey, domain);	// Set account
		}, 
		set_email : function(email)
		{
			agile_setEmail(email);		// Set contact email
		}, 
		track_page_view : function(callback)
		{
			agile_trackPageview(callback);	// Track a particular page
		}, 
		create_contact : function(properties, callback)
		{
			agile_createContact(properties, callback);	// Create a contact
		}, 
		delete_contact : function(email, callback)
		{
			agile_deleteContact(email, callback);	// Delete a contact
		}, 
		add_tag : function(tags, callback, email)
		{
			agile_addTag(tags, callback, email);	// Add tags
		}, 
		remove_tag : function(tags, callback, email)
		{
			agile_removeTag(tags, callback, email);		// Remove tags
		}, 
		add_score : function(score, callback, email)
		{
			agile_addScore(score, callback, email);		// Add score to contact
		}, 
		subtract_score : function(score, callback, email)
		{
			agile_subtractScore(score, callback, email);	// Subtract score from contact
		}, 
		add_note : function(subject, description, callback, email)
		{
			agile_addNote(subject, description, callback, email); 	// Add note to contact
		},
		add_property : function(name, id, callback, email)
		{
			agile_addProperty(name, id, callback, email);	// Add or update property to contact
		},
		add_task : function(data, callback, email)
		{
			agile_addTask(data, callback, email);	// Add a to do
		},
		add_deal : function(data, callback, email)
		{
			agile_addDeal(data, callback, email);	// Add a opportunity
		},
		get_score : function (callback, email)
		{
			agile_getScore(callback, email);	// Get score from contact
		},
		get_tags : function (callback, email)
		{
			agile_getTags(callback, email);		// Get tags related to contact
		},
		get_notes : function (callback, email)
		{
			agile_getNotes(callback, email);	// Get notes related to contact
		},
		get_tasks : function (callback, email)
		{
			agile_getTasks(callback, email);	//	Get tasks related to contact
		}};