function  _agile_get_contact_display_name(first_name, last_name, prop_key){

	var user_contact_display_type = _agile_get_custom_contact_display_type();

	if(prop_key == "last_name" && last_name == "")

		return "";

	if(prop_key){			
		if(user_contact_display_type == "ftl")
			return (prop_key == "first_name") ? first_name : last_name;

		return (prop_key == "first_name") ? last_name : first_name;
	}

	if(user_contact_display_type == "ftl")
    	return first_name + " " + last_name;

    return last_name + " " + first_name;
}

function _agile_get_custom_contact_display_type(){
	return (!CURRENT_USER_PREFS.contactsSwap) ? "ftl" : CURRENT_USER_PREFS.contactsSwap;
}