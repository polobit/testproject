function loadAgileCRMForm(id){
	id = id.split("_");
	var agileDomain = id[0];
	var formId = id[id.length-1];
    console.log("domain is :"+agileDomain);
	var script = document.createElement('script');
    //script.src = window.location.protocol+'//'+agileDomain+'.agilecrm.com/core/api/forms/form/js/'+formId;
    script.src = "https://"+agileDomain+"-dot-sandbox-dot-agilecrmbeta.appspot.com/core/api/forms/form/js/"+formId;
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
   /*loading the captcha js file dynamically*/
    var formJsonObj = JSON.parse(formJson.formJson);
     if(formJsonObj[0].fields.agileformcaptcha["value"]=="true")
        for (var key in formJsonObj[0].fields.agileformcaptcha["value"]) { 
                if(formJsonObj[0].fields.agileformcaptcha["value"][key]["selected"]) {
                    if(formJsonObj[0].fields.agileformcaptcha["value"][key]["value"]=="true") {
                        _agile_require_js("https://www.google.com/recaptcha/api.js", function(){});
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
