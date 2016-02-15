function agile_validations(){
	var isValid =  true;
	var divs = document.getElementsByTagName("input");

	for(var i=0; i<divs.length; i++){
			var inputId = divs[i].id;
        	var inputType = divs[i].type;
        	var inputNode = document.getElementById(inputId);
			var spans = document.getElementById("agile_span"+i);
			var required = divs[i].getAttribute("required");
		
		if(inputType == "text" || inputType == "email" || inputType == "url"){				
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
					document.getElementById("agile_span"+i).remove();		
				}
	}
   }
	return isValid;
}
