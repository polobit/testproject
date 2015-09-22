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