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
 *            Popup_Url Contains one time session key with URL for request of
 *            association.
 */
function agile_user_setup(Popup_Url) {
	
	//  ------ Hide Loading Icon ------ 
	$('#loading').hide();
	
	//  ------ E-mail from gmail account abc@userdomain.com --> domain = userdomain.com ------ 
	var Domain = gadgets.util.getUrlParameters().pid;
	//  ------ Make URL to set-up user account. ------ 
	var Url_Root = Popup_Url + "&hd=" + Domain;
	//  ------ Clear old UI. ------ 
	$('#agile_content').html("");
	//  ------ Create UI to let user enter its desired agile domain name. ------ 
	$('#agile_content').append('<div class="well well-small agile-one-time-setup" style="margin:0px; border-radius:0px; background-color:#f2f2f2; box-shadow:none; border-bottom:0px; border-left:0px; border-right:0px;">'
			+'<p>Associate your account - one time setup</p>'
			+'<input id="user_domain" class="input-medium" placeholder="my domain" style="vertical-align:baseline; margin-bottom:4px;" type="text" />'
			+'<span style="font-weight:bold;">.agilecrm.com</span>'
			+'<p style="color:#b2b0b1;"><small>Enter the part before ".agilecrm.com" that you use to access your Agile CRM account.</small></p>'
			+'<P style="margin:0px;"><input type="button" value="Associate" onclick=agile_gadget_open_popup("'+Url_Root+'") class="btn btn-primary" style="padding:2px 6px 2px;">'
			+'<span id="notify_user" style="display:none; margin-left:20px; color:indianred;"><i>Please enter your domain.</i></span></P>'
			+'</div>');
	
	//  ------ Adjust gadget height. ------ 
	gadgets.window.adjustHeight();
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
	//  ------ Text box validation for empty box. ------ 
	if (User_Domain.val() == 'my domain' || User_Domain.val() == '') {
		$('#notify_user').fadeIn().delay(3000).fadeOut();
		User_Domain.focus();
	}
	//  ------ Open pop-up. ------ 
	else {

		Agile_Url += '&domain=' + User_Domain.val();
		User_Domain.val("");
		console.log(Agile_Url);
		
		//  ------ Hide GUI ------ 
		$('.agile-one-time-setup').hide();
		//  ------ Show Loading Icon ------ 
		$('#loading').show();
		gadgets.window.adjustHeight();
		
		var Popup = window.open(Agile_Url, 'OpenID', 'height=400,width=400');
		//  ------ Check every 100 ms if the popup is closed. ------ 
		finished_interval = setInterval(function() {
			/* ------ 
			 * If the popup is closed, we've either finished OpenID, or the user
			 * closed it. Verify with the server in case the user closed the
			 * popup. ------ 
			 */
			if (Popup.closed) {
				clearInterval(finished_interval);
				//  ------ Reset user preferences ------ 
			    var Agile_Gadget_Prefs = new gadgets.Prefs();
			    Agile_Gadget_Prefs.set("agile_user_expire_at", "0");
				Agile_Gadget_Prefs.set("agile_user_popup", "");
				Agile_Gadget_Prefs.set("agile_user_exists", "");
				//  ------ Re-login. ------ 
				agile_login();
			}
		}, 100);
	}
}
