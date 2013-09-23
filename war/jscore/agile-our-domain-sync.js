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
	var date_object = new Date();
	var date = date_object.getUTCMonth() + "/" + date_object.getUTCDate() + "/" + date_object.getUTCFullYear();

	console.log(date);
	// Gets logged in time property.
	var loggedin_time_property = getProperty(Agile_Contact.properties, 'Last login');

	// If loggedin time is defined and it is not equal to current date then it
	// is updated
	if (loggedin_time_property && loggedin_time_property.value == date)
		return;

	loggedin_time_property = create_contact_custom_field("Last login", date, 'CUSTOM');

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
		agile_getContact(CURRENT_DOMAIN_USER['email'], function(data)
		{
			Agile_Contact = data;

			// If contact does not exist, new contact is created
			// considering it is a new contact
			if (!Agile_Contact["id"])
			{
				var name = CURRENT_DOMAIN_USER['name'];
				var first_name = name, last_name = name;

				// Split name into first and last name
				if (name.indexOf(' '))
				{
					first_name = name.substr(0, name.indexOf(' '));
					last_name = name.substr(name.indexOf(' ') + 1);
				}

				// Creates a new contact and assigns it to global value
				_agile.create_contact({ "email" : CURRENT_DOMAIN_USER['email'], "first_name" : first_name, "last_name" : last_name, "tags" : "Signup" },
						function(data)
						{
							Agile_Contact = data;
							// Shows noty
							set_profile_noty();
							add_custom_fields_to_our_domain();
						});

				return;
			}
			
			// Shows noty
			set_profile_noty();
			
			// Adds signup tag, if it is not added previously.
			add_signup_tag();
		});
	}
	catch (err)
	{

	}
}

function add_signup_tag(callback)
{
	if (Agile_Contact.tags || Agile_Contact.tags.indexOf("Signup") < 0)
	{
		_agile.add_tag("Signup", function(data)
		{
			Agile_Contact = data;

			if (callback && typeof (callback) === "function")
			{
				callback();
			}
			// Calling to add custom fields here so avoid data loss due to asyn
			// requests
			add_custom_fields_to_our_domain();
		});

		return;
	}

	// Calling to add custom fields here so avoid data loss due to asyn requests
	add_custom_fields_to_our_domain();
}

function setup_our_domain_sync()
{
	our_domain_sync();
}
