/**
 * agile_account.js deals with functions to set, get agile_id getURL,
 * getNamespace and set agile_setAccount
 * 
 * @module stats
 */

var agile_id = {

// sets the agile_id, id = api key, namespace = account owner domain name
set : function(id, namespace)
{
	this.id = id;
	this.namespace = namespace;
	console.log(id);
	console.log(namespace);
},
get : function()
{ 
	// returns the id of the contact
	console.log("get id" + this.id);
	return this.id;
}, 
getURL : function()
{ 
	// returns the url corresponding to the namespace
	if (!this.namespace || this.namespace == "localhost")
		return "http://localhost:8888/core/js/api";
	else
		return "https://" + this.namespace + ".agilecrm.com/core/js/api";
}, 
getNamespace : function()
{
	return this.namespace; // returns the namespace by id
} };

function agile_setAccount(id, namespace)
{
	// sets the contact account with passed id and namespace
	console.log("Setting account " + id + " with namespace " + namespace);
	agile_id.set(id, namespace);
}
/**
 * agile_api.js deals with the _agile object used to define the api calls
 * 
 * @module stats
 */
var _agile = {

set_account : function(APIKey, domain)
{
	agile_setAccount(APIKey, domain);	//set account
}, 
set_email : function(email)
{
	agile_setEmail(email);				// set contact email
}, 
track_page_view : function(callback)
{
	agile_trackPageview(callback);		// track a particular page
}, 
create_contact : function(properties, callback)
{
	agile_createContact(properties, callback);	//create a contact
}, 
delete_contact : function(email, callback)
{
	agile_deleteContact(email, callback);		//delete a contact
}, 
add_tag : function(tags, callback, email)
{
	agile_addTag(tags, callback, email);	// add tags
}, 
remove_tag : function(tags, callback, email)
{
	agile_removeTag(tags, callback, email);	//remove tags
}, 
add_score : function(score, callback, email)
{
	agile_addScore(score, callback, email);		//add score to contact
}, 
subtract_score : function(score, callback, email)
{
	agile_subtractScore(score, callback, email);	//subtract score from contact
}, 
add_note : function(subject, description, callback, email)
{
	agile_addNote(subject, description, callback, email); //add note to contact
},
add_property : function(name, id, callback, email)
{
	agile_addProperty(name, id, callback, email);	//add or update property to contact
},
add_task : function(data, callback, email)
{
	agile_addTask(data, callback, email);	// add a to do
},
add_deal : function(data, callback, email)
{
	agile_addDeal(data, callback, email);	// add a opportunity
} };/**
 * agile_contact.js deals with the functions used to create, get,
 * and delete the contact.
 * 
 * @module stats
 */

/**
 * Creates a contact with the following properties
 * 
 * @param data
 *            example : {tags:[tag1, tag2], properties:[{name:first_name, value: agile}, {name: last_name, value: crm}]
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
			// add tags to properties array
			properties.push(agile_propertyJSON(key, data[key]));
		}
	}

	var original_ref = "original_ref";
	properties.push(agile_propertyJSON(original_ref, agile_read_cookie(agile_guid.cookie_original_ref)));

	// creating json object and appending properties
	var model = {};
	model.properties = properties;
	console.log(model);
	if (data["tags"])
	{
		var tags = data["tags"];
		var tags_string = tags.trim().replace("/ /g", " ");

		// Replace ,space with ,
		tags_string = tags.replace("/, /g", ",");

		// Splitting tags string at ,
		model.tags = tags_string.split(",");
	}

	// var params = "contact={0}&tags={1}".format(encodeURIComponent(data), encodeURIComponent(JSON.stringify(tags)));
	// Get
	var agile_url = agile_id.getURL() + "/contacts?callback=?&id=" + agile_id.get() + "&contact=" + encodeURIComponent(JSON.stringify(model));

	// callback
	agile_json(agile_url, callback, data);
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
	var agile_url = agile_id.getURL() + "/contact/delete?callback=?&id=" + agile_id.get() + "&email=" + encodeURIComponent(email);

	// callback
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
	var params = "email={0}".format(encodeURIComponent(email));
	console.log(agile_id);
	console.log(agile_id.getURL());
	console.log(agile_id.get());

	// Get
	var agile_url = agile_id.getURL() + "/contact/email?callback=?&id=" + agile_id.get() + "&" + params;

	// callback
	agile_json(agile_url, callback);
}
/**
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

function agile_json(URL, callback, data)
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
		if (callback && typeof (callback) === "function")
		{
			callback && callback(data);
		}
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
 * agile_deals.js deals with function to add a deal to a contact based on the email
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
	// if email is not passed get it from cookie
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
	
	// callback
	agile_json(agile_url, callback, data);
}
/**
 * agile_email.js deals with function agile_setEmail which reads and checks if
 * email is present in cookie and if email passed is new email then sets it, else
 * resets the agile_session.
 * 
 * @param email
 *            email of the contact
 */
function agile_setEmail(email)
{
	console.log("Setting email " + email);
	agile_guid.set_email(email);
}var agile_guid = { 
init : function()
{
	this.cookie_name = 'agile-crm-guid';
	this.cookie_email = 'agile-email';
	this.cookie_original_ref = 'agile-original-referrer';
}, 
random : function()
{
	var S4 = function()
	{
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};
	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}, 
get : function()
{
	var guid = agile_read_cookie(this.cookie_name);
	if (!guid)
		guid = this.generate();
	return guid;
}, 
generate : function()
{
	console.log("Generating new guid " + this.cookie_name);
	guid = this.random();
	agile_create_cookie(this.cookie_name, guid, 365 * 5);

	// first referrer set
	this.set_original_referrer();
	return guid;
}, 
reset : function()
{
	agile_create_cookie(this.cookie_name, "", -1);
}, 
set_email : function(new_email)
{
	// retrieve from cookie - set it only if it is different
	var email = agile_read_cookie(this.cookie_email);
	if (!email || (email != new_email))
	{
		this.email = new_email;

		// Reset Guid and session uid if old email is there
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
 * agile_notes deals with function to add a note with subject, 
 * description as parameters to contact by email
 * 
 * @param subject
 * 				subject field of the note
 * @param description
 * 				content of the note
 * @param callback
 * 				callback for addNote function
 * @param email
 * 				email of the contact
 */
function agile_addNote(subject, description, callback, email)
{
	//check if email is passed, else get from cookie
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	
	//converting the parameters to json object
	var data = {};
	data.subject = subject;
	data.description = description;

	var params = "data={0}&email={1}".format(encodeURIComponent(JSON.stringify(data)), encodeURIComponent(email));

	// Get
	var agile_url = agile_id.getURL() + "/contacts/add-note?callback=?&id=" + agile_id.get() + "&" + params;
	console.log(agile_url);
	
	//callback
	agile_json(agile_url, callback, data);
}/**
 * agile_property deals with function to add a property to 
 * contact based on the property name and email of contact
 * @param name
 * 				name of the property to be added example : email etc.
 * @param id
 * 				value of the property to be added example : clickdesk@example.com
 * @param callback
 * 				callback for addProperty function
 * @param email
 * 				email of the contact, property should be added to
 */
function agile_addProperty(name, id, callback, email)
{
	//check if email passed as parameter, else get from cookie
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	
	//convert parameters to json object data
	var data = {};
	data.name = name;
	data.value = id;

	var params = "data={0}&email={1}".format(encodeURIComponent(JSON.stringify(data)), encodeURIComponent(email));

	var agile_url = agile_id.getURL() + "/contacts/add-property?callback=?&id=" + agile_id.get() + "&" + params;
	
	//callback
	agile_json(agile_url, callback);
}/**
 * agile_score.js deals with functions to add or substract score from the
 * contact fetched based on email
 * 
 * @param score
 *            score to be added or subtracted from contact
 * @param callback
 *            callback function for addSore or subtractScore
 * @param email
 *            email of the contact
 */
function agile_addScore(score, callback, email)
{
	// if score is not passed return
	if (!score)
		return;
	
	// check if email is passed else get it from cookie
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
	
	// callback
	agile_json(agile_url, callback);
}

function agile_subtractScore(score, callback, email)
{
	// if score is not passed return
	if (!score)
		return;
	
	// check if email is passed else get it from cookie
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
	
	// callback
	agile_json(agile_url, callback);
}
var agile_session = { 
init : function()
{
	this.cookie_name = 'agile-crm-session_id';
	this.cookie_start_time = 'agile-crm-session_start_time';
	this.cookie_duration_secs = 60 * 1000;
	this.new_session = false;

}, 
random : function()
{
	var S4 = function()
	{
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};
	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}, 
get : function()
{
	var session_id = agile_read_cookie(this.cookie_name);
	if (!session_id)
		return this.generate();

	// Check if it is valid for 1 hr
	var prev_session_start_time = agile_read_cookie(this.cookie_start_time);
	var current_time_secs = new Date().getUTCSeconds();
	if ((current_time_secs < prev_session_start_time) || (current_time_secs > (prev_session_start_time + this.cookie_duration_secs)))
	{
		console.log("session expired");
		return this.generate();
	}

	return session_id;
}, 
generate : function()
{
	// Create New Session - store start date and time in cookie
	console.log("Creating new session");
	var session_id = this.random();
	agile_create_cookie(this.cookie_name, session_id, 0);
	agile_create_cookie(this.cookie_start_time, new Date().getUTCSeconds(), 0);
	this.new_session = true;
	return session_id;
}, 
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
 * Checks and returns parameters tags and email as params
 * @param tags
 * 				tags to be added to the contact
 * @param email
 * 				email of the contact
 * @returns
 * 			params
 */
function agile_getTagsData(tags, email)
{
	if (!tags)
	{
		return; // No tags found
	}

	if (!email) // check if email is passed else get it from cookie
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	var params = "email={0}&tags={1}".format(encodeURIComponent(email), encodeURIComponent(tags));

	return params;
}
/**
 * Add tags to contact based on email
 * @param tags
 * 			   tags to be added to contact
 * @param callback
 * 				callback for agile_addTag
 * @param email
 * 				email of the contact
 */
function agile_addTag(tags, callback, email)
{
	var params = agile_getTagsData(tags, email);
	if (!params)	//if no params return 
		return;

	// Post
	var agile_url = agile_id.getURL() + "/contacts/add-tags?callback=?&id=" + agile_id.get() + "&" + params;
	
	//callback
	agile_json(agile_url, callback);
}

function agile_removeTag(tags, callback, email)
{
	var params = agile_getTagsData(tags, email);
	if (!params)	//if no params return
		return;

	// Post
	var agile_url = agile_id.getURL() + "/contacts/remove-tags?callback=?&id=" + agile_id.get() + "&" + params;
	
	//callback
	agile_json(agile_url, callback);
}
/**
 * agile_tasks.js deals with function to add task to contact based on email
 * 
 * @param data
 *            data consists of type example : CALL/EMAIL/FOLLOW_UP/MEETING/MILESTONE/SEND/TWEET 
 *            priority type example : HIGH/NORMAL/LOW, subject of task etc
 * @param callback
 *            callback for addTask function
 * @param email
 *            email of the contact
 * @module stats
 */
function agile_addTask(data, callback, email)
{
	// check if email is passed else get email from cookie
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
	
	// callback
	agile_json(agile_url, callback, data);
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
	// get Guid
	var guid = agile_guid.get();

	// get Session-id
	var session_id = agile_session.get();

	// Current url
	var url = document.location.href;
	console.log(url);
	if (url !== undefined && url != null)
		url = encodeURIComponent(url);
	else
		url = "";
	
	// Get agile_id
	var agile = agile_id.get();

	var params = "";
	console.log("New session " + agile_session.new_session);

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
		params += "&email=" + encodeURIComponent(agile_guid.get_email()); // get
																			// email

	var agile_url = "https://" + agile_id.getNamespace() + ".agilecrm.com/stats?callback=?&" + params;
	
	// callback
	agile_json(agile_url, callback);
}
/**
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
		
		// check for ' ' and remove to get to string c
		while (c.charAt(0) == ' ')
			c = c.substring(1, c.length);
		
		// check if nameEQ starts with c, if yes unescape and return its value
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
	
	// if days is not equal to null, undefined or ""
	if (days)
	{
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}
	else
		
		// if days is null, undefined or "" set expires as ""
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