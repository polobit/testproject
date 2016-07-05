/**
 * Contact sorting.
 */
var agile_contact_sort_configuration = [

	buildProperty("Created Date", "created_time"),

	// score 
	buildProperty("Score", "lead_score"),

	// Star value
	buildProperty("Star Value", "star_value", "-star_value"),


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

/**
 * Companies sorting.
 */
var agile_company_sort_configuration = [

	buildProperty("Created Date", "created_time"),

	// Star value
	buildProperty("Star Value", "star_value"),

	// Name
	buildProperty("Name", "name"),
	//Score
	buildProperty("Score", "lead_score")
];

var sort_company_configuration = {
	getCompanySortableFields : function()
	{
		return agile_company_sort_configuration;
	},
	getCustomFieldSortableFields : function()
	{

	}
};

/**
 * Deal sorting.
 */
var agile_deal_sort_configuration = [

	buildProperty("Created Date", "created_time"),

	buildProperty("Close Date", "closed_time"),

	buildProperty("Value", "expected_value")
];

var sort_deal_configuration = {
	getDealSortableFields : function()
	{
		return agile_deal_sort_configuration;
	},
	getCustomFieldSortableFields : function()
	{

	}
};