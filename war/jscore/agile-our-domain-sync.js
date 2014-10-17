/**
 * Tags
 */
var CANCELED = "Canceled";
var SIGN_UP = "Signup";
var CAMPAIGN_TAG = "Campaigns";
var CODE_SETUP_TAG = "Code setup";
var IMPORT_TAG = "Import";
var SOCIAL_TAG = "Social";
var WIDGET_TAG = "Widgets";
var DOMAIN_COOKIE_FOR_WEBSITE = "_agile_login_domain"

// Subject for account cancellation note
var ACCOUNT_CANCELED_NOTE_SUBJECT = "Account Canceled";

// Account cancellation cusom field
var ACCOUNT_CANCELED_CUSTOM_FIELD_NAME = "Cancel Reason";

/**
 * Adds domain and loggedin date in contact in our domain
 */
function add_custom_fields_to_our_domain()
{
	// Gets domain property from contact
	var domain_custom_field = getProperty(Agile_Contact.properties, 'Domain');

	// If domain custom field doesn't exists or value of and its value is not
	// current domain
	if (!domain_custom_field || domain_custom_field.value != CURRENT_DOMAIN_USER["domain"])
	{
		// Add custom property to contact
		_agile.add_property(create_contact_custom_field("Domain", CURRENT_DOMAIN_USER["domain"], "CUSTOM"), function(data)
		{
			add_tag_our_domain(SIGN_UP, function()
			{
				add_current_loggedin_time();
			})

		});
		return;
	}

	add_tag_our_domain(SIGN_UP, function()
	{
		add_current_loggedin_time();
	})
}

/**
 * Checks if logged in time is added to contact in 'our' domain. If it is added
 * and not value is not equal to current loggedin date, then field is updated
 */
function add_current_loggedin_time()
{// Gets current time, and updates the last loggedin time.
	var current_date_object = new Date();
	var current_date_string = current_date_object.getUTCMonth() + 1 + "/" + current_date_object.getUTCDate() + "/" + current_date_object.getUTCFullYear();

	console.log(parseInt(current_date_object.getTime() / 1000));

	// Gets logged in time property.
	var loggedin_time_property = getProperty(Agile_Contact.properties, 'Last login');
	var existing_date_string = "";

	// To whether custom is new or old.
	var is_new_customer = true;
	if (loggedin_time_property)
	{
		var existing_date_object = new Date(parseFloat(loggedin_time_property.value) * 1000);
		existing_date_string = existing_date_object.getUTCMonth() + 1 + "/" + existing_date_object.getUTCDate() + "/" + existing_date_object.getUTCFullYear();
		is_new_customer = false;
	}

	// If loggedin time is defined and it is not equal to current date then it
	// is updated
	if (existing_date_string && existing_date_string == current_date_string)
		return;

	loggedin_time_property = create_contact_custom_field("Last login", parseInt(current_date_object.getTime() / 1000), 'CUSTOM');

	_agile.add_property(loggedin_time_property, function(data)
	{
		Agile_Contact = data;

		// Adds timezone if customer is new
		if (is_new_customer)
			add_timezone_tag();
	});
}

function create_contact_custom_field(name, value, type, subtype)
{
	if (!name)
		return;

	var json = {};
	json["name"] = name;
	json["value"] = value;
	json["subtype"] = type;

	console.log(value);
	return json;

}

function add_account_canceled_info(info, callback)
{
	var custom_field = create_contact_custom_field(ACCOUNT_CANCELED_CUSTOM_FIELD_NAME, info["reason"], 'CUSTOM');
	_agile.add_property(custom_field, function(data)
	{
		add_tag_our_domain(CANCELED, function(data)
		{

			if (info["reason_info"])
			{
				var note = {};
				note.subject = ACCOUNT_CANCELED_NOTE_SUBJECT;
				note.description = info["reason_info"];

				_agile.add_note(note, function(data)
				{
					console.log(data);
					Agile_Contact = data;

					if (callback && typeof (callback) === "function")
					{
						callback();
					}

				});
				return;
			}

			if (callback && typeof (callback) === "function")
			{
				callback();
			}

		});
	});
}

/**
 * adds referral info as a note while adding contact as a note in our domain
 */

function add_referrar_info_as_note()
{
	var utmsource = readCookie("_agile_utm_source");
	var utmcampaign = readCookie("_agile_utm_campaign");
	var utmmedium = readCookie("_agile_utm_medium");
	var utmreferencedomain = readCookie("agile_reference_domain");
	if (utmsource && utmcampaign && utmmedium && utmreferencedomain)
	{
		var note = {};
		note.subject = "Referrer";
		note.description = "Source - "+ utmsource +"\n Campaign -  "+ utmcampaign +"\n Medium - " + utmmedium + "\n Reference Domain -" + utmreferencedomain;

		_agile.add_note(note, function(data)
		{
			console.log(data);
			Agile_Contact = data;

		});
	}
}

// add GMT tag for user who is in between 4am to 6pm GMT
function add_timezone_tag()
{
	var date = new Date();
	var startTime = date.getUTCHours();
	if (startTime >= 3 && startTime <= 15)
	{
		add_tag_our_domain("GMT");
	}
}

function our_domain_set_account()
{
	// If it is local server then add contacts to local domain instead of
	// our domain
	if (LOCAL_SERVER)
		_agile.set_account('7n7762stfek4hj61jnpce7uedi', 'local');

	else
		_agile.set_account('td2h2iv4njd4mbalruce18q7n4', 'our');

	_agile.set_email(CURRENT_DOMAIN_USER['email']);

	// Track page view code
	_agile.track_page_view();
}
function our_domain_sync()
{

	try
	{

		our_domain_set_account();

		var domain = readCookie(DOMAIN_COOKIE_FOR_WEBSITE);

		// Sets different cookie if user logs into different domain
		if (!domain || domain != CURRENT_DOMAIN_USER["domain"])
			createCookieInAllAgileSubdomains(DOMAIN_COOKIE_FOR_WEBSITE, CURRENT_DOMAIN_USER["domain"]);

		get_contact_from_our_domain(function(data)
		{
			// Shows noty
			// set_profile_noty();
			Agile_Contact = data;

			// Adds signup tag, if it is not added previously.
			// set_profile_noty();
			add_custom_fields_to_our_domain();
		
			if (CURRENT_DOMAIN_USER['is_account_owner'])
			{
				add_tag_our_domain("Domain Owner");

			}
			initWebrules();
		}, function(data)
		{
			var name = CURRENT_DOMAIN_USER['name'];
			
			//var first_name = name, last_name = name;
			name = name.trim();
			var first_name = name.split(" ")[0].trim();
			var last_name  = (first_name.length < name.length) ? name.substring(first_name.length + 1).trim() : '';
			
			// Creates a new contact and assigns it to global value
			_agile.create_contact({ "email" : CURRENT_DOMAIN_USER['email'], "first_name" : first_name, "last_name" : last_name }, function(data)
			{
				Agile_Contact = data;
				// Shows noty
				// set_profile_noty();
				add_custom_fields_to_our_domain();
				initWebrules();
				add_referrar_info_as_note();
			});

		})
		// Gets contact based on the the email of the user logged in

	}
	catch (err)
	{

	}
}

function get_contact_from_our_domain(successCallback, errorCallback)
{

	// Gets contact based on the the email of the user logged in
	agile_getContact(CURRENT_DOMAIN_USER['email'], { success : function(data)
	{
		Agile_Contact = data;
		if (successCallback && typeof (successCallback) === "function")
			successCallback(data);
	}, error : function(data)
	{
		if (errorCallback && typeof (errorCallback) === "function")
			errorCallback(data);
	} })

}

function add_signup_tag(callback)
{
	if (!Agile_Contact.tags || Agile_Contact.tags.indexOf(SIGN_UP) < 0)
	{
		add_tag_our_domain(SIGN_UP, function(data)
		{
			// Calling to add custom fields here so avoid data loss
			// due to asyn
			// requests
			add_custom_fields_to_our_domain();

			if (callback && typeof (callback) === "function")
			{
				callback();
			}
		})
		return;
	}

	// Calling to add custom fields here so avoid data loss due to asyn requests
	add_custom_fields_to_our_domain();
}
function hasTagInContact(tag)
{
	if (!tag)
		return false;

	if (Agile_Contact && (!Agile_Contact.tags || Agile_Contact.tags.indexOf(tag) < 0))
		return false;

	return true;

}
function add_tag_our_domain(tag, callback)
{
	if (hasTagInContact(tag))
	{
		if (callback && typeof (callback) === "function")
		{
			callback(Agile_Contact);
		}
		return;
	}

	_agile.add_tag(tag, function(data)
	{
		Agile_Contact = data;

		if (callback && typeof (callback) === "function")
		{
			callback(data);
		}
	});
}

function setup_our_domain_sync()
{
	our_domain_sync();
}

/**
 * Adds tag to 'OUR' domain.
 * 
 * @param tag
 */
function addTagAgile(tag)
{
	// Checks if tag is already available.
	if (checkTagAgile(tag))
		return;

	// Adds tag
	_agile.add_tag(tag, function(data)
	{
		Agile_Contact = data;
		if (!checkTagAgile(tag))
			Agile_Contact.tags.push(tag)
			// set_profile_noty();
	});
}

// Checks if tag exists
function checkTagAgile(tag)
{

	console.log(Agile_Contact);
	if (Agile_Contact && Agile_Contact.tags)
		return Agile_Contact.tags.indexOf(tag) > -1;

	return false;
}

var GLOBAL_WEBRULE_FLAG;
function initWebrules()
{
	_agile_execute_web_rules();
	GLOBAL_WEBRULE_FLAG = true;
}

function add_properties_from_popup(phone_number, company_size)
{
	_agile.add_property(create_contact_custom_field("Company Size", company_size, "CUSTOM"), function(data)
	{
		_agile.add_property(create_contact_custom_field("phone", phone_number, "SYSTEM", "home"), function(data)
		{

			console.log(data);
			_agile_contact = data;
			console.log(_agile_contact);
			window.setTimeout(initWebrules, 4000);

		});
	});
}

function add_property(name, value, type, callback)
{
	// alert(Agile_Contact.properties);
	var property = getProperty(Agile_Contact.properties, name);
	if (property && property.value == value && type == property.type)
	{
		callback(Agile_Contact);
		return false;

	}
	_agile.add_property(create_contact_custom_field(name, value, type), function(data)
	{
		Agile_Contact = data;
		_agile_contact = data;

		if (callback && typeof callback == "function")
			callback(data);
	});
}

/**
 * adds user info as a note to account owner when user created called from
 * user-add route
 */
function add_created_user_info_as_note_to_owner(owner, callback)
{
		var note = {};
		note.subject = "User created";
		note.description = "Domain - " + owner['domain']+"\n User Email -  " + owner['created_user_email'];
		_agile.add_note(note, function(data)
		{
			if (callback && typeof callback == "function")
				callback(data);

		},owner['email']);
		
	
}
