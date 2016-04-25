function loadAgileCRMForm(id){
	id = id.split("_");
	var agileDomain = id[0];
	var formId = id[id.length-1];
    console.log("domain is :"+agileDomain);
	var script = document.createElement('script');
    script.src = window.location.protocol+'//localhost:8888/core/api/forms/form/js/'+formId;
    document.body.appendChild(script);      
}

function showAgileCRMForm(formJson,formHolderId) {   
	document.getElementById(formHolderId).innerHTML = formJson.formHtml;
	var onloadScript = document.getElementById(formHolderId).getElementsByTagName("script");
	console.log(onloadScript);
    onloadScript = onloadScript[0].innerHTML;
    console.log(onloadScript);
	var script = document.createElement('script');
    script.id = "agileCRMFormLoadScript";
    script.text = onloadScript;
    document.body.appendChild(script);
}

window.addEventListener('load', function() { 
	var element = document.getElementsByClassName("agile_crm_form_embed");
    if( element != null) {
      loadAgileCRMForm(element[0].getAttribute("id"));
      element[0].style.display = "";
    }
},false);