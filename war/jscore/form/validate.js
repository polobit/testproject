/**
 * validate.js is used to validate the forms in the application, isValidFom
 * method validates the form element
 * 
 * @param form
 * @returns
 */
function isValidForm(form) {
	

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
		
		return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/i.test(value);
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
			$(element).closest(".control-group").find('ul.tags').append('<li class="tag" style="display: inline-block;" data="'+tag_input+'">'+tag_input+'<a class="close" id="remove_tag" tag="'+tag_input+'">&times</a></li>');
		}
		
		return $(element).closest(".control-group").find('ul.tags > li').length > 0 ? true : false;
	}," This field is required.");
	
	$(form).validate({
		rules : {
			atleastThreeMonths : true,
			multipleEmails: true,
			email: true,
			phone: true
		},
		debug : true,
		errorElement : 'span',
		errorClass : 'help-inline',

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
	
<<<<<<< HEAD
  var regularExpression  = new RegExp(/^[A-Za-z#@][A-Za-z0-9_:&@;/\s/g]*$/);
=======
  var regularExpression  = new RegExp(/^[A-Za-z#@][A-Za-z0-9_:&@;]*$/);
>>>>>>> d6d2aa38609930755a6666a050790cfddb8b532f
  if(!regularExpression.test(subdomain)) {
		return false;
    }
  return true;
}