/**
 * validate.js is used to validate the forms in the application, isValidFom
 * method validates the form element
 * 
 * @param form
 * @returns
 */
function isValidForm(form) {

	// Credit card validation to check card is valid for next 3 months
	jQuery.validator
			.addMethod(
					"atleastThreeMonths",
					function(value, element) {

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

	$(form).validate({
		rules : {
			atleastThreeMonths : true,
			multipleEmails: true
		},
		debug : true,
		errorElement : 'span',
		errorClass : 'help-inline',

		// Higlights the field and addsClass error if validation failed
		highlight : function(element, errorClass) {
			$(element).closest(".control-group").addClass('error');
		},

		// Unhiglights and remove error field if validation check passes
		unhighlight : function(element, errorClass) {
			$(element).closest(".control-group").removeClass('error');
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