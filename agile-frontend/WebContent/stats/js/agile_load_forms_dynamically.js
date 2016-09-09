function loadAgileCRMForm(id){
	id = id.split("_");
	var agileDomain = id[0];
	var formId = id[id.length-1];
	var script = document.createElement('script');
    script.src = window.location.protocol+'//'+agileDomain+'.agilecrm.com/core/api/forms/form/js/'+formId;
    document.body.appendChild(script);      
}

function showAgileCRMForm(formJson,formHolderId) {   
	document.getElementById(formHolderId).innerHTML = formJson.formHtml;
	var onloadScript = document.getElementById(formHolderId).getElementsByTagName("script");
    onloadScript = onloadScript[0].innerHTML;
	var script = document.createElement('script');
    script.id = "agileCRMFormLoadScript";
    script.text = onloadScript;
    document.body.appendChild(script);

    /*form preload for the   */

    var formJsonObj = JSON.parse(formJson.formJson);
    for (var key in formJsonObj[0].fields.agilepreloadfields["value"]) { 
        if(formJsonObj[0].fields.agilepreloadfields["value"][key]["selected"]) {
            if(formJsonObj[0].fields.agilepreloadfields["value"][key]["value"]=="true") {
                _agile_load_form_fields();
            }
        }
    }

}

window.addEventListener('load', function() { 
	var element = document.getElementsByClassName("agile_crm_form_embed");
    if(element.length != 0) {
      loadAgileCRMForm(element[0].getAttribute("id"));
      element[0].style.display = "";
    }
},false);
