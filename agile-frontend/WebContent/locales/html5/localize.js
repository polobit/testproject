/**
 * HTML5 Validations Customization  
 */
function _agile_set_custom_validate(input){
	input.setCustomValidity(getCustomValidity(input)); 
}

// Reset to default & Validate
function _agile_reset_custom_validate(input){
    input.setCustomValidity("");

    if(input.checkValidity())
        input.setCustomValidity("");
}

// Returns the exact error based on the validity check point of the field
function getCustomValidity(input){
	var type = input.type;
    // If val is Empty
	if(input.validity.valueMissing){
        if(input.nodeName == "SELECT")
            return localeJSON["invalid-select-one"];
        else {
            if(type == "number" && input.validity.badInput){
                return localeJSON["enter-number-only"];
            }
            return localeJSON["invalid-default"];
        }

    }
    // If field not valid 
    else if(!input.validity.valid) {
        // Pattern Check
    	if(input.validity.patternMismatch){
            var title_mssg = $(input).attr('data-title');
            if(!title_mssg) title_mssg = $(input).attr('title');
    		return localeJSON["invalid-pattern"] + "\n" + title_mssg; 
    	}
        // Number
        if(type == "number" && input.validity.badInput){
            return localeJSON["enter-number-only"];
        }
        // Email
    	if(type == "email"){
            var mssg = localeJSON["invalid-email"];
            if($(input).val().indexOf("@") != -1)
                mssg = localeJSON["email-invalid-after-@"];

            return mssg.replace("$1", '' + $(input).val() + '');
    	}
        // Min Length
        if(input.validity.tooShort){
            return localeJSON["invalid-password"].replace("$1", $(input).attr('minlength')).replace("$2", $(input).val().length);
        }
        // Password
    	if(type == "password"){
    		return localeJSON["invalid-password"].replace("$1", $(input).attr('minlength')).replace("$2", $(input).val().length);
    	}

    	return localeJSON["invalid-default"];
    } 
   return "";
}

// DOM Ready 
$(document).ready(function() {
    // Initialize error for all fields in the page
	$('input[required]').not(document.getElementById("login_phone_number")).each(function(index, ele){
  		ele.setCustomValidity(getCustomValidity(ele));
  	});
});