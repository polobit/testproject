/**
 * Tags
 */
var CANCELLED = "cancelled";
var SIGN_UP = "Signup";
	
// Subject for account cancellation note
var ACCOUNT_CANCELLED_NOTE_SUBJECT = "Account Cancelled";

// Account cancellation cusom field
var ACCOUNT_CANCELLED_CUSTOM_FIELD_NAME = "Account Cancelled";

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
			add_current_loggedin_time();
		});
		return;
	}

	// Adds current loggedin time
	add_current_loggedin_time();
}

/**
 * Checks if logged in time is added to contact in 'our' domain. If it is added
 * and not value is not equal to current loggedin date, then field is updated
 */
function add_current_loggedin_time()
{
	// Gets current time, and updates the last loggedin time.
	var current_date_object = new Date();
	var current_date_string = current_date_object.getUTCMonth() + 1 + "/" + current_date_object.getUTCDate() + "/" + current_date_object.getUTCFullYear();

	
	// Gets logged in time property.
	var loggedin_time_property = getProperty(Agile_Contact.properties, 'Last login');
	
	var existing_date_string = "";
	if(loggedin_time_property)
		{
		var existing_date_object = new Date(loggedin_time_property.value);
		existing_date_string = existing_date_object.getUTCMonth() + 1 + "/" + existing_date_object.getUTCDate() + "/" + existing_date_object.getUTCFullYear();
		}
	

	// If loggedin time is defined and it is not equal to current date then it
	// is updated
	if (existing_date_string && existing_date_string == current_date_string)
		return;

	loggedin_time_property = create_contact_custom_field("Last login", current_date_object.getTime()/1000, 'CUSTOM');

	_agile.add_property(loggedin_time_property);
}

function create_contact_custom_field(name, value, type, subtype)
{
	if (!name)
		return;

	var json = {};
	json["name"] = name;
	json["value"] = value;
	json["type"] = type;
	json["subtype"] = subtype;

	console.log(value);
	return json;

}

function add_account_cancelled_info(info, callback)
{
	var custom_field = create_contact_custom_field(ACCOUNT_CANCELLED_CUSTOM_FIELD_NAME, info["reason"], 'CUSTOM');
	_agile.add_property(custom_field, function(data) {
		add_tag_our_domain(CANCELLED, function(data){

			if(info["reason_info"])
				{
				var note = {};
				note.subject = ACCOUNT_CANCELLED_NOTE_SUBJECT;
				note.description = info["reason_info"];
				
				_agile.add_note(note, function (data) {
						console.log(data);
						Agile_Contact = data;
						
						if (callback && typeof (callback) === "function")
						{
							callback();
						}
						
			    });
				}
			});
		});
}

function our_domain_sync()
{

	try
	{

		// If it is local server then add contacts to local domain instead of
		// our domain
		if (LOCAL_SERVER)
			_agile.set_account('7n7762stfek4hj61jnpce7uedi', 'local');

		else
			_agile.set_account('td2h2iv4njd4mbalruce18q7n4', 'our');

		_agile.set_email(CURRENT_DOMAIN_USER['email']);

		// Gets contact based on the the email of the user logged in
		agile_getContact(CURRENT_DOMAIN_USER['email'], {
			success: function(data){
				Agile_Contact = data;
				
				// Shows noty
				set_profile_noty();
				
				// Adds signup tag, if it is not added previously.
				add_signup_tag();
				
			}, error: function(data){
				var name = CURRENT_DOMAIN_USER['name'];
				var first_name = name, last_name = name;
				
				// Creates a new contact and assigns it to global value
				_agile.create_contact({ "email" : CURRENT_DOMAIN_USER['email'], "first_name" : first_name, "last_name" : last_name, "tags" : SIGN_UP },
						function(data)
						{
							Agile_Contact = data;
							// Shows noty
							set_profile_noty();
							add_custom_fields_to_our_domain();
						});
			}
		});
	}
	catch (err)
	{

	}
}

function add_signup_tag(callback)
{
	if (!Agile_Contact.tags || Agile_Contact.tags.indexOf(SIGN_UP) < 0)
	{
		console.log("adding tags");
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

function add_tag_our_domain(tag, callback)
{
	_agile.add_tag(tag, function(data)
			{
				Agile_Contact = data;

				if (callback && typeof (callback) === "function")
				{
					callback(data);
				}
			})
}

function setup_our_domain_sync()
{
	our_domain_sync();
}
