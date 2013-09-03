/**
 * One time domain registration:- let user enter the domain to register in AgileCRM.
 * Extract mail domain of gmail account. Generate a URL with 
 * one time session key + mail domain + user entered domain.
 * 
 * @author Dheeraj
 */

/**
 * One time user domain registration.
 * 
 * @method agile_user_setup
 * @param {Object}
 *            data Contains one time session key and URL for request of
 *            registration.
 */
function agile_user_setup(data) {

	// E-mail from gmail account abc@userdomain.com --> domain = userdomain.com
	var domain = gadgets.util.getUrlParameters().pid;
	// Make URL to set-up user account.
	var Url_Root = data + "&hd=" + domain;

	// Create UI to let user enter its desired agile domain name.
	$('#agile_content').append('<div class="well well-small one-time-setup" style="margin:0 0 5px 5px; display:none;">'
			+'<p>Associate your account - one time setup</p>'
			+'<input type="text" id="user_domain" placeholder="Enter your Domain." style="margin:0 10px 0 0;" />'
			+'<input type="button" value="Associate" onclick=agile_gadget_open_popup("'+Url_Root+'") class="btn btn-primary" style="padding:2px 6px 2px;">'
			+'<span id="notify_user" style="display:none; margin-left:20px; color:indianred;"><i>Please enter your domain.</i></span>'
			+'</div>');

	// Hide Loading Icon
	$('#loading').hide();
	$('.one-time-setup').show(function(){
			gadgets.window.adjustHeight();
	});
}

/**
 * Open a pop-up window with URL for registration.
 * 
 * @method agile_gadget_open_popup
 * @param {String}
 *            url URL for domain registration.
 */
function agile_gadget_open_popup(Agile_Url) {

	var User_Domain = $('#user_domain');
	// Text box validation for empty box.
	if (User_Domain.val() == 'Enter your Domain' || User_Domain.val() == '') {
		$('#notify_user').fadeIn().delay(3000).hide(1);
		User_Domain.focus();
	}
	// Open pop-up.
	else {

		Agile_Url += '&domain=' + User_Domain.val();
		User_Domain.val("");
		console.log(Agile_Url);
		
		// Hide Loading Icon
		$('.one-time-setup').hide();
		$('#loading').show(function(){
			gadgets.window.adjustHeight();
		});
		
		// Send cross domain request.
		agile_json(Agile_Url, function(response) {
			
			var data = response.content;
			// Associate if user exists.
			if(data.status != false) {
				
				var popup = window.open(Agile_Url, 'OpenID', 'height=400,width=400');
				// Check every 100 ms if the popup is closed.
				finished_interval = setInterval(function() {
					/*
					 * If the popup is closed, we've either finished OpenID, or the user
					 * closed it. Verify with the server in case the user closed the
					 * popup.
					 */
					if (popup.closed) {
						clearInterval(finished_interval);
						$("#loading").hide();
						// Reset user preferences
					    var prefs = new gadgets.Prefs();
						prefs.set("agile_user_popup", "");
						prefs.set("agile_user_exists", "");
						agile_login();
					}
				}, 100);
			}
			
			// User does not exists.
			else {
				if(data.error_session == true){
					// Create UI for session error message.
					$('#agile_content').append('<div class="well well-small resp-status-false" style="margin:0 0 5px 5px; display:none;">'
							+'<p id="resp_msg">"'+data.error_msg+'"</p>'
							+'</div>');
				}
				
				else{
					// Create UI to let user enter its desired agile domain name.
					$('#agile_content').append('<div class="well well-small resp-status-false" style="margin:0 0 5px 5px; display:none;">'
							+'<p id="resp_msg">"'+data.error_msg+'"</p>'
							+'<a class="btn btn-primary" href="https://my.agilecrm.com/choose-domain" target="_blank" style="padding:2px 6px 2px;">Register</a>'
							+'</div>');
				}
				
				// Hide Loading Icon
				$('#loading').hide();
				$('.resp-status-false').show(function(){
					gadgets.window.adjustHeight();
				});
				// Reset user preferences
			    var prefs = new gadgets.Prefs();
				prefs.set("agile_user_popup", "");
				prefs.set("agile_user_exists", "");
			}
		});
	}
}
