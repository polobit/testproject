/**
 * Adds domain and loggedin date in contact in our domain
 */
function add_custom_fields_to_our_domain()
{
	// Gets domain property from contact
	var domain_custom_field = getProperty(Agile_Contact.properties, 'domain');

	// If domain custom field doesn't exists or value of  and its value is not current domain
	if (!domain_custom_field || domain_custom_field != CURRENT_DOMAIN_USER["domain"])
	{
		// Add custom property to contact
		_agile.add_property(create_contact_custom_field("domain", CURRENT_DOMAIN_USER["domain"], "CUSTOM"));
	}

	// Gets current time, and updates the last loggedin time.
	var date_object = new Date();
	var date = date_object.getUTCMonth() + "/" + date_object.getUTCDay() + "/" + date_object.getUTCFullYear();

	// Gets logged in time property.
	var loggedin_time_property = getProperty(Agile_Contact.properties, 'Last Login');

	// If loggedin time is defined and it is not equal to current date then it is updated
	if (loggedin_time_property && loggedin_time_property.value == date)
		return;
	
	if(!loggedin_time_property)
	{
		loggedin_time_property = create_contact_custom_field("Last Login", date, 'CUSTOM'); 
	} 
	
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

	return json;

}