var agile_contact_sort_configuration = [
	// Created time
	[
		buildProperty("Newest", "created_time", "-created_time", undefined, true),
		buildProperty("Oldest", "created_time", "created_time", undefined, false)
	],

	// score 
	[
	
		buildProperty("Highest Score", "lead_score", "-lead_score", undefined, true),
		buildProperty("Lowest Score", "lead_score", "lead_score", undefined, false)
	],

	// Star value
	[
		buildProperty("Highest Score", "star_value", "-star_value", undefined, true ),
		buildProperty("Lowest Score", "star_value", "star_value", undefined, false)
	],

	//<li><a class="sort" id="sort-by-first_name-desc" data="-first_name" href="#">First Name Desc</a></li>
	//<li><a class="sort" id="sort-by-first_name-asc" data="first_name" href="#">First Name Asc</a></li>
	[
		buildProperty("First Name Desc", "first_name", "-first_name", undefined, true),
		buildProperty("First Name Asc Score", "first_name", "first_name", undefined, false)
	],

	// <li><a class="sort" id="sort-by-last_name-desc" data="-last_name" href="#">Last Name Desc</a></li>
	// <li><a class="sort" id="sort-by-last_name-asc" data="last_name" href="#">Last Name Asc</a></li>
	[
		buildProperty("Last Name Desc", "last_name", "-last_name", undefined, true),
		buildProperty("Last Name Asc", "last_name", "last_name", undefined, false)
	],

	// <li><a class="sort" id="sort-by-last_contacted-desc" data="-last_contacted" href="#">Contacted Date Desc</a></li>
	// <li><a class="sort" id="sort-by-last_contacted-asc" data="last_contacted" href="#">Contacted Date Asc</a></li>
	[
		buildProperty("Contacted Date Desc", "last_contacted", "-last_contacted", undefined, true),
		buildProperty("Contacted Date Asc", "last_contacted", "last_contacted", undefined, true)
	]
	
];

function buildProperty (field_label, field_value, field_key, is_last, desc_order)
{
	var property = {
		"field_label" : field_label,
		"field_value" : field_value,
		"field_key" : field_key,
		"is_last"  : is_last,
		"desc_order" : desc_order

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