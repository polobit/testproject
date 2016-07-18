function _agile_get_translated_val(module_name, key){
	if(!key)
		return _Agile_Resources_Json[module_name];
		
	if(!_Agile_Resources_Json[module_name])
	    return "";

	return _Agile_Resources_Json[module_name][key];
}