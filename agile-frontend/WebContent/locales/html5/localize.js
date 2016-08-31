function _agile_set_custom_validate(input){
	input.setCustomValidity(getCustomValidity(input)); 
}

function _agile_reset_custom_validate(input){
	input.setCustomValidity("");
}

function getCustomValidity(input){
	var type = input.type;

	if(input.validity.valueMissing){
        return localeJSON["invalid-default"];
    } else if(!input.validity.valid) {

    	if(input.validity.patternMismatch){
    		return localeJSON["invalid-pattern"] + "\n" + $(input).attr('title'); 
    	}

    	if(input.validity.tooShort){
    		return localeJSON["invalid-password"].replace("$1", $(input).attr('minlength')).replace("$2", $(input).val().length);
    	}

    	if(type == "email"){
    		return localeJSON["invalid-email"].replace("$1", '+ $(input).val() +');
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