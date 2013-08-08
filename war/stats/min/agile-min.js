function agile_json(URL, success)
{
	var ud = 'json' + (Math.random() * 100).toString().replace(/\./g, '');
	window[ud] = function(o)
	{
		success && success(o);
	};
	document.getElementsByTagName('body')[0].appendChild((function()
	{
		var s = document.createElement('script');
		s.type = 'text/javascript';
		s.src = URL.replace('callback=?', 'callback=' + ud);
		return s;
	})());
}

function agile_callback(callback, data){
	if (callback && typeof(callback) === "function"){
		callback(data);
	}
}

function agile_setAccount(id, namespace)
{
	console.log("Setting account " + id + " with namespace " + namespace);
	agile_id.set(id, namespace);
}

function agile_setEmail(email)
{
	console.log("Setting email " + email);
	agile_guid.set_email(email);
}

function agile_propertyJSON(name, id, type)
{
	var json = {};

	if (type == undefined)
		json.type = "SYSTEM";
	else
		json.type = type;

	json.name = name;
	json.value = id;
	return json;
}

function agile_createContact(data, callback)
{
	var properties = [];

	for ( var key in data)
	{
		if (data.hasOwnProperty(key) && key != "tags")
		{
			// alert(key + " -> " + p[key]);
			properties.push(agile_propertyJSON(key, data[key]));
		}
	}

	var original_ref = "original_ref";
	properties.push(agile_propertyJSON(original_ref, agile_read_cookie(agile_guid.cookie_original_ref)));

	var model = {};
	model.properties = properties;
	console.log(model);
	if (data["tags"])
	{
		var tags = data["tags"];
		var tags_string = tags.trim().replace("/ /g", " ");

		// Replace ,space with ,
		tags_string = tags.replace("/, /g", ",");

		model.tags = tags_string.split(",");
	}

	// var params = "contact={0}&tags={1}".format(encodeURIComponent(data),
	// encodeURIComponent(JSON.stringify(tags)));
	// Get
	var agile_url = agile_id.getURL() + "/contacts?callback=?&id=" + agile_id.get() + "&contact=" + encodeURIComponent(JSON.stringify(model));

	agile_json(agile_url, agile_callback(callback, data));
}

function agile_deleteContact(email, callback)
{
	var agile_url = agile_id.getURL() + "/contact/delete?callback=?&id=" + agile_id.get() + "&email=" + encodeURIComponent(email);

	agile_json(agile_url, agile_callback(callback, data));
}

function agile_getContact(email, callback)
{
	var params = "email={0}".format(encodeURIComponent(email));
	console.log(agile_id);
	console.log(agile_id.getURL());
	console.log(agile_id.get());
	// Get
	var agile_url = agile_id.getURL() + "/contact/email?callback=?&id=" + agile_id.get() + "&" + params;

	agile_json(agile_url, function(data)
	{
		if (callback && typeof (callback) === "function")
		{
			callback(data);
		}
	});
}

function agile_addNote(email, data, callback)
{
	if (!email.email)
	{
		return;
	}
	var params = "email={0}&note={1}".format(encodeURIComponent(email.email), encodeURIComponent(JSON.stringify(data)));

	// Get
	var agile_url = agile_id.getURL() + "/note?callback=?&id=" + agile_id.get() + "&" + params;
	console.log(agile_url);

	agile_json(agile_url, agile_callback(callback, data));
}

function agile_addTask(email, data, callback)
{
	if (!email.email)
	{
		return;
	}
	var params = "email={0}&task={1}".format(encodeURIComponent(email.email), encodeURIComponent(JSON.stringify(data)));

	// Get
	var agile_url = agile_id.getURL() + "/task?callback=?&id=" + agile_id.get() + "&" + params;

	agile_json(agile_url, agile_callback(callback, data));
}

function agile_addDeal(email, data, callback)
{
	if (!email.email)
	{
		return;
	}

	var params = "email={0}&opportunity={1}".format(encodeURIComponent(email.email), encodeURIComponent(JSON.stringify(data)));

	// Get
	var agile_url = agile_id.getURL() + "/opportunity?callback=?&id=" + agile_id.get() + "&" + params;

	agile_json(agile_url, agile_callback(callback, data));
}

function agile_getTagsData(tags, email)
{
	if (!tags)
	{
		return; // No tags found
	}

	if (!email)
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

function agile_addTag(tags, callback, email)
{
	var params = agile_getTagsData(tags, email);
	if (!params)
		return;

	// Post
	var agile_url = agile_id.getURL() + "/contacts/add-tags?callback=?&id=" + agile_id.get() + "&" + params;

	agile_json(agile_url, agile_callback(callback));
}

function agile_removeTag(tags, callback, email)
{
	var params = agile_getTagsData(tags, email);
	if (!params)
		return;

	// Post
	var agile_url = agile_id.getURL() + "/contacts/remove-tags?callback=?&id=" + agile_id.get() + "&" + params;

	agile_json(agile_url, agile_callback(callback, data));
}

function agile_addScore(score, callback, email)
{
	if (!score)
		return;

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

	agile_json(agile_url, agile_callback(callback));
}

function agile_subtractScore(score, callback, email)
{
	if (!score)
		return;
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

	agile_json(agile_url, agile_callback(callback, data));
}

function agile_addProperty(name, id, callback, email)
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
	var data = {};
	data.name = name;
	data.value = id;

	var params = "data={0}&email={1}".format(encodeURIComponent(JSON.stringify(data)), encodeURIComponent(email));

	var agile_url = agile_id.getURL() + "/contacts/add-property?callback=?&id=" + agile_id.get() + "&" + params;

	agile_json(agile_url, agile_callback(callback, data));
}

String.prototype.format = function()
{
	var args = arguments;
	return this.replace(/{(\d+)}/g, function(match, number)
	{
		return typeof args[number] != 'undefined' ? args[number] : match;
	});
};

function agile_trackPageview(callback)
{
	// Guid
	var guid = agile_guid.get();

	// Session-id
	var session_id = agile_session.get();

	// Page
	var url = document.location.href;
	console.log(url);
	if (url !== undefined && url != null)
		url = encodeURIComponent(url);
	else
		url = "";

	var agile = agile_id.get();

	var params = "";

	console.log("New session " + agile_session.new_session);

	// Get Visitor Info if session is new
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
		params += "&email=" + encodeURIComponent(agile_guid.get_email());

	var agile_url = "https://" + agile_id.getNamespace() + ".agilecrm.com/stats?callback=?&" + params;

	agile_json(agile_url, agile_callback(callback));
	// agile_ajax.send(url, ajax_data);
}

var agile_id = { set : function(id, namespace)
{
	this.id = id;
	this.namespace = namespace;
	console.log(id);
	console.log(namespace);
}, 
get : function()
{
	console.log("get id" + this.id);
	return this.id;
}, 
getURL : function()
{
	if (!this.namespace || this.namespace == "localhost")
		return "http://localhost:8888/core/js/api";
	else
		return "https://" + this.namespace + ".agilecrm.com/core/js/api";
}, 
getNamespace : function()
{
	return this.namespace;
} };

var _agile = { 
		
set_account : function(APIKey, domain)
{
	agile_setAccount(APIKey, domain);
}, 
set_email : function(email)
{
	agile_setEmail(email);
}, 
track_page_view : function(callback)
{
	agile_trackPageview(callback);
}, 
create_contact : function(properties, callback)
{
	agile_createContact(properties, callback);
}, 
delete_contact : function(email, callback)
{
	agile_deleteContact(email, callback);
}, 
add_tag : function(tags, callback, email)
{
	agile_addTag(tags, callback, email);
}, 
remove_tag : function(tags, callback, email)
{
	agile_removeTag(tags, callback, email);
}, 
add_score : function(score, callback, email)
{
	agile_addScore(score, callback, email);
}, 
subtract_score : function(score, callback, email)
{
	agile_subtractScore(score, callback, email);
}, 
add_note : function(email, data, callback)
{
	agile_addNote(email, data, callback);
},
add_property : function(name, id, callback, email)
{
	agile_addProperty(name, id, callback, email);
} };var agile_guid = { init : function()
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

agile_guid.init();var agile_session = { init : function()
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

agile_session.init();// Read Cookie
function agile_read_cookie(name)
{

	// Add Widget Id to cookie name to differentiate sites
	name = agile_id.get() + "-" + name;

	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for ( var i = 0; i < ca.length; i++)
	{
		var c = ca[i];
		while (c.charAt(0) == ' ')
			c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0)
			return unescape(c.substring(nameEQ.length, c.length));
	}
	return null;
}

// Create Cookie
function agile_create_cookie(name, value, days)
{

	// Add Widget Id to cookie name to differentiate sites
	name = agile_id.get() + "-" + name;
	if (days)
	{
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}
	else
		var expires = "";
	document.cookie = name + "=" + escape(value) + expires + "; path=/";

}function agile_enable_console_logging()
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