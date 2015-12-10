function modalAlert(templateName,message,title){
	
	if(templateName == undefined || message == undefined || title == undefined)
		return;
	var alertJSON = {};
	alertJSON["title"] = title;
	alertJSON["message"] = message;
	
	getTemplate(templateName,alertJSON, undefined, function(template_ui){
		if(!template_ui)
			  return;
		var template = $(template_ui);
		template.modal('show');
	}, null);

	return;
}
function initializeIntegrationsTabListeners(localStorageItem, navigateURL){
	$("#admin-prefs-tabs-content .integrations_inner ul li").off("click");
	$("#admin-prefs-tabs-content").on("click",".tab-container ul li",function(){
		var temp = $(this).find("a").attr("href").split("#");
		if(islocalStorageHasSpace())
			localStorage.setItem(localStorageItem, temp[1]);
		Backbone.history.navigate(navigateURL, { trigger : true });
	});
}