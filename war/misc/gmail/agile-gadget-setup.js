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
	var domain = gadgets.util.getUrlParameters()['parent']
			.match(/.+\/a\/(.+)\/html/)[1];
	// Make URL to set-up user account.
	var Url_Root = data.popup + "&hd=" + domain;

	// Create UI to let user enter its desired agile domain name.
	$('#output').html('<p>Associate your account - one time setup</p>'
			+'<input type="text" id="user_domain" placeholder="Enter your Domain." style="margin:0 10px 0 0;" />'
			+'<input type="button" value="Go" onclick=agile_gadget_open_popup("'+Url_Root+'") >'
			+'<span id="notify_user" style="display:none; margin-left:20px;">Please enter your domain.</span>');

	// Hide Loading Icon
	$('#loading').css('display', 'none');
	gadgets.window.adjustHeight();
}

/**
 * Open a pop-up window with URL for registration.
 * 
 * @method agile_gadget_open_popup
 * @param {String}
 *            url URL for domain registration.
 */
function agile_gadget_open_popup(url) {

	var User_Domain = $('#user_domain');
	// Text box validation for empty box.
	if (User_Domain.val() == 'Enter your Domain' || User_Domain.val() == '') {
		$('#notify_user').fadeIn().delay(3000).hide(1);
		User_Domain.focus();
	}
	// Open pop-up.
	else {

		url += '&domain=' + User_Domain.val();
		User_Domain.val("");
		console.log(url);

		var popup = window.open(url, 'OpenID', 'height=400,width=400');
		// Check every 100 ms if the popup is closed.
		finished_interval = setInterval(function() {
			/*
			 * If the popup is closed, we've either finished OpenID, or the user
			 * closed it. Verify with the server in case the user closed the
			 * popup.
			 */
			if (popup.closed) {
				clearInterval(finished_interval);
				agile_gadget_erase_cookie('Agile_Gadget_Cookie');
				agile_login();
			}
		}, 100);
	}
}
