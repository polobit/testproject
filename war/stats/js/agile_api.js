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

function agile_callbackfunction(data)
{
	if (callback && typeof(callback)=== "function") {
		callback(data);}
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

	agile_json(agile_url, function(data)
	{
		if (callback && typeof (callback) === "function")
		{
			callback(data);
		}
	});
}

function agile_deleteContact(email, callback)
{
	var agile_url = agile_id.getURL() + "/contact/delete?callback=?&id=" + agile_id.get() + "&email=" + encodeURIComponent(email);

	agile_json(agile_url, function(data)
	{
		if (callback && typeof (callback) === "function")
		{
			callback(data);
		}
	});
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

	agile_json(agile_url, function(data)
	{
		if (callback && typeof (callback) === "function")
		{
			callback(data);
		}
	});
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

	agile_json(agile_url, function(data)
	{
		if (callback && typeof (callback) === "function")
		{
			callback(data);
		}
	});
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

	agile_json(agile_url, function(data)
	{
		if (callback && typeof (callback) === "function")
		{
			callback(data);
		}
	});
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

	agile_json(agile_url, function(data)
	{
		if (callback && typeof (callback) === "function")
		{
			callback(data);
		}
	});
}

function agile_removeTag(tags, callback, email)
{
	var params = agile_getTagsData(tags, email);
	if (!params)
		return;

	// Post
	var agile_url = agile_id.getURL() + "/contacts/remove-tags?callback=?&id=" + agile_id.get() + "&" + params;

	agile_json(agile_url, function(data)
	{
		if (callback && typeof (callback) === "function")
		{
			callback(data);
		}
	});
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

	agile_json(agile_url, function(data)
	{
		if (callback && typeof (callback) === "function")
		{
			callback(data);
		}
	});

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

	agile_json(agile_url, function(data)
	{
		if (callback && typeof (callback) === "function")
		{
			callback(data);
		}
	});
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

	agile_json(agile_url, function(data)
	{
		if (callback && typeof (callback) === "function")
		{
			callback(data);
		}
	});
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

	agile_json(agile_url, function(data)
	{
		if (callback && typeof (callback) === "function")
		{
			callback(data);
		}
	});
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
} };