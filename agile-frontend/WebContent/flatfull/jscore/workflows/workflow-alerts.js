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
			     $('#verify-email-form').find('div.row').html("<p class='m-l'>Done. Please check your email and complete the verification.</p>");
			     $('#verify-email-send').removeAttr('href').attr('id', 'done-verify-email').text('Done with Verification');
				
				 $('#done-verify-email').live('click', function(e){
					 e.preventDefault();
					 $('#workflow-verify-email').modal('hide');
					 
				 });
			},
			error: function()
			{
				$('#verify-email-send').removeAttr('disabled');

				$('#workflow-verify-email').modal('hide');
			}
		});
		
	});
}