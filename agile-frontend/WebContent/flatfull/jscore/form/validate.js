
/**
 * validate.js is used to validate the forms in the application, isValidFom
 * method validates the form element
 * 
 * @param form
 * @returns
 */
function isValidForm(form) {

    jQuery.validator.addMethod("choosen-select-input", function(value, element){


    		if(!$('#bulk-labels').length)
    			return true;
    		
        	var label_value=$("#bulk-labels .chosen-select").val();

           	if(label_value)
            	return true;			
			
			return false;
		}," This field is required.");

	// Credit card validation to check card is valid for next 3 months
	jQuery.validator.addMethod("atleastThreeMonths", function(value, element) {

			// Gets the exp_month field because expiry should be
			// checked both on month and year
			var month = $(element).siblings('select.exp_month')
					.val(), year = value;

			// date selected
			var date = new Date().setFullYear(year, month - 1);

			// Get number of milliseconds per day
			var one_day = 1000 * 60 * 60 * 24;

			// Calculates number of days left from the current date,
			// if number of days are greater than 90 then returns
			// true
			return this.optional(element)
					|| (((date - new Date().getTime()) / one_day) > 90);
		}, "Card should be atleast 3 months valid");
	
	// Validates multiple emails separated by comma entered in textbox
	jQuery.validator.addMethod("multipleEmails", function(value, element) {
        
		if (this.optional(element)) // return true on optional element
            return true;
        
        var emails = value.split(/[,]+/); // split element by , 
        valid = true;
        
        for (var i in emails) {
            value = emails[i];
            valid = valid &&
                    jQuery.validator.methods.email.call(this, $.trim(value), element);
        }
        
        return valid;
    }, "Please enter valid email each separated by comma.");

	
	jQuery.validator.addMethod("noSpecialChars", function(value, element) {
		return isAlphaNumeric(value);
	//	console.log(params);
		
	}, "Should start with an alphabet and special characters are not allowed.");

	// Internal regex of jQuery validator allows for special characters in e-mails.
	// This regex solves that, overriding 'email'
	jQuery.validator.addMethod("email", function(value, element){
		
		if(this.optional(element))
			return true;
		
		return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
	}," Please enter a valid email.");

	// Phone number validation
	jQuery.validator.addMethod("phone", function(value, element){
		
		if(this.optional(element))
			return true;
		
		//return /^(\()?(\d{3})([\)-\. ])?(\d{3})([-\. ])?(\d{4})$/.test(value);
		return /^[^a-zA-Z]+$/.test(value);
	}," Please enter a valid phone number.");
	
	jQuery.validator.addMethod("multi-tags", function(value, element){
		
		var	tag_input = $(element).val()
		$(element).val("");
		if(tag_input && tag_input.length>=0 && !(/^\s*$/).test(tag_input))
		{
			var template = Handlebars.compile('<li class="tag" style="display: inline-block;" data="{{name}}">{{name}}<a class="close" id="remove_tag" tag="{{name}}">&times</a></li>');

		 	// Adds contact name to tags ul as li element
			$(element).closest(".control-group").find('ul.tags').append(template({name : tag_input}));
		}
		
		return $(element).closest(".control-group").find('ul.tags > li').length > 0 ? true : false;
	}," This field is required.");
	
	jQuery.validator.addMethod("formulaData", function(value, element){
		var source = $(element).val();
		var tpl;
		var compiled=true;
		try{
			tpl = Handlebars.precompile(source);
		}catch(err){
			err.message;
			compiled=false;
		}
		return compiled ? true : false;
	}," Please enter a valid formula.");
	
	//Number validation
	jQuery.validator.addMethod("number_input", function(value, element){
		
		if(value=="")
			return false;
		
		return /^[0-9\-]+$/.test(value);
	}," Please enter a valid number.");

	//Positive Number validation
	jQuery.validator.addMethod("positive_number", function(value, element){
		
		if(value=="")
			return true;

		if(isNaN(value))
		{
			return false;
		}
		if(!isNaN(value) && parseFloat(value) >= 0)
		{
			return true;
		}

	}," Please enter a value greater than or equal to 0.");


	
	jQuery.validator.addMethod("multi-select", function(value, element){
		var counter = 0;
		$(element).find(':selected').each( function( i, selected ) {
			counter++;
		});
		var limit = $(element).attr('limit');
		if(counter>limit)
			return false;
		return true;
	}," You can select maximum 3 folders only.");

	jQuery.validator.addMethod("checkedMultiSelect", function(value, element){
		
		var counter = $(element).find('option:selected').length;
		
		if(counter == 0)
			return false;

		return true;
	},"Please select atleast one option.");

	jQuery.validator.addMethod("checkedMultiCheckbox", function(value, element){
		
		console.log("value = " + value);
		console.log("element = " + element);

		var counter = $(element).find('input:checked').length;
		
		if(counter == 0)
			return false;

		return true;
	},"Please select atleast one option.");

	jQuery.validator.addMethod("date", function(value, element){
		if(value=="")
			return true;

		return !/Invalid|NaN/.test(getFormattedDateObjectWithString(value));

			
	}," Please enter a valid date.");

	jQuery.validator.addMethod("isHttpsURL", function(value, element){
		var urlregex = new RegExp("^(https:\/\/){1}([0-9A-Za-z]+\.)");
  		return urlregex.test(value);		
	}," Please enter a valid https URL");

	jQuery.validator.addMethod("date_input", function(value, element){
		if(value=="")
			return true;

		return !/Invalid|NaN/.test(getFormattedDateObjectWithString(value));

		
	}," Please enter a valid date.");

    
	jQuery.validator.addMethod("field_length", function(value, element){
		if(value=="")
			return true;
		var counter = 0;
		var max_len = $(element).attr('max_len');
		if(max_len == "")
			return true;
		if(value.length > max_len)
			return false;
		return true;
	}, function(params, element) {
		  return 'Maximum length is ' + $(element).attr("max_len") + ' chars only.'
		}	
	);


	// domain name validation
	jQuery.validator.addMethod("domain_format", function(value, element){
		
		return /^[a-zA-Z][a-zA-Z0-9-_\.]{3,20}$/.test(value);
	}," Name should be between 4-20 characters in length. Both letters and numbers are allowed but it should start with a letter.");
    
    jQuery.validator.addMethod("tickets_group_name", function(value, element){

		return /^[a-zA-Z0-9._]*$/.test(value);
	},"Please use only letters (a-z & A-Z), numbers, '.' and '_'.");


	$(form).validate({
		rules : {
			atleastThreeMonths : true,
			multipleEmails: true,
			email: true,
			checkedMultiSelect: true,
			phone: true
		},
		debug : true,
		errorElement : 'span',
		errorClass : 'help-inline',
		ignore: ':hidden:not(.checkedMultiSelect)',

		// Higlights the field and addsClass error if validation failed
		highlight : function(element, errorClass) {
			$(element).closest('.controls').addClass('single-error');
		},

		// Unhiglights and remove error field if validation check passes
		unhighlight : function(element, errorClass) {
			$(element).closest('.controls').removeClass('single-error');
		},
		invalidHandler : function(form, validator) {
			var errors = validator.numberOfInvalids();
		},
		errorPlacement: function(error, element) {
    		if (element.hasClass('checkedMultiSelect')) {
     			 error.appendTo($(element).parent());
    			} 
    		else if(element.hasClass("choosen-select-input")){
                 error.appendTo($("#bulk-labels .chosen-container"));
              }
    			else {
      				error.insertAfter(element);
    			}    
         }
	});

	// Return valid of invalid, to stop from saving the data
	return $(form).valid();
}

function isNotValid(value) {
    if (value == undefined) return true;
    if (value.length == 0) return true;
    return false;
}


function isValidField(id) {
    var value = $('#' + id).val();
    return !isNotValid(value);
}


function isAlphaNumeric(subdomain) {
	subdomain = subdomain.toString();
  
  var regularExpression  = new RegExp(/^[A-Za-z][a-zA-Z0-9]{3,20}$/);
  if(!regularExpression.test(subdomain)) {
        error = "Domain should start with an alphabet and special characters are not allowed.";
		return false;
    }
  return true;
}

function isAlphaNumeric(subdomain) {
	subdomain = subdomain.toString();
	
  var regularExpression  = new RegExp(/^[A-Za-z#@][A-Za-z0-9_:&@;/\s/g]*$/);
  if(!regularExpression.test(subdomain)) {
		return false;
    }
  return true;
}

function isValidContactCustomField(id) {
    var name = $('#' + id).attr("name");
    if($('ul[name="'+name+'"]').find("li").length == 0) {
    	return false;
    }else {
    	return true;
    }
}
