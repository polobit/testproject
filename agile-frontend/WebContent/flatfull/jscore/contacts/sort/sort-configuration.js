var agile_contact_sort_configuration = [

	buildProperty("Created Date", "created_time"),

	// score 
	buildProperty("Score", "lead_score"),

	// Star value
	buildProperty("Starred", "star_value", "-star_value"),


	// First name
	buildProperty("First Name", "first_name"),

	// Last name
	buildProperty("Last Name", "last_name"),

	// Last contacted
	buildProperty("Contacted Date", "last_contacted")
];

function buildProperty (field_label, field_value)
{
	var property = {
		"id" : field_value,
		"field_label" : field_label,
		"field_value" : field_value,	
		"search_key" : field_value
	}

	return property;
}

var sort_configuration = {
	getContactSortableFields : function()
	{
		return agile_contact_sort_configuration;
	},
	getCustomFieldSortableFields : function()
	{

	}
};