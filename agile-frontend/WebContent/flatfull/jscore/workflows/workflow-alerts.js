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