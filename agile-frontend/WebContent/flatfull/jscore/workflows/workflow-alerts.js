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
		alertJSON["title"]="{{agile_lng_translate 'twill' 'no-twilio-number'}}";
		alertJSON["message"]="{{agile_lng_translate 'gateway' 'number-error'}}";
		templateName = "SMSGateway-integration-alert-modal";
		}
	
	if(alertType == "Empty_Widget")
		{
		alertJSON["title"]="{{agile_lng_translate 'twill' 'no-twilio-number'}}";
		alertJSON["message"]="{{agile_lng_translate 'gateway' 'number-integration-error'}}";
		templateName = "CallWidget-integration-alert-modal";
		}

	if(alertType == "Unauthorised")
		{
		alertJSON["title"]="{{agile_lng_translate 'gateway' 'no-gateway'}}";
		alertJSON["message"]="{{agile_lng_translate 'gateway' 'enable-gateway'}}";
		templateName = "SMSGateway-integration-alert-modal";
		}

	if(alertType == "Unauthorised_Call_Widget")
		{
		alertJSON["title"]="{{agile_lng_translate 'gateway' 'no-twilio-gateway'}}";
		alertJSON["message"]="{{agile_lng_translate 'gateway' 'enable-twilio-integration'}}";
		templateName = "CallWidget-integration-alert-modal";
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

function workflow_spam_alerts(reason, score , template, callback){
	
	var JSONValues = {};
	JSONValues["title"] = "Spam Result";
	JSONValues["score"] = score;
	JSONValues["reason"]=reason;
	
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
	var OUR_DOMAIN = 'our.agilecrm.com';
	// On Enter Key
	var $input = $('#verify-email-form', el).find('input');

	$input.off('keypress');
	$input.on('keypress', function(e){
		
		// Enter key
		if(e.type== 'keypress' && e.which != 13)
			return;

		e.preventDefault();

		// Trigger click on enter
		$('#verify-email-send').trigger('click');
	});

	$('#verify-email-send', el).off('click');
	$('#verify-email-send', el).on('click', function(e){
		
		e.preventDefault();

		// If already clicked, return
		if($(this).attr("disabled"))
			return;

		if(!isValidForm('#verify-email-form'))
			return;

		$(this).attr('disabled', 'disabled').text("{{agile_lng_translate 'other' 'verifying'}}");

		var json = serializeForm("verify-email-form");
		
		if(!json)
			return;

		// Validation If email address contains apple and paypal keyword then we will not allow to add.
		if(json.email.toLocaleLowerCase().search('apple')>= 0 || json.email.toLocaleLowerCase().search('paypal')>= 0 )
		{
			if($('#verify-email-form').find('div .help-inline').length == 0 )
				$('#verify-email-form').find('span.controls').append('<span for="email" generated="true" class="help-inline"><p>Please provide a valid email address.</p></span>');
			else
			   $('#verify-email-form').find('span.controls .help-inline').html('<p>Please provide a valid email address.').show();
			
			$('#verify-email-send').attr('disabled', false).text('Send verification Email');
			return;
		}

		var emailDomain = getEmailDomain(json.email);
		
		if(!isGlobalDomain(emailDomain) && !_IS_EMAIL_GATEWAY && !(window.location.host == OUR_DOMAIN)){
			
			varifyWhiteLebal(emailDomain, function(data)
				{
					var isValidDKIM = true;

					if(data){
						$.each(data, function(i,value){
							if(value.valid == false){
								isValidDKIM = false;
								}
	            			});
					}
					else{
						isValidDKIM = false;
					}

					if(!isValidDKIM){
						/*
						if($('#verify-email-form').find('div .help-inline').length == 0 ){
							$('#verify-email-form').find('span.controls').append('<span for="email" generated="true" class="help-inline"><p>It looks like you are using a new domain at Agile. You need to Authorize Agile to send emails on your behalf. This is a required step to ensure that your emails are not going to the junk or spam mailbox.</br>Please configure <a href="#api-analytics" target="_blank" style="color: #19a9d5;!important">DKIM and SPF</a> to proceed.</p></span>');
						}
						else{
							$('#verify-email-form').find('span.controls .help-inline').html('<p>Please configure <a href="#api-analytics" target="_blank" style="color: #19a9d5;!important">DKIM and SPF</a> to proceed.</p>').show();
						}
						*/
						$('#verify-email-form #emial-domain-observer').empty();
						$('#verify-email-form #emial-domain-observer').append('<span for="email" generated="true"><p>You need to authorise Agile to send emails on your behalf. Please configure <a href="#verify-domain/'+emailDomain+'" target="_blank" style="color: #19a9d5;!important">Domain Keys</a> to proceed.</p></span>');
						$('#verify-email-send').attr('disabled', false).text("{{agile_lng_translate 'email' 'verify-email-text'}}");

						return;
					}
					else
					{
						// add 1 key isEmailDomainValid for verify From email directly without sending verification email. 
						// if isEmailDomainValid is true then no need to send verification email
						json.isEmailDomainValid = true;
						verify_from_email(json);
					}
				});	
		}
		else
		{
			verify_from_email(json);
		}
		
	});
}

function verify_from_email(json)
{
	$.ajax({
			url: 'core/api/emails/verify-from-email',
			type: 'POST',
			data: json,
			success: function(data){
				$('#verify-email-send').removeAttr('disabled');

			     // Hide form elements
			     $(".verification-msg").hide();
			     $('#verify-email-form #emial-domain-observer').empty();
			     $('#verify-email-form').find('div.row div').hide();
			     $('#verify-email-form').find('input').val(json.email);
			     $(".email-verification-fields").hide();

			     if(json.isEmailDomainValid && json.isEmailDomainValid == true){
			     	$("#workflow-verify-email").find('.modal-header .modal-title').text("{{agile_lng_translate 'email' 'email-verified'}}");
			     	$('#verify-email-form').find('div span#alert-msg').html("<p class='m-l' style='float: left;margin-right: 10px;margin-top: 1px;'>&#39;"+json.email+"&#39; {{agile_lng_translate 'email' 'is-now-verified-successfully'}}.</p>");
			     }			     	
			     else{
			     	$('#verify-email-form').find('div span#alert-msg').html("<p class='m-l'>{{agile_lng_translate 'emails' 'verification-sent'}} &#39;"+json.email+"&#39;. {{agile_lng_translate 'emails' 'verification-process'}}</p>");
			     }
			     
				 $('#verify-email-send').removeAttr('href').removeAttr('id').off('click').attr('data-dismiss', 'modal').text('{{agile_lng_translate "deal-view" "done"}}');
			},
			error: function(response)
			{
				$('#verify-email-send').removeAttr('disabled');
				
				if(response.responseText == 'Email not verified yet.')
				{ 
					// Hide form elements
					$(".verification-msg").hide();
			    	$('#verify-email-form #emial-domain-observer').empty();
					$('#verify-email-form').find('div.row div').hide();
					$('#verify-email-form').find('div.row input').val(json.email);
			     	 $(".email-verification-fields").hide()
					$('#verify-email-form').find('div span#alert-msg').html("<p class='m-l'> &#39;"+json.email+"&#39; {{agile_lng_translate 'emails' 'email-not-verified-error'}}</p>");
					$('#verify-email-send').removeAttr('href').removeAttr('id').off('click').attr('data-dismiss', 'modal').text('{{agile_lng_translate "deal-view" "done"}}');
					
//					$("#verify-ignore").show();
					return;
			     }

					$('#workflow-verify-email').modal('hide');
				}
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

		$(this).attr('disabled', 'disabled').text("{{agile_lng_translate 'emails' 'unsubscribing'}}");

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

				showNotyPopUp("information", "{{agile_lng_translate 'emails' 'unsubscribe-done'}}", "top");
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
		if(!confirm("{{agile_lng_translate 'emails' 'confirm-resubscribe'}} " + $(this).attr("contact_name") + " {{agile_lng_translate 'contacts-view' 'to'}} " + $(this).attr("campaign_name") + " {{agile_lng_translate 'campaigns' 'campaign-sm'}}?"))
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

function varifyWhiteLebal(emailDomain, callback){
	accessUrlUsingAjax('core/api/emails/sendgrid/whitelabel/validate?emailDomain='+emailDomain, 
              		function(data){ 
              			
              			if(callback && typeof (callback) == "function")
              				callback(data);
              		});
}

function getEmailDomain(email){
	var email_string_array = email.split("@");
	var domain_string_location = email_string_array.length -1;
	return email_string_array[domain_string_location];
}

function isGlobalDomain(domain){
	var validDomains = ["gmail.com","yahoo.com","outlook.com","aol.com","hotmail.com"];
	for(var index = 0 ; index < validDomains.length ; index++){
            if(validDomains[index] == domain)
            	return true;
    }
    return false;
}