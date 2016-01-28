function isDuplicateAccount(url, form, successCallback, errorCallback)
		{		 
			 $.post(url, {}, function(data){
				 console.log(data);
				  console.log(data.error)
				
				 if(data && data.error && data.error.length > 0)
					{
					 console.log(data.error);
						errorCallback(data);
					// Handle error here

					/*// If error block is removed, it is added again into DOM 
					  var email_error_block = $("#email-error");
					  var domain_error_block = $("#domain-error");
					  if(step == 0)
					  {
						  if(email_error_block.length)
							  $("#email-error").html("<a class='close' data-dismiss='alert' href='#'>&times</a> " + data.error).show();
						  else
							  $("#agile-fieldset1").prepend('<div id="email-error" class="alert alert-error login-error" ><a class="close" data-dismiss="alert" href="#">&times</a>'+ data.error+'</div');
						  $("#register_account").removeAttr("disabled");
					  }else if(step == 1)
					  {
						  if(domain_error_block.length)
							  $("#domain-error").html("<a class='close' data-dismiss='alert' href='#'>&times</a> " + data.error).show();
						  else
							  $("#agile-fieldset2").prepend('<div id="domain-error" class="alert alert-error login-error" ><a class="close" data-dismiss="alert" href="#">&times</a>'+ data.error+'</div');
						  $("#register_domain").removeAttr("disabled");
					  }
					  if(errorCallback && typeof errorCallback === 'function')
						  errorCallback(data);*/
					  return;
					  
					}
				  
				  if(successCallback && typeof successCallback === 'function')
					  successCallback(data);
				 
			 }, "json");
		}

function submitForm(form, submit_button)
	{
		var step = $("#step", form);

		$(submit_button).attr("disabled", "disabled");

		if(step)
		{
			var step_value = $(step).val();

			if(step_value == "1")
			{
				$(form).attr('action', "");

				$(form).removeAttr("onsubmit");
			  form.submit();
			  return;
			}
		}


		// Read domain
		var domain = $("#subdomain").val();

		
		$(form).attr('action', getRegisterURL(domain));
		$(form).removeAttr("onsubmit");
			  form.submit();
	}

function getRegisterURL(domain)
{
	if(typeof version === "undefined" || version == null || version === "null")
	{
		return  "https://" + domain + ".agilecrm.com/register";
	}
			
	return "https://" + domain + "-dot-" + version + "-dot-"+applicationId + ".appspot.com/register";
}

//validates the form fields
function isValid(form) {	

	var submit_button = $(form).find("[type='submit']");
	// Return if action is already in process 
	if($(submit_button).attr("disabled") || $(submit_button).attr("disabled"))
		return;

	initializeSubmitHandler(form, "login_email", "subdomain", submit_button);

	//$("#agile").validate();
		  
	//  $("#choose_domain").validate();
	return  false;
}

function isNotValid(subdomain) {
	subdomain = subdomain.toString();
	var sub_domain = ["my", "agile", "googleapps", "sales", "support", "login", "register", "google", "yahoo", "twitter", "facebook", "aol", "hotmail"];
	for(var key in sub_domain)
	{
		if(sub_domain[key] == subdomain.toLowerCase())
		{
			return false;
		} 
	}

	return true;
}

function isAlphaNumeric(subdomain) {
	subdomain = subdomain.toString();
		  
	var regularExpression  = new RegExp(/^[A-Za-z][a-zA-Z0-9]{3,20}$/);
	return regularExpression.test(subdomain);
}

function initializeSubmitHandler(form, emailField, subdomainField, submit_button)
{
		
		

						var email = $("#" + emailField).val();
						var domain = $("#" + subdomainField).val();
						var url =  "/backend/register-check?email=" + encodeURIComponent(email) +"&domain="+ domain;
						 $(submit_button).attr("disabled", "disabled");
						 
						isDuplicateAccount(url, form, function(data) {
						 	 hideEmailErrorMessage();
						 	  hideDomainErrorMessage();
						 	$(submit_button).removeAttr("disabled"); 
							 submitForm(form, submit_button);
							 $('.loading-image').removeClass("hide");
						 }, function(error){
						 	$('.loading-image').removeClass("hide");
						 	$(submit_button).removeAttr("disabled");

						 	if(domain)
						 	{
								showDomainErrorMessage(error);
						 	}
						 	else
						 	{
								showEmailErrorMessage(error);
						 	}
						 	console.log(error);
						 	
						 });
						
						 
}

function hideEmailErrorMessage()
{

$("#error-area").slideUp("slow");


}

function hideDomainErrorMessage()
{

$("#error-area").slideUp("slow");

}

function showEmailErrorMessage(error)
{
	console.log(error);
	$("#error-area").slideDown("slow").html(error.error);
}

function showDomainErrorMessage(error)
{
	$("#error-area").slideDown("slow").slideDown().html(error.error);
}
