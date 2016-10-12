/**
 * Contact sorting.
 */
var agile_contact_sort_configuration = [

	buildProperty("{{agile_lng_translate 'misc-keys' 'created_date'}}", "created_time"),
					
	// score 
	buildProperty("{{agile_lng_translate 'contacts-view' 'score'}}", "lead_score"),

	// Star value
	buildProperty("{{agile_lng_translate 'contacts-view' 'star-value'}}", "star_value", "-star_value"),


	// First name
	buildProperty("{{agile_lng_translate 'report-add' 'first-name'}}", "first_name"),

	// Last name
	buildProperty("{{agile_lng_translate 'report-add' 'last-name'}}", "last_name"),

	// Last contacted
	buildProperty("{{agile_lng_translate 'contacts-view' 'contacted_date'}}", "last_contacted")
	
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

	buildProperty(_agile_get_translated_val('contacts-view','created_date'), "created_time"),

	// Star value
	buildProperty(_agile_get_translated_val('contacts-view','star-value'), "star_value"),

	// Name
	buildProperty(_agile_get_translated_val('contacts-view','name'), "name"),
	//Score
	buildProperty(_agile_get_translated_val('contacts-view', 'score'), "lead_score")
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

	buildProperty(_agile_get_translated_val('contacts-view','created_date'), "created_time"),

	buildProperty(_agile_get_translated_val('deal-view','close-date'), "closed_time"),

	buildProperty(_agile_get_translated_val('deal-view','won-date'), "won_time"), 

	buildProperty(_agile_get_translated_val('deal-view','value'), "expected_value")

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