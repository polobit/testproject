function _agile_get_translated_val(module_name, key){

	if(typeof _Agile_Resources_Json === "undefined")
		  _Agile_Resources_Json = {};

	if(!key)
		return _Agile_Resources_Json[module_name];
		
	if(!_Agile_Resources_Json[module_name])
	    return "";

	return _Agile_Resources_Json[module_name][key].replace("&#39;","'");
}

$(function(){
	try{
		var jScript = Handlebars.templates["agile-localization-template"]({});
      	$('body').append('<script type="text/javascript">' + jScript + '<\/script>');
	}catch(e){} 
});
