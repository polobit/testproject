/**
 * agile_account.js deals with function to set id, namespace
 * 
 * @module stats
 */

function agile_setAccount(id, namespace)
{
	// Sets the contact account with passed id and namespace
	agile_id.set(id, namespace);
	agile_setEmailFromUrl();
}

function agile_setEmailFromUrl()
{
	// Check if fwd=cd url
	if (window.location.href.search("fwd=cd")!==-1){
		try{
			// Get data
			var k =  decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI("data").replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
			if(k) {

				// Get and set email
				agile_guid.set_email(JSON.parse(k).email);
			}
		}
		catch(e){
			console.log(e.message);
		}
	}
}/**
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
		get_milestones : function (callback)
		{
			agile_getMilestones(callback);							// Get milestones
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
		}};/**
* agile_campaigns.js deals with functions to add or get campaigns based on the email of the contact
*/

/**
* Add a campaign based on the email of the contact
* 
* @param email
* 				email of the contact
*/
function agile_addCampaign(data, callback, email)
{
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else 
			email = agile_guid.get_email();
	}
	var params = "data={0}&email={1}".format(encodeURIComponent(JSON.stringify(data)), encodeURIComponent(email));
	
	// Get
	var agile_url = agile_id.getURL() + "/contacts/add-campaign?callback=?&id=" + agile_id.get() + "&" + params;
	
	// Callback
	agile_json(agile_url, callback);
}

/**
* Get a campaign based on email of the contact
* 
* @param email
* 				email of the contact
*/
function agile_getCampaigns(callback, email)
{
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	// Get
	var agile_url = agile_id.getURL() + "/contacts/get-campaigns?callback=?&id=" + agile_id.get() + "&" + "email={0}".format(encodeURIComponent(email));
	
	// Callback
	agile_json(agile_url, callback);
}

/**
* Get a multiple campaign logs based on email of the contact
* 
* @param email
* 				email of the contact
*/
function agile_getCampaignlogs(callback, email)
{
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	// Get
	var agile_url = agile_id.getURL() + "/contacts/get-campaign-logs?callback=?&id=" + agile_id.get() + "&" + "email={0}".format(encodeURIComponent(email));
	
	// Callback
	agile_json(agile_url, callback);
}

/**
* Get all work-flows created by current domain user
*/
function agile_getWorkflows(callback)
{
	// Get
	var agile_url = agile_id.getURL() + "/contacts/get-workflows?callback=?&id=" + agile_id.get();
	
	// Callback
	agile_json(agile_url, callback);
}/**
 * agile_contact.js deals with the functions used to create, get,
 * and delete the contact.
 * 
 * @module stats
 */

/**
 * Creates a contact with the following properties
 * 
 * @param data	{object}
 *            example : {tags:[tag1, tag2], properties:[{name:first_name, value:
 *            agile}, {name: last_name, value: crm}]}
 * @param callback
 *            callback function for agile_createContact
 */
function agile_createContact(data, callback)
{
	var properties = [];

	for ( var key in data)
	{
		if (data.hasOwnProperty(key) && key != "tags")
		{
			// Add tags to properties array
			properties.push(agile_propertyJSON(key, data[key]));
		}
	}

	var original_ref = "original_ref";
	properties.push(agile_propertyJSON(original_ref, agile_read_cookie(agile_guid.cookie_original_ref)));

	// Create json object and append properties
	var model = {};
	model.properties = properties;
	if (data["tags"])
	{
		var tags = data["tags"];
		var tags_string = tags.trim().replace("/ /g", " ");

		// Replace ,space with ,
		tags_string = tags.replace("/, /g", ",");

		// Splitting tags string at ,
		model.tags = tags_string.split(",");
	}

	// var params = "contact={0}&tags={1}".format(encodeURIComponent(data),
	// encodeURIComponent(JSON.stringify(tags)));
	
	// Get
	var agile_url = agile_id.getURL() + "/contacts?callback=?&id=" + agile_id.get() + "&contact=" + encodeURIComponent(JSON.stringify(model));

	// Callback
	agile_json(agile_url, callback);
}

/**
 * Delete a contact based on the email
 * 
 * @param email
 *            email of the contact
 * @param callback
 *            callback for agile_deleteContact
 */
function agile_deleteContact(email, callback)
{
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else 
			email = agile_guid.get_email();
	}
	var agile_url = agile_id.getURL() + "/contact/delete?callback=?&id=" + agile_id.get() + "&email=" + encodeURIComponent(email);

	// Callback
	agile_json(agile_url, callback);
}

/**
 * Get contact based on the email
 * 
 * @param email
 *            email of the contact
 * @param callback
 *            callback of the agile_getContact
 */
function agile_getContact(email, callback)
{
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else 
			email = agile_guid.get_email();
	}
	var params = "email={0}".format(encodeURIComponent(email));

	// Get
	var agile_url = agile_id.getURL() + "/contact/email?callback=?&id=" + agile_id.get() + "&" + params;

	// Callback
	agile_json(agile_url, callback);
}

/**
 * Update contact based on the email 
 * 
 * @param data
 * 				data on JSON format
 * @param callback
 * 				callback for updateContact
 * @param	email
 * 			email of the contact to update 
 */
function agile_updateContact(data, callback, email)
{
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else 
			email = agile_guid.get_email();
	}
	// Query Params
	var params = "data={0}&email={1}".format(encodeURIComponent(JSON.stringify(data)), encodeURIComponent(email));
	
	// Get
	var agile_url = agile_id.getURL() + "/contact/update?callback=?&id=" + agile_id.get() + "&" + params;
	
	// Request
	agile_json(agile_url, callback);
}

/**
 * Creates a company
 * @param data
 * 				Company data in JSON format
 * @param callback
 * 				callback function
 */
function agile_createCompany(data, callback)
{
	// Properties array
	var properties = [];
	
	// Iterate data and add properties to array
	for (var key in data)
		{
			if(data.hasOwnProperty(key))
				{
					properties.push(agile_propertyJSON(key,data[key]));
				}
		}

	// JSON model with properties
	var model = {};
	model.properties = properties;

	var agile_url = agile_id.getURL() + "/company?callback=?&id=" + agile_id.get() + "&data=" + encodeURIComponent(JSON.stringify(model));

	// Callback
	agile_json(agile_url, callback);
}/**
 * agile_core.js is a script file which contains the helper functions used in
 * agile-min.js
 * 
 * @module Stats
 */

function agile_propertyJSON(name, id, type)
{
	/**
	 * Converts the parameters passed to it into a JSON object
	 * 
	 * @param name
	 *            name of the property. Example : "email"
	 * @param id
	 *            value of the property. Example : "clickdesk@example.com"
	 * @returns JSON
	 */
	var json = {};

	if (type == undefined)
		json.type = "SYSTEM";
	else
		json.type = type;

	json.name = name;
	json.value = id;
	return json;
}

function agile_json(URL, callback)
{
	/**
	 * Generates the callback
	 * 
	 * @param URL
	 *            callback url
	 * @param callback
	 *            callback function
	 * @param data
	 *            callback function parameter (used optionally depending on callback)
	 * @returns element
	 */
	var ud = 'json' + (Math.random() * 100).toString().replace(/\./g, '');
	window[ud] = function(data)
	{
		if(data['error'])
			{
				if(callback && typeof(callback['error']) == "function")
				{
					callback['error'](data);
				}
				return;
			}
		
		if(callback && typeof(callback['success']) == "function")
			callback['success'](data);
		
		if(callback && typeof(callback) == 'function')
			callback(data);
	};
	document.getElementsByTagName('body')[0].appendChild((function()
	{
		var s = document.createElement('script');
		s.type = 'text/javascript';
		s.src = URL.replace('callback=?', 'callback=' + ud);
		return s;
	})());
}

String.prototype.format = function()
{
	var args = arguments;
	return this.replace(/{(\d+)}/g, function(match, number)
	{
		return typeof args[number] != 'undefined' ? args[number] : match;
	});
};
/**
 * agile_deals.js deals with function to add and get a deal to a contact based on the email
 */

/**
 * Add a opportunity to contact based on email
 * 
 * @param data
 *            example : {"name": "Deal sales", "description": "brief description on deal",
 *            "expected_value": "100", "milestone":"won", "close_date": data as epoch time}
 * @param callback
 *            callback function for agile_addDeal
 * @param email
 *            email of the contact
 */

function agile_addDeal(data, callback, email)
{
	// If email is not passed get it from cookie
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}

	var params = "opportunity={0}&email={1}".format(encodeURIComponent(JSON.stringify(data)), encodeURIComponent(email));

	// Get
	var agile_url = agile_id.getURL() + "/opportunity?callback=?&id=" + agile_id.get() + "&" + params;

	// Callback
	agile_json(agile_url, callback);
}

/**
 * Get a contact opportunity based on email
 * 
 * @param email
 * 				email of the contact
 */

function agile_getDeals(callback, email)
{
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else 
			email = agile_guid.get_email();
	}
	// Get
	var agile_url = agile_id.getURL() + "/contacts/get-deals?callback=?&id=" + agile_id.get() + "&" + "email={0}".format(encodeURIComponent(email));
	
	// Callback
	agile_json(agile_url, callback);
}/**
 * agile_setEmail reads and checks if
 * email is present in cookie and if email passed is new email then sets it, else
 * resets the agile_session.
 * 
 * @param email
 *            email of the contact
 */
function agile_setEmail(email)
{
	agile_guid.set_email(email);
}
/**
 * Gets the email stored in cookie
 * 
 * @param callback
 * 					callback function
 */
function agile_getEmail(callback)
{
	// Email
	var email = agile_guid.get_email();
	
	// Get
	var agile_url = agile_id.getURL() + "/email?callback=?&id=" + agile_id.get() + "&email=" + encodeURIComponent(email);

	// Request
	agile_json(agile_url, callback);
}/**
 * agile_guid.js deals with functions which are used to generate, get, reset guid,
 * get email from cookie, set email to cookie if its new else reset guid and session id. 
 */
var agile_guid = { 
		
		// Initiate cookie variables
		init : function()
		{
			this.cookie_name = 'agile-crm-guid';
			this.cookie_email = 'agile-email';
			this.cookie_original_ref = 'agile-original-referrer';
			this.new_guid = false;
		},
		
		// Generate random number like 81a996ac-812c-7677-4b33-e3c2e0ba3050
		random : function()
		{
			var S4 = function()
			{
				return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
			};
			return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
		}, 
		
		// Read guid from cookie if not present generate it
		get : function()
		{
			var guid = agile_read_cookie(this.cookie_name);
			if (!guid)
				guid = this.generate();
			return guid;
		}, 
		
		// Generate guid
		generate : function()
		{
			guid = this.random();
			agile_create_cookie(this.cookie_name, guid, 365 * 5);

			// first referrer set
			this.set_original_referrer();
			this.new_guid = true;
			return guid;
		}, 
		
		// Reset guid
		reset : function()
		{
			agile_create_cookie(this.cookie_name, "", -1);
		}, 
		set_email : function(new_email)
		{
			// Retrieve from cookie and set it only if it is different
			var email = agile_read_cookie(this.cookie_email);
			if (!email || (email != new_email))
			{
				this.email = new_email;

				// Reset guid and session uid if old email is there
				if (email)
				{
					this.reset();
					agile_session.reset();
				}
				agile_create_cookie(this.cookie_email, this.email, 365 * 5);
			}
		}, 
		get_email : function()
		{
			// If email present in the session
			if (this.email)
				return this.email;

			// Read from cookie
			var email = agile_read_cookie(this.cookie_email);
			return email;
		}, 
		set_original_referrer : function()
		{
			// Capture first referrer
			var original_referrer = document.referrer;

			// Write to cookie
			agile_create_cookie(this.cookie_original_ref, original_referrer, 365 * 5);
		} };

agile_guid.init();/**
 * agile_id.js deals with object agile_id and its methods which are used to set,
 * get agile user id and namespace.
 */
var agile_id = {

		// Sets the agile_id, id = api key, namespace = account owner domain name
		set : function(id, namespace)
		{
			this.id = id;
			this.namespace = namespace;
		}, get : function()
		{
			// Returns the id of the contact
			return this.id;
		}, getURL : function()
		{
			// Returns the url corresponding to the namespace
			if (!this.namespace || this.namespace == "localhost")
				return "http://localhost:8888/core/js/api";
			else
				return "https://" + this.namespace + ".agilecrm.com/core/js/api";
		}, getNamespace : function()
		{
			// Returns the namespace by id
			return this.namespace; 
		} };
/**
 * agile_milestones.js deals with functions to get milestones
 * 
 * @module stats
 */

/**
* Get milestones of domain
*
* @return callback
* 					callback function for getMilestones
*/
function agile_getMilestones(callback)
{
	// Get
	var agile_url = agile_id.getURL() + "/contact/get-milestones?callback=?&id=" + agile_id.get();
	
	// Callback
	agile_json(agile_url, callback);
}/** 
* agile_notes deals with function to add a note with subject,
 * description as parameters to contact by email
 */

/**
 * Add a note to contact based on email
 * 
 * @param subject {String}
 * 				subject field of the note
 * @param description {String}
 * 				content of the note
 * @param callback
 * 				callback for addNote function
 * @param email {String}
 * 				email of the contact
 */
function agile_addNote(data, callback, email)
{
	// Check if email is passed, else get from cookie
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}

	var params = "data={0}&email={1}".format(encodeURIComponent(JSON.stringify(data)), encodeURIComponent(email));

	// Get
	var agile_url = agile_id.getURL() + "/contacts/add-note?callback=?&id=" + agile_id.get() + "&" + params;
	
	// Callback
	agile_json(agile_url, callback);
}

/**
 * Get notes based on contact email
 * @param callback
 * 				callback function for agile_getNote
 * @param email
 * 				email of the contact
 */
function agile_getNotes(callback, email)
{
	if(!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}

	// Get
	var agile_url = agile_id.getURL() + "/contacts/get-notes?callback=?&id=" + agile_id.get() + "&" + "email={0}".format(encodeURIComponent(email));
	
	// Callback
	agile_json(agile_url, callback);
}/**
 * agile_property deals with function to add a property to 
 * contact based on the property name and email of contact
 * @param name {String}
 * 				name of the property to be added example : email etc.
 * @param id   {String}
 * 				value of the property to be added example : clickdesk@example.com
 * @param callback
 * 				callback for addProperty function
 * @param email	{String}
 * 				email of the contact, property should be added to
 */
function agile_setProperty(data, callback, email)
{
	// Check if email passed as parameter, else get from cookie
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	
	var params = "data={0}&email={1}".format(encodeURIComponent(JSON.stringify(data)), encodeURIComponent(email));

	var agile_url = agile_id.getURL() + "/contacts/add-property?callback=?&id=" + agile_id.get() + "&" + params;
	
	// Callback
	agile_json(agile_url, callback);
}

/**
 * Get contact property value by name
 * @param name
 * 					name of the contact property. Example : title
 * @param callback
 * 					callback function
 * @param email
 * 					email of the contact
 */
function agile_getProperty(name, callback, email)
{
	// Check if email passed as parameter, else get from cookie
	if (!email)
		{
			if(!agile_guid.get_email())
				{
					return;
				}
			else
				email = agile_guid.get_email();
		}
	
	// Return if property name is not passed as a parameter
	if (!name)
		return;
	
	var agile_url = agile_id.getURL() + "/contacts/get-property?callback=?&id=" + agile_id.get() + "&name=" + name + "&email=" + encodeURIComponent(email);
	
	// Callback
	agile_json(agile_url, callback);
}
/**
 * Remove a contact property by name
 * @param name
 * 				name of the property
 * @param callback
 * 				callback function
 * @param email
 * 				email of the contact
 */
function agile_removeProperty(name, callback, email)
{
	// Check if email passed as parameter else get from cookie
	if(!email)
		{
			if (!agile_guid.get_email())
				{
					return;
				}
			else 
				email = agile_guid.get_email();
		}
	
	// Return if property name is not passed as a parameter
	if(!name)
		return;
	
	var agile_url = agile_id.getURL() + "/contacts/remove-property?callback=?&id=" + agile_id.get() + "&name=" + name + "&email=" + encodeURIComponent(email);
	
	// Callback
	agile_json(agile_url, callback);
}/**
 * agile_score.js deals with functions to add, get, subtract score from the
 * contact fetched based on email
 */

/**
 * Add score to contact based on email
 * @param score
 *            score to be added or subtracted from contact
 * @param callback
 *            callback function for addSore or subtractScore
 * @param email
 *            email of the contact
 */
function agile_addScore(score, callback, email)
{
	// If score is not passed return
	if (!score)
		return;

	// Check if email is passed else get it from cookie
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}

	// Post
	var agile_url = agile_id.getURL() + "/contacts/add-score?callback=?&id=" + agile_id.get() + "&score=" + score + "&email=" + encodeURIComponent(email);

	// Callback
	agile_json(agile_url, callback);
}

function agile_subtractScore(score, callback, email)
{
	// If score is not passed return
	if (!score)
		return;

	// Check if email is passed else get it from cookie
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	// Post
	var agile_url = agile_id.getURL() + "/contacts/subtract-score?callback=?&id=" + agile_id.get() + "&score=" + score + "&email=" + encodeURIComponent(email);

	// Callback
	agile_json(agile_url, callback);
}

/**
 * Get score based on contact email
 * @param callback
 * 				callback function for agile_getScore
 * @param email
 * 				email of the contact
 */
function agile_getScore(callback, email)
{
	if(!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	var agile_url = agile_id.getURL() + "/contacts/get-score?callback=?&id=" + agile_id.get() + "&" + "email={0}".format(encodeURIComponent(email));
	
	// Callback
	agile_json(agile_url, callback);
}/**
 * agile_sesion.js deals with the functions used to generate, get, reset session_id,
 * initiate cookie variables and session
 * 
 */
var agile_session = {
		
		// Initiating session cookie variables
		init : function()
		{
			this.cookie_name = 'agile-crm-session_id';
			this.cookie_start_time = 'agile-crm-session_start_time';
			this.cookie_duration_secs = 60 * 1000;
			this.new_session = false;

		},
		
		// Generating random number like 2e397815-5560-c905-56f2-8ad5fe922481
		random : function()
		{
			var S4 = function()
			{
				return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
			};
			return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
		}, 
		
		// Get session id from cookie if not present generate
		get : function()
		{
			var session_id = agile_read_cookie(this.cookie_name);
			if (!session_id)
				return this.generate();

			// Check if session expired if yes then generate new session
			var prev_session_start_time = agile_read_cookie(this.cookie_start_time);
			var current_time_secs = new Date().getUTCSeconds();
			if ((current_time_secs < prev_session_start_time) || (current_time_secs > (prev_session_start_time + this.cookie_duration_secs)))
			{
				return this.generate();
			}

			return session_id;
		},
		
		// Generate session_id and store start date and time in cookie
		generate : function()
		{
			var session_id = this.random();
			agile_create_cookie(this.cookie_name, session_id, 0);
			agile_create_cookie(this.cookie_start_time, new Date().getUTCSeconds(), 0);
			this.new_session = true;
			return session_id;
		},
		
		// Reset session cookie variables
		reset : function()
		{
			agile_create_cookie(this.cookie_name, "", -1);
			agile_create_cookie(this.cookie_start_time, "", -1);
		} };

agile_session.init();/**
 * agile_tags.js deals with functions to add or remove tags to contact 
 * based on the email of the contact.
 */

/**
 * Add tags to contact based on email
 * 
 * @param tags {String}
 *            tags to be added to contact
 * @param callback
 *            callback for agile_addTag
 * @param email {String}
 *            email of the contact
 */
function agile_addTag(tags, callback, email)
{
	if (!tags)
	{
		return; // No tags found
	}

	if (!email) // Check if email is passed else get it from cookie
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	var params = "email={0}&tags={1}".format(encodeURIComponent(email), encodeURIComponent(tags));

	// Post
	var agile_url = agile_id.getURL() + "/contacts/add-tags?callback=?&id=" + agile_id.get() + "&" + params;

	// Callback
	agile_json(agile_url, callback);
}

/**
 * Remove tags from contact based on email
 * @param tags {String}
 * 				tags to be removed
 * @param callback	
 * 				callback function for agile_removeTag
 * @param email {String}
 * 				email of the contact
 */
function agile_removeTag(tags, callback, email)
{
	if (!tags)
	{
		return; // No tags found
	}

	if (!email) // Check if email is passed else get it from cookie
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	var params = "email={0}&tags={1}".format(encodeURIComponent(email), encodeURIComponent(tags));

	// Post
	var agile_url = agile_id.getURL() + "/contacts/remove-tags?callback=?&id=" + agile_id.get() + "&" + params;

	// Callback
	agile_json(agile_url, callback);
}

/**
 * Get tags based on contact email
 * @param callback
 * 				callback function for agile_getTag
 * @param email
 * 				email of the contact
 */
function agile_getTags(callback, email)
{
	if(!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	
	// Get
	var agile_url = agile_id.getURL() + "/contacts/get-tags?callback=?&id=" + agile_id.get() + "&" + "email={0}".format(encodeURIComponent(email));
	
	// Callback
	agile_json(agile_url, callback);
}/**
 * agile_tasks.js deals with functions to add or get task based on contact email
 * 
 * @module stats
 */

/**
 * Add a task to contact based on email 
 * @param data {Object}
 *            data consists of type example : CALL/EMAIL/FOLLOW_UP/MEETING/MILESTONE/SEND/TWEET 
 *            priority type example : HIGH/NORMAL/LOW, subject of task etc
 * @param callback
 *            callback for addTask function
 * @param email {String}
 *            email of the contact
 */
function agile_addTask(data, callback, email)
{
	// Check if email is passed else get email from cookie
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	var params = "task={0}&email={1}".format(encodeURIComponent(JSON.stringify(data)), encodeURIComponent(email));

	// Get
	var agile_url = agile_id.getURL() + "/task?callback=?&id=" + agile_id.get() + "&" + params;
	
	// Callback
	agile_json(agile_url, callback);
}

/**
* Get tasks of contact based on email
* 
* @param email {String}
* 						email of the contact
* 
* @return callback
* 					callback function for getTask
*/
function agile_getTasks(callback, email)
{
	// Check if email is passed else get email from cookie
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	
	// Get
	var agile_url = agile_id.getURL() + "/contacts/get-tasks?callback=?&id=" + agile_id.get() + "&" + "email={0}".format(encodeURIComponent(email));
	
	// Callback
	agile_json(agile_url, callback);
}/**
 * Checks if guid, session_id are assigned else sets them by calling get() from
 * agile_guid.js and agile_session.js. Gets agile_id, and namespace by calling
 * agile_id.getNamespace() and agile_id.get(). Captures document.referrer if the
 * session is new.
 * 
 * @param callback
 *            callback function for trackpageview
 * @returns params
 */
function agile_trackPageview(callback)
{
	// Get guid
	var guid = agile_guid.get();

	// Get Session-id
	var session_id = agile_session.get();

	// Current url
	var url = document.location.href;
	if (url !== undefined && url != null)
		url = encodeURIComponent(url);
	else
		url = "";

	// Get agile_id
	var agile = agile_id.get();
	var params = "";

	// If it is a new session
	if (agile_session.new_session)
	{
		// Set the referrer
		var document_referrer = document.referrer;
		if (document_referrer !== undefined && document_referrer != null && document_referrer != "null")
			document_referrer = encodeURIComponent(document_referrer);
		else
			document_referrer = "";
		params = "guid={0}&sid={1}&url={2}&agile={3}&new=1&ref={4}".format(guid, session_id, url, agile, document_referrer);
	}
	else
		params = "guid={0}&sid={1}&url={2}&agile={3}".format(guid, session_id, url, agile);

	if (agile_guid.get_email())

		params += "&email=" + encodeURIComponent(agile_guid.get_email()); // get email			

	var agile_url = "https://" + agile_id.getNamespace() + ".agilecrm.com/stats?callback=?&" + params;

	// Callback
	agile_json(agile_url, callback);
}/**
 * Cookie.js deals with functions used to create, read and erase a cookie.
 * @module jscore
 */

/**
 * Used to read a particular variable's value from document.cookie
 * 
 * @param name
 *            the name of the cookie variable to read example :
 *            agile-crm-session_start_time
 * @returns value of the cookie variable else returns null
 */
function agile_read_cookie(name)
{
	// Add Widget Id to cookie name to differentiate sites
	name = agile_id.get() + "-" + name;

	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for ( var i = 0; i < ca.length; i++)
	{
		var c = ca[i];

		// Check for ' ' and remove to get to string c
		while (c.charAt(0) == ' ')
			c = c.substring(1, c.length);

		// Check if nameEQ starts with c, if yes unescape and return its value
		if (c.indexOf(nameEQ) == 0)
			return unescape(c.substring(nameEQ.length, c.length));
	}
	return null;
}

/**
 * Creates a cookie variable with the given name, value and expire time in days
 * 
 * @param name
 *            name of the variable example : agile-email etc.
 * @param value
 *            value of the variable example: agilecrm@example.com
 * @param days
 *            time in days before the variable expires example : 15*365
 * @returns cookie
 */
function agile_create_cookie(name, value, days)
{
	// Add Widget Id to cookie name to differentiate sites
	name = agile_id.get() + "-" + name;

	// If days is not equal to null, undefined or ""
	if (days)
	{
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}
	else

		// If days is null, undefined or "" set expires as ""
		var expires = "";
	document.cookie = name + "=" + escape(value) + expires + "; path=/";
}
function agile_enable_console_logging()
{
	// Added debug dummy function

	var debugging = false; // or true
	if (typeof console === "undefined" || !debugging)
	{
		console = { log : function()
		{
		}, error : function()
		{
		} };
	}
	if (typeof (console.log) === "undefined" || !debugging)
	{
		console.log = function()
		{
			return 0;
		};
	}
	if (typeof (console.error) === "undefined" || !debugging)
	{
		console.error = function()
		{
			return 0;
		};
	}
}