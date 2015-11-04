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
	var templateName = "";

	if(alertType == "nodeLimit")
		{
		alertJSON = _billing_restriction.currentLimits;
		templateName = "campaign-node-limit-modal";
		}

	 
	if(alertType == "Empty")
		{
		alertJSON["title"]="No Twilio Number";
		alertJSON["message"]="The Twilio SMS gateway you configured does not have a purchased number. Please purchase a number from Twilio to start sending SMS.";
		templateName = "SMSGateway-integration-alert-modal";
		}
	
	if(alertType == "Unauthorised")
		{
		alertJSON["title"]="SMS Gateway not Configured";
		alertJSON["message"]="You need to enable SMS Gateway integration to use this option. Please enable it in Admin Settings -> Integrations";
		templateName = "SMSGateway-integration-alert-modal";
		}

		getTemplate(templateName, alertJSON, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$(template_ui).modal('show');
		}, null);
}

function workflow_alerts(title, message , template, callback){
	
	var JSONValues = {};
	JSONValues["title"] = title;
	JSONValues["message"] = message;
	
	getTemplate(template, JSONValues, undefined, function(template_ui){
		if(!template_ui)
			  return;
			
		var $modal = $(template_ui);
		$modal.modal('show');	

		if(callback && typeof (callback) === "function")
			callback($modal);

	}, null);
}

function send_verify_email(el)
{
	// On Enter Key
	$('#verify-email-form', el).find('input').on('keypress', function(e){
		
		// Enter key
		if(e.type== 'keypress' && e.which != 13)
			return;

		e.preventDefault();

		// Trigger click on enter
		$('#verify-email-send').trigger('click');
	});

	$('#verify-email-send', el).on('click', function(e){
		
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

			     // Hide form elements
			     $('#verify-email-form').find('div.row div').hide();
			     $('#verify-email-form').find('div.row input').val(json.email);

			     $('#verify-email-form').find('div.row span#alert-msg').html("<p class='m-l'>Verification email sent to &#39;"+json.email+"&#39;. Please check your email and complete the verification process.</p>");
			     $('#verify-email-send').removeAttr('href').removeAttr('id').attr('data-dismiss', 'modal').text('Done');
			},
			error: function(response)
			{
				$('#verify-email-send').removeAttr('disabled');
				
				if(response.responseText == 'Email not verified yet.')
				{
					// Hide form elements
					$('#verify-email-form').find('div.row div').hide();
					$('#verify-email-form').find('div.row input').val(json.email);
			     
					$('#verify-email-form').find('div.row span#alert-msg').html("<p class='m-l'> &#39;"+json.email+"&#39; is not verified yet. Please check your email and complete the verification process.</p>");
					$('#verify-email-send').removeAttr('href').removeAttr('id').attr('data-dismiss', 'modal').text('Done');
					
//					$("#verify-ignore").show();
					return;
			     }

				$('#workflow-verify-email').modal('hide');
			}
		});
		
	});
}

function unsubscribe_contact()
{
	
    $('#unsubscribe').off('click');
	$('body').on('click', '#unsubscribe', function(e){
		
		e.preventDefault();

		// If already clicked, return
		if($(this).attr("disabled"))
			return;

		if(!isValidForm('#unsubscribe-form'))
			return;

		$(this).attr('disabled', 'disabled').text("Unsubscribing...");

		var json = {}, campaigns_list = [];

		$('#campaigns-list option:selected').each(function(index, option){

				campaigns_list.push($(this).val());
    	});

		var unsubscribe_campaign_ids = [];
				
		$.each(App_Contacts.contactDetailView.model.toJSON()["unsubscribeStatus"], function(index, value){
       
			unsubscribe_campaign_ids.push(value.campaign_id);
		});

		// Removes already unsubscribed campaigns
		campaigns_list = campaigns_list.filter(function(el){

			return unsubscribe_campaign_ids.indexOf(el) < 0 ; 
		});

		// If undefined
		if(!campaigns_list || campaigns_list.length == 0)
		{
			$('div#contact-detail-resubscribe-modal').modal('hide');
			return;
		}

		json["campaign_id"] = campaigns_list.join(',');
		json["contact_id"] = App_Contacts.contactDetailView.model.get('id');
		json["type"] = "CURRENT";
		
		if(is_selected_all)
			json["type"]="ALL";

		if(!json)
			return;
		
		$.ajax({
			url: 'core/api/unsubscribe',
			type: 'POST',
			data: json,
			success: function(data){
				
				$('#unsubscribe').removeAttr('disabled').text('Unsubscribe');

				// To update Campaigns tab
				unsubscribe_status_updated = true;

				$('div#contact-detail-resubscribe-modal').modal('hide');

				showNotyPopUp("information", "Unsubscribed successfully.", "top");
			},
			error: function(response)
			{
				
			}
		});
		
	});
}

function resubscribe()
{
	$('.resubscribe').off('click');
	$('.resubscribe').on('click', function(e){

		e.preventDefault();

		var $element = $(event.target);

		if (!confirm("Are you sure to resubscribe " + $(this).attr("contact_name") + " from " + $(this).attr("campaign_name") + " campaign?"))
			return;
		
		var campaign_id = $(this).attr('data');

		var json = {};
		json["id"] = App_Contacts.contactDetailView.model.get('id');
		json["workflow-id"] = campaign_id;

		if(campaign_id == "ALL")
		{
			var workflow_ids = [];

			$.each(App_Contacts.contactDetailView.model.toJSON()["unsubscribeStatus"], function(index, value){
               
				workflow_ids.push(value.campaign_id);
			});

			json["workflow-id"] = workflow_ids.join(',');
		}

		$.ajax({
			url: 'core/api/campaigns/resubscribe',
			type: 'POST',
			data: json,
			success: function(data){
				
				// To update campaigns tab
				unsubscribe_status_updated = true;

				$element.closest('li').remove();

				// Remove All option too
				$('ul#added-tags-ul').find("a[data='ALL']").closest('li').remove();

			},
			error: function(response)
			{
				

			}
		});

	});

}