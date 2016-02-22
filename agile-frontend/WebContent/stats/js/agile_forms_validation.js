function agile_validations(){
	var isValid =  true;
	var agile_form = document.forms["agile-form"];

	for(var i=0; i<agile_form.length; i++){
			var inputId = agile_form[i].getAttribute("id");
        	var inputType = agile_form[i].getAttribute("type");
        	var inputNode = document.getElementById(inputId);
			var spans = document.getElementById("agile_span"+i);
			var required = agile_form[i].getAttribute("required");
		
		if(inputId){				
				if (inputNode.value == "" && spans == null && required == "") {
					isValid = false;
					var spanTag = document.createElement("span");
						spanTag.innerHTML = "Enter a value for this field.";
						spanTag.id = "agile_span"+i;
						spanTag.style.color = "red";
						spanTag.style.fontSize = "14px";
						inputNode.parentNode.insertBefore(spanTag,inputNode.nextSibling);
					}
				else if(inputNode.value && spans){
					isValid = false;
					document.getElementById("agile_span"+i).remove();		
				}
				else if(inputNode.value == "" && spans){
					isValid = false;
				}
	}

   }
	return isValid;
}
