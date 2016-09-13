function _agile_set_custom_validate(input){
	input.setCustomValidity(getCustomValidity(input)); 
}

function _agile_reset_custom_validate(input){
    input.setCustomValidity("");

    if(input.checkValidity())
        input.setCustomValidity("");
}

function getCustomValidity(input){
	var type = input.type;
	if(input.validity.valueMissing){
        if(input.nodeName == "SELECT")
            return localeJSON["invalid-select-one"];
        else {
            if(type == "number" && input.validity.badInput){
                return localeJSON["enter-number-only"];
            }
            return localeJSON["invalid-default"];
        }

    } else if(!input.validity.valid) {
    	if(input.validity.patternMismatch){
    		return localeJSON["invalid-pattern"] + "\n" + $(input).attr('title'); 
    	}
        if(type == "number" && input.validity.badInput){
            return localeJSON["enter-number-only"];
        }

    	if(type == "email"){
            var mssg = localeJSON["invalid-email"];
            if($(input).val().indexOf("@") != -1)
                mssg = localeJSON["email-invalid-after-@"];

            return mssg.replace("$1", '' + $(input).val() + '');
    	}

        if(input.validity.tooShort){
            return localeJSON["invalid-password"].replace("$1", $(input).attr('minlength')).replace("$2", $(input).val().length);
        }

    	if(type == "password"){
    		return localeJSON["invalid-password"].replace("$1", $(input).attr('minlength')).replace("$2", $(input).val().length);
    	}

    	return localeJSON["invalid-default"];
    } 
   return "";
}

$(document).ready(function() {
	$('input[required]').each(function(index, ele){
  		ele.setCustomValidity(getCustomValidity(ele));
  	});
});