function _agile_get_translated_val(module_name, key){

	if(typeof _Agile_Resources_Json === "undefined")
		  _Agile_Resources_Json = {};

	if(!key)
		return _Agile_Resources_Json[module_name];
		
	if(!_Agile_Resources_Json[module_name])
	    return "";
	var value = _Agile_Resources_Json[module_name][key];
	if(!value)
	 return;
	value =  value.replace(/&#39;/gi,"'")
	return value;
}

$(function(){
	try{
		var jScript = Handlebars.templates["agile-localization-template"]({});
      	$('body').append('<script type="text/javascript">' + jScript + '<\/script>');
	}catch(e){} 
});
