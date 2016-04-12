function loadAgileCRMForm(id){
	id = id.split("_");
	var agileDomain = id[0];
	var formId = id[id.length-1];
    console.log("domain is :"+agileDomain);
	var script = document.createElement('script');
    script.src = window.location.protocol+'//'+agileDomain+'-dot-sandbox-dot-agilecrmbeta.appspot.com/core/api/forms/form/js/'+formId;
    document.body.appendChild(script);      
}

function showAgileCRMForm(formJson,formHolderId) {
	document.getElementById(formHolderId).innerHTML = formJson.formHtml;
	var onloadScript = document.getElementById("agileFormHolder").getElementsByTagName("script");
	alert(onloadScript);
    onloadScript[0].parentElement.removeChild(onloadScript[0]);
    alert(onloadScript);
	var script = document.createElement('script');
    script.id = "agileCRMFormLoadScript";
    script.text = onloadScript;
    document.body.appendChild(script);
}