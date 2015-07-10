/**
 * workflow-alerts deals with the alerts inside a campaign.
 * Ex- If the node limit is reached
 */
function campaignAlert(alertType)
{
	if(alertType == null)
		return;
	var alertJSON={};
	var alertTemplate;
	if(alertType == "nodeLimit")
		{
		alertJSON = _billing_restriction.currentLimits;
		alertTemplate = $(getTemplate('campaign-node-limit-modal',alertJSON));
		}

	 
	if(alertType == "Empty")
		{
		alertJSON["title"]="No Twilio Number";
		alertJSON["message"]="The Twilio SMS gateway you configured does not have a purchased number. Please purchase a number from Twilio to start sending SMS.";
		alertTemplate = $(getTemplate('SMSGateway-integration-alert-modal',alertJSON));
		}
	
	if(alertType == "Unauthorised")
		{
		alertJSON["title"]="SMS Gateway not Configured";
		alertJSON["message"]="You need to enable SMS Gateway integration to use this option. Please enable it in Admin Settings -> Integrations";
		alertTemplate = $(getTemplate('SMSGateway-integration-alert-modal',alertJSON));
		}

	//alertTemplate = $(getTemplate('SMSGateway-integration-alert-modal',alertJSON));	
	//console.log();
	alertTemplate.modal('show');
	
}

function workflow_alerts(title, message , template, callback){
	
	var JSONValues = {};
	JSONValues["title"] = title;
	JSONValues["message"] = message;
	
	var $modal = $(getTemplate(template,JSONValues));

	$modal.modal('show');	

	if(callback && typeof (callback) === "function")
		callback($modal);
}

function send_verify_email()
{
	// On Enter Key
	$('#verify-email-form').find('input').die().live('keypress', function(e){
		
		// Enter key
		if(e.type== 'keypress' && e.which != 13)
			return;

		e.preventDefault();

		// Trigger click on enter
		$('#verify-email-send').trigger('click');
	});

	$('#verify-email-send').die().live('click', function(e){
		
		e.preventDefault();

		// If already clicked, return
		if($(this).attr("disabled"))
			return;

		if(!isValidForm('#verify-email-form'))
			return;

		$(this).attr('disabled', 'disabled').text("Sending...");

		var json = serializeForm("verify-email-form");
		
		if(!json)
			return;
		
		$.ajax({
			url: 'core/api/emails/verify-from-email',
			type: 'POST',
			data: json,
			success: function(data){
				
				$('#verify-email-send').removeAttr('disabled');

			     // Remove form elements
			     $('#verify-email-form').find('div.row').html("<p class='m-l'>Verification email sent to &#39;"+json.email+"&#39;. Please check your email and complete the verification process.</p>");
			     $('#verify-email-send').removeAttr('href').removeAttr('id').attr('data-dismiss', 'modal').text('Done with Verification');
			},
			error: function(response)
			{
				$('#verify-email-send').removeAttr('disabled');
				
				if(response.responseText == 'Email not verified yet.')
				{
					// Remove form elements
					$('#verify-email-form').find('div.row').html("<p class='m-l'> &#39;"+json.email+"&#39; is not verified yet. Please check your email and complete the verification process.</p>");
					$('#verify-email-send').removeAttr('href').removeAttr('id').attr('data-dismiss', 'modal').text('Done with Verification');
					
					$("#verify-ignore").show();
					return;
			     }

				$('#workflow-verify-email').modal('hide');
			}
		});
		
	});
}