
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
		},_agile_get_translated_val("validation-msgs",'required'));
	
	// Internal regex of jQuery validator allows for special characters in e-mails for ticketing.
	// This regex solves that, overriding 'email'
	jQuery.validator.addMethod("tickets_email", function(value, element){
		
		if(this.optional(element))
			return true;
		
		return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
	},_agile_get_translated_val("validation-msgs",'pls-enter-valid-email'));


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
		}, _agile_get_translated_val("validation-msgs",'card-3months-valid'));
	
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
    }, _agile_get_translated_val("validation-msgs", 'pls-enter-valid-email-sep-by-comma'));

	
	jQuery.validator.addMethod("noSpecialChars", function(value, element) {
		return isAlphaNumeric(value);
	//	console.log(params);
		
	}, _agile_get_translated_val("validation-msgs",'email-should-start-with-an-alphabet'));

	// Internal regex of jQuery validator allows for special characters in e-mails.
	// This regex solves that, overriding 'email'
	jQuery.validator.addMethod("email", function(value, element){
		
		if(this.optional(element))
			return true;
		
		return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
	},_agile_get_translated_val("validation-msgs",'pls-enter-valid-email'));

	// Phone number validation
	jQuery.validator.addMethod("phone", function(value, element){
		
		if(this.optional(element))
			return true;
		
		//return /^(\()?(\d{3})([\)-\. ])?(\d{3})([-\. ])?(\d{4})$/.test(value);
		return /^[^a-zA-Z]+$/.test(value);
	},_agile_get_translated_val("validation-msgs",'Pls-enter-a-valid-ph-no'));
	
	// Phone number validation
	jQuery.validator.addMethod("allow-char-phone", function(value, element){
		
		if(this.optional(element))
			return true;
		
		//return /^(\()?(\d{3})([\)-\. ])?(\d{3})([-\. ])?(\d{4})$/.test(value);
		return /^((\+)(\d)+)$/.test(value);
	},_agile_get_translated_val("validation-msgs",'Pls-enter-valid-ph-no'));
	
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
	},_agile_get_translated_val("validation-msgs",'this-field-is-required'));

	//IP validation
	jQuery.validator.addMethod("ipValidation", function(value, element){
		
		if(this.optional(element))
			return true;

		if(!value)
			 return false;
			
		return is_valid_ip(value.trim());
	
	},_agile_get_translated_val("validation-msgs",'ipaddress'));

	
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
	},_agile_get_translated_val("validation-msgs",'pls-enter-a-valid-formula'));
	
	//Number validation
	jQuery.validator.addMethod("number_input", function(value, element){
		
		if(value=="")
			return false;
		
		return /^[0-9\-]+$/.test(value);
	},_agile_get_translated_val("validation-msgs",'Pls-enter-valid-no'));

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

	},_agile_get_translated_val("validation-msgs",'value-validation'));


	jQuery.validator.addMethod("multi-select", function(value, element){
		var counter = 0;
		$(element).find(':selected').each( function( i, selected ) {
			counter++;
		});
		var limit = $(element).attr('limit');
		if(counter>limit)
			return false;
		return true;
	},_agile_get_translated_val("validation-msgs",'folder-select-validation'));

	jQuery.validator.addMethod("checkedMultiSelect", function(value, element){
		
		var counter = $(element).find('option:selected').length;
		
		if(counter == 0)
			return false;

		return true;
	},_agile_get_translated_val("validation-msgs",'pls-select-atleast-one-option'));

	jQuery.validator.addMethod("checkedMultiCheckbox", function(value, element){
		
		console.log("value = " + value);
		console.log("element = " + element);

		var counter = $(element).find('input:checked').length;
		
		if(counter == 0)
			return false;

		return true;
	},_agile_get_translated_val("validation-msgs",'pls-select-atleast-one-option'));

	jQuery.validator.addMethod("date", function(value, element){
		if(value=="")
			return true;

		return !/Invalid|NaN/.test(getFormattedDateObjectWithString(value));

			
	},_agile_get_translated_val("validation-msgs",'Pls-enter-a-valid-date'));

	jQuery.validator.addMethod("isHttpsURL", function(value, element){
		var urlregex = new RegExp("^(https:\/\/){1}([0-9A-Za-z]+\.)");
  		return urlregex.test(value);		
	},_agile_get_translated_val("validation-msgs",'pls-enter-a-valid-https-url'));

	jQuery.validator.addMethod("date_input", function(value, element){
		if(value=="")
			return true;

		return !/Invalid|NaN/.test(getFormattedDateObjectWithString(value));

		
	},_agile_get_translated_val("validation-msgs",'Pls-enter-a-valid-date'));

    
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
		  return getTemplate("js-max-length-error", {length: $(element).attr("max_len")});		
		}	
	);
    

	// domain name validation
	jQuery.validator.addMethod("domain_format", function(value, element){
		
		return /^[a-zA-Z][a-zA-Z0-9-_\.]{3,20}$/.test(value);
	},_agile_get_translated_val("validation-msgs",'domain-validation'));
    

    jQuery.validator.addMethod("customFieldSpecialCharacter", function(value, element){
		
		var custvals = /^\s*[_a-zA-Z0-9\s]+\s*$/;
		return custvals.test(value);
	},_agile_get_translated_val('validation-msgs','formlabel-validation')); 

	jQuery.validator.addMethod("duplicateWithSystemName", function(value, element){
		var labelJson = [];
		labelJson.cases = 'title,owner_id,status,description' ;
		labelJson.contact = 'fname,lname,email,company,title,name,url,website,address,phone,skypephone,image,city,state,zip,country,tags' ;
		labelJson.deal = 'name,probability,description,pipeline_milestone,close_date,deal_source_id,color1,relates_to,tags,expected_value' ;
		var scope = $("#textModalForm").find("input[name='scope']").val();
		var i;
		if(scope && (scope == "CONTACT" || scope == "COMPANY")){
			var array = labelJson.contact.split(',');
			for(i=0 ; i < array.length ; i++){
				if(value.toLowerCase() == array[i])
					return false;
			}
		}
		else if(scope && scope == "DEAL"){
			var array = labelJson.deal.split(',');
			for(i=0 ; i < array.length ; i++){
				if(value.toLowerCase() == array[i])
					return false;
			}	
		}
		else if(scope && scope == "CASE"){
			var array = labelJson.cases.split(',');
			for(i=0 ; i < array.length ; i++){
				if(value.toLowerCase() == array[i])
					return false;
			}

		}
		return true;
	},"{{agile_lng_translate 'validation-msgs' 'system-fields'}}");

    jQuery.validator.addMethod("tickets_group_name", function(value, element){

		return /^[a-zA-Z0-9._]*$/.test(value);
	},_agile_get_translated_val("validation-msgs",'pls-use-only-letters'));


	//Image keyword validation for custom fields
	jQuery.validator.addMethod("custom_field_keyword", function(value, element){
		
		if(value=="image")
		{
			return false;
		}
		else
		{
			return true;
		}

	},_agile_get_translated_val("validation-msgs",'image-is-a-keyword-desc'));

	jQuery.validator.addMethod("verified-email", function(value, element){
		if($(element).find("option").length !=0){
 				if(typeof($(element).find("option[value=\""+value+"\"]").attr("unverified")) == "undefined")
 					return true;
 				
 					return false;
 		}
 	},_agile_get_translated_val("validation-msgs",'date'));

	jQuery.validator.addMethod("month_date", function(value, element){
		if(value=="")
			return true;

		return !/Invalid|NaN/.test(getFormattedDateObjectForMonthWithString(value));

			
	},_agile_get_translated_val("validation-msgs",'verify-email'));

	$(form).validate({
		ignoreTitle: true,
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
        error = _agile_get_translated_val("validation-msgs",'domain-validation');
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
jQuery.extend(jQuery.validator.messages, {
    required: _agile_get_translated_val("validation-msgs",'required'),
    remote: _agile_get_translated_val("validation-msgs",'remote'),
    email: _agile_get_translated_val("validation-msgs",'email'),
    url: _agile_get_translated_val("validation-msgs",'url'),
    date: _agile_get_translated_val("validation-msgs",'date'),
    dateISO: _agile_get_translated_val("validation-msgs",'dateISO'),
    number: _agile_get_translated_val("validation-msgs",'number'),
    digits: _agile_get_translated_val("validation-msgs",'digits'),
    creditcard: _agile_get_translated_val("validation-msgs",'creditcard'),
    equalTo: _agile_get_translated_val("validation-msgs",'equalTo'),
    accept: _agile_get_translated_val("validation-msgs",'accept'),
    maxlength: jQuery.validator.format(_agile_get_translated_val("validation-msgs",'maxlength')),
    minlength: jQuery.validator.format(_agile_get_translated_val("validation-msgs",'minlength')),
    rangelength: jQuery.validator.format(_agile_get_translated_val("validation-msgs",'rangelength')),
    range: jQuery.validator.format(_agile_get_translated_val("validation-msgs",'range')),
    max: jQuery.validator.format(_agile_get_translated_val("validation-msgs",'max')),
    min: jQuery.validator.format(_agile_get_translated_val("validation-msgs",'min'))
});