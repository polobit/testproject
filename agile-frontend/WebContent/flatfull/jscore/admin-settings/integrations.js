

function modalAlert(templateName,message,title){
	
	if(templateName == undefined || message == undefined || title == undefined)
		return;
	var alertJSON = {};
	alertJSON["title"] = title;
	alertJSON["message"] = message;
	var template = $(getTemplate(templateName,alertJSON));
	template.modal('show');
	return;
}



