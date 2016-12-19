function _agile_get_Upgrade_text(){
	if(!_agile_is_user_from_iphone())
		return "{{agile_lng_translate 'portlets' 'upgrade'}}";

	return "";
}

function _agile_is_user_from_iphone(){
	return IS_IPHONE_APP;
}