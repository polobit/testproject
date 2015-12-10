/*!AgileCRM*/
//Enables Dummy Console Logging (IE does not have one)
function agile_enable_console_logging() {
   // Added debug dummy function 
    var debugging = true; // or true
    if (typeof console === "undefined" || !debugging) {
        console = {
            log: function () {}
        };
    }
    if (typeof(console.log) === "undefined" || !debugging) {
        console.log = function () {
            return 0;
        };
    }
}


// Read Cookie
function agile_read_cookie(name) {
	
	// Add Widget Id to cookie name to differentiate sites
	name = agile_id.get() + "-" + name;
	
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return unescape(c.substring(nameEQ.length,c.length));
	}
	return null;
}

// Create Cookie
function agile_create_cookie(name, value, days) {
	
	// Add Widget Id to cookie name to differentiate sites
	name = agile_id.get() + "-" + name;
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+escape(value)+expires+"; path=/";
}

var agile_guid =
	{
		init: function()
		{
			this.cookie_name = 'agile-crm-guid';
			this.cookie_email = 'agile-email';
		},
		random: function() {
		    var S4 = function() {
		       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		    };
		    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
		},
		get:function()
		{
			var guid =  agile_read_cookie(this.cookie_name);
			if(!guid)
				guid = this.generate();
			
			return guid;
		},
		generate:function()
		{
			console.log("Generating new guid " + this.cookie_name);
			guid = this.random();
			agile_create_cookie(this.cookie_name, guid, 365*5);
			return guid;
		},
		reset:function()
		{
			agile_create_cookie(this.cookie_name, "", -1);
		},
		set_email: function(new_email)
		{
			// retrieve from cookie - set it only if it is different
			var email = agile_read_cookie(this.cookie_email);
			if(!email || (email != new_email)) 
			{
				this.email = new_email;
				
				// Reset Guid and session uid if old email is there
				if(email)
				{	
					this.reset();
					agile_session.reset();
				}
				
				agile_create_cookie(this.cookie_email, this.email, 365*5);
			}
		},
		get_email: function()
		{
			
			// If email present in the session
			if(this.email)
				return this.email;
			
			// Read from cookie
			var email =  agile_read_cookie(this.cookie_email);
			return email;
		}
	};

agile_guid.init();

var agile_session =
	{
		init: function()
		{
			this.cookie_name = 'agile-crm-session_id';
			this.cookie_start_time = 'agile-crm-session_start_time';
			this.cookie_duration_secs = 60 * 1000;
			this.new_session = false;
			
		},
		random: function() {
		    var S4 = function() {
		       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		    };
		    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
		},
		get:function()
		{
			var session_id = agile_read_cookie(this.cookie_name);
			if(!session_id)
				return this.generate();
			
			// Check if it is valid for 1 hr
			var prev_session_start_time = agile_read_cookie(this.cookie_start_time);
			var current_time_secs = new Date().getUTCSeconds();
			if( (current_time_secs < prev_session_start_time) || (current_time_secs > (prev_session_start_time + this.cookie_duration_secs)))
			{
				console.log("session expired");
				return this.generate();
			}
			
			return session_id;
		},
		generate:function()
		{
			// Create New Session - store start date and time in cookie
			console.log("Creating new session");
			var session_id = this.random();
			agile_create_cookie(this.cookie_name, session_id, 0);
			agile_create_cookie(this.cookie_start_time, new Date().getUTCSeconds(), 0);
			this.new_session = true;
			return session_id;
		},
		reset:function()
		{
			agile_create_cookie(this.cookie_name, "", -1);
			agile_create_cookie(this.cookie_start_time, "", -1);
		}
	};
agile_session.init();

function agile_getJSONP(URL, success){
    var ud = 'json'+(Math.random()*100).toString().replace(/\./g,'');
    window[ud]= function(o){
        success&&success(o);
    };
    document.getElementsByTagName('body')[0].appendChild((function(){
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = URL.replace('callback=?','callback='+ud);
        return s;
    })());
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


function agile_propertyJSON(name, id, type) {
    var json = {};

    if (type == undefined) json.type = "SYSTEM";
    else json.type = type;

    json.name = name;
    json.value = id;
    return json;
}

function agile_createContact(data, tags, callback)
{
	var properties = [];
	 
	 for (var key in data) {
		  if (data.hasOwnProperty(key)) {
		    //alert(key + " -> " + p[key]);
			  properties.push(agile_propertyJSON(key, data[key]));
		  }
		}
	 
	 var model = {};
	 model.properties = properties;
	 //var params = "contact={0}&tags={1}".format(encodeURIComponent(data), encodeURIComponent(JSON.stringify(tags)));
	 // Get
	 var agile_url = agile_id.getURL() + "/contacts?callback=?&id=" + agile_id.get() + "&contact=" + encodeURIComponent(JSON.stringify(model));
	 
	 agile_getJSONP(agile_url, function(data){
	 	   
		 // Execute Callback
		 if (callback && typeof(callback) === "function") {
			 	callback(data);
				}
	 	});
}



function agile_getContact(email, callback)
{
	
	 var params = "email={0}".format(encodeURIComponent(email));
	 // Get
	 var agile_url = agile_id.getURL() + "/contact/email?callback=?&id=" + agile_id.get() + "&" + params ;
	 agile_getJSONP(agile_url, function(data){
	 	  if (callback && typeof(callback) === "function") {
		 	callback(data);
			}
	 	});
}

function agile_addNote(email, data, callback)
{
	if(!email.email)
	{
		console.log("Email not found. Note is not added.");
		return;
	}
	var params = "email={0}&note={1}".format(encodeURIComponent(email.email), encodeURIComponent(JSON.stringify(data)));
	
	 // Get
	 var agile_url = agile_id.getURL() + "/js/note?callback=?&id=" + agile_id.get() + "&" + params ;
	 
	 agile_getJSONP(agile_url, function(data){
		 // Execute Callback
		 if (callback && typeof(callback) === "function") {
			 	callback(data);
				}
	 	});
}

function agile_addTask(email, data, callback)
{
	if(!email.email)
	{
		console.log("Email not found. Task is not added.");
		return;
	}
	var params = "email={0}&task={1}".format(encodeURIComponent(email.email), encodeURIComponent(JSON.stringify(data)));
	
	 // Get
	 var agile_url = agile_id.getURL() + "/js/task?callback=?&id=" + agile_id.get() + "&" + params;
	 	
	 agile_getJSONP(agile_url, function(data){
		 // Execute Callback
		 if (callback && typeof(callback) === "function") {
			 	callback(data);
				}
	 	});
}

function agile_addDeal(email, data, callback)
{
	if(!email.email)
	{
		console.log("Email not found. Deal is not added.");
		return;
	}
	var params = "email={0}&opportunity={1}".format(encodeURIComponent(email.email), encodeURIComponent(JSON.stringify(data)));
	
	 // Get
	 var agile_url = agile_id.getURL() + "/js/opportunity?callback=?&id=" + agile_id.get() + "&" + params;
	 
	 agile_getJSONP(agile_url, function(data){
		 // Execute Callback
		 if (callback && typeof(callback) === "function") {
			 	callback(data);
				}
	 	});
}

function agile_getTagsData(data)
{
	var email = data.email;
	var tags = data.tags;
	if(!tags)
	{
		console.log("Tags are missing. Not adding tag");
		return;
	}

	
	// If email is not there, get it from cookie
	if(!email)
		email = agile_guid.get_email();
	
	if(!email)
	{
		console.log("Email not found. Not adding tag");
		return;
	}
			
	var params = "email={0}&tags={1}".format(encodeURIComponent(email), encodeURIComponent(tags));
	
	return params;

}

function agile_addTag(data, callback)
{
	var params = agile_getTagsData(data);
	if(!params)
		return;
	
	// Post
	 var agile_url = agile_id.getURL() + "/contacts/add-tags?callback=?&id=" + agile_id.get() + "&" + params;
	 
	 agile_getJSONP(agile_url,function(data){
		 // Execute Callback
		 if (callback && typeof(callback) === "function") {
			 	callback(data);
				}
	 	});  
    
}

function agile_removeTag(data, callback)
{
	var params = agile_getTagsData(data);
	if(!params)
		return;
	
	// Post
	 var agile_url = agile_id.getURL() + "/contacts/remove-tags?callback=?&id=" + agile_id.get() + "&" + params;
	 
	 agile_getJSONP(agile_url,function(data){
		 // Execute Callback
		 if (callback && typeof(callback) === "function") {
			 	callback(data);
				}
	 	});  
    
}


String.prototype.format = function() {
	  var args = arguments;
	  return this.replace(/{(\d+)}/g, function(match, number) { 
	    return typeof args[number] != 'undefined'
	      ? args[number]
	      : match
	    ;
	  });
	};

function agile_trackPageview()
{	
 	
 	// Guid
 	var guid = agile_guid.get();
 	
	// Session-id
 	var session_id = agile_session.get();
	
 	// Page
	var url = document.location.href;
 	if(url !== undefined && url != null)
 		url = encodeURIComponent(url);
 	else
 		url = "";
 	
 	var agile = agile_id.get();
 	
 	var params = "";
 	
 	
 	console.log("New session " + agile_session.new_session);
 	
 	// Get Visitor Info if session is new
 	if(agile_session.new_session)
 	{	
 		// Set the referrer
 		var document_referrer = document.referrer;
 		if(document_referrer !== undefined && document_referrer != null && document_referrer != "null")
 			document_referrer = encodeURIComponent(document_referrer); 
 		else
 			document_referrer="";

 		params = "guid={0}&sid={1}&url={2}&agile={3}&new=1&ref={4}".format(guid, session_id, url, agile, document_referrer);
 	}
 	else
 		params = "guid={0}&sid={1}&url={2}&agile={3}".format(guid, session_id, url, agile);
 	
 	if(agile_guid.get_email())
 		params += "&email=" + encodeURIComponent(agile_guid.get_email());
 	
 	var agile_url = "http://stats.agilecrm.com/stats?callback=?&" + params;
 	
 	agile_getJSONP(agile_url,function(data){
 	    var success = data.flag === 'successful';
 	    if(success) {
 	        alert('The POST to abc.com WORKED SUCCESSFULLY');
 	    }
 	});

 	
 	//agile_ajax.send(url, ajax_data);	
}


var agile_id = 
	{
		set: function(id, namespace)
		{
			this.id = id;
			this.namespace = namespace;
		},
		get: function()
		{
			return this.id;
		},
		getURL: function()
		{
			if(this.namespace == "localhost")
				return "http://localhost:8888/core/js/api";
			else
				return "https://" + this.namespace + ".agilecrm.com/core/js/api";
		}
	};

function _agile_execute()
{
	// Enable the console(IE not support console by default)
	agile_enable_console_logging();
	console.log("Initing Agile-crm " + _agile);
	
	// Iterate
	for(i=0; i < _agile.length; i++)
	{
		var args = new Array();
	    for (var j = 1; j < _agile[i].length; j++)
	        args.push(_agile[i][j]);

	    console.log("Executing " + _agile[i][0] + " with " + args);
	    window["agile" + _agile[i][0]].apply(this, args);
	}
}

// Init Function
(function () {  
	_agile_execute();
})();