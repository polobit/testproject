function initializeRegenerateKeysListeners(){
	$("#api_key_code").off('click').on("click","#api_key_generate_icon", function(e){e.preventDefault(); regenerate_api_key('core/api/api-key/key');});
	$("#jsapi_key_code").off('click').on("click","#jsapi_key_generate_icon", function(e){e.preventDefault(); regenerate_api_key('core/api/api-key/jskey');});
}

function update_admin_settings_api_key_template(){
	$.ajax({
		url : 'core/api/api-key',
		type : 'GET',
		dataType : 'json', 
		success : function(data){

			getTemplate("admin-settings-api-key-model", data, undefined, function(template_ui){
				if(!template_ui)
					  return;

				$("#admin-prefs-tabs-content").html($(template_ui));
			}, null);
		}
	})
}

function regenerate_api_key(url){
	if(confirm("Resetting the API Key will break all existing integrations you may have setup using the current key. Are you sure you want to reset the API key?")){
		$.ajax({
			url : url,
			type : 'POST',
			success : function(){update_admin_settings_api_key_template();}
		})
	}
	else return;
}