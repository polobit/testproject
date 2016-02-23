function agile_validations(){
	
	var isValid =  true;
	var count = null;    //to count the spans in the form
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
						spanTag.style.fontSize = "12px";
						inputNode.parentNode.insertBefore(spanTag,inputNode.nextSibling);
						count++;    //if span created then we will increase by one
						continue;
			}

		else if(inputNode.value && spans){

					// email validations
					if(agile_form[i].type == "email" && validateEmail(inputNode.value)){
							document.getElementById("agile_span"+i).remove(); 
		 					isValid = true;
		 					continue;
						}
 						else if(agile_form[i].type == "email"){
 							document.getElementById("agile_span"+i).innerHTML = "Please enter a valid email.";
 							count++;
 							continue;
 						}	

					//website validations
					if(agile_form[i].type == "url" && validateWebsite(inputNode.value)){
							document.getElementById("agile_span"+i).remove();
							isValid = true;
							continue;
						}
						else if(agile_form[i].type == "url"){
 							document.getElementById("agile_span"+i).innerHTML = "Please enter a valid website.";
 							count++;
 							continue;
 						}	

					//other fields if have value 
					document.getElementById("agile_span"+i).remove();
					isValid = true;
					continue;		
		}

		else if(inputNode.value && spans == null){
					
					// email validations
					if(agile_form[i].type == "email" && validateEmail(inputNode.value)){ 
		 					isValid = true;
		 					continue;
						}
 						else if(agile_form[i].type == "email"){
 							var spanTag = document.createElement("span");
						spanTag.innerHTML = "Please enter a valid email.";
						spanTag.id = "agile_span"+i;
						spanTag.style.color = "red";
						spanTag.style.fontSize = "12px";
						inputNode.parentNode.insertBefore(spanTag,inputNode.nextSibling);
						count++;    //if span created then we will increase by one
						continue;
 						}	

				//website validations
					if(agile_form[i].type == "url" && validateWebsite(inputNode.value)){
							isValid = true;
							continue;
						}
						else if(agile_form[i].type == "url"){
 							var spanTag = document.createElement("span");
						spanTag.innerHTML = "Please enter a valid website.";
						spanTag.id = "agile_span"+i;
						spanTag.style.color = "red";
						spanTag.style.fontSize = "12px";
						inputNode.parentNode.insertBefore(spanTag,inputNode.nextSibling);
						count++;    //if span created then we will increase by one
						continue;
 						}	
		}

		else if(inputNode.value == "" && spans){
					isValid = false;
					count++;
					continue;
		}	

				if(count != null){	// if form having spans 
					isValid =false;
				}

   		}

   	}

	return isValid;
}


function validateEmail(email){

		var reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
 		if (reg.test(email))
		 		return true;
 			else
 				return false;
}


function validateWebsite(url){

		var reg = /^(ftp|http|https):\/\/[^ "]+$/;
			if(reg.test(url))
				return true;
			else
 				return false;
 							
}
