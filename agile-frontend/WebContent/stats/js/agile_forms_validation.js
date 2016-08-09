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

				//if field is not having span,value and having required			
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

		else if(inputNode.value && spans){ //if field having value and span

					// email validations
					if(agile_form[i].type == "email"){
						
						if(validateEmail(inputNode.value)){
							document.getElementById("agile_span"+i).remove(); 
		 					isValid = true;
		 					continue;
						}
 						else {
 							document.getElementById("agile_span"+i).innerHTML = "Please enter a valid email.";
 							count++;
 							isValid = false;
 							continue;
 						}	
 					}

 					if(agile_form[i].name == "phone"){
						
						if(validatePhonenumber(inputNode.value)){
							document.getElementById("agile_span"+i).remove(); 
		 					isValid = true;
		 					continue;
						}
 						else {
 							document.getElementById("agile_span"+i).innerHTML = "Please enter valid phone number";
 							count++;
 							isValid = false;
 							continue;
 						}	
 					}
	

	

					//other fields if have value 
					document.getElementById("agile_span"+i).remove();
					isValid = true;
					continue;		
		}

		else if(inputNode.value && spans == null){ //if field having only value not spans
					
					// email validations
					if(agile_form[i].type == "email"){

					if(validateEmail(inputNode.value)){ 
		 					isValid = true;
		 					continue;
						}
 						else{
 							var spanTag = document.createElement("span");
						spanTag.innerHTML = "Please enter a valid email.";
						spanTag.id = "agile_span"+i;
						spanTag.style.color = "red";
						spanTag.style.fontSize = "12px";
						inputNode.parentNode.insertBefore(spanTag,inputNode.nextSibling);
						count++;    //if span created then we will increase by one
						isValid = false;
						continue;
 						}

 					}	
 					// phone number validations
					if(agile_form[i].name == "phone"){

					if(validatePhonenumber(inputNode.value)){ 
		 					isValid = true;
		 					continue;
						}
 						else{
	 						var spanTag = document.createElement("span");
							spanTag.innerHTML = "Please enter valid phone number";
							spanTag.id = "agile_span"+i;
							spanTag.style.color = "red";
							spanTag.style.fontSize = "12px";
							inputNode.parentNode.insertBefore(spanTag,inputNode.nextSibling);
							count++;    //if span created then we will increase by one
							isValid = false;
							continue;
 						}

 					}	
		}

		else if(inputNode.value == "" && spans){ //if field having spans not a value
					isValid = false;
					count++;
					continue;
		}	

   		}
   		
			if(count != null){	// if form having spans 
					isValid =false;
				}
   	}

	return isValid;
}


function validateEmail(email){

		var reg = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
 		if (reg.test(email))
		 		return true;
 			else
 				return false;
}

function validatePhonenumber(str)  
{  
	var pattern=/^(?=.*[0-9])[- +().0-9]+$/;

	if(pattern.test(str))
		return true;	
	else
		return false;
}

