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
	var Url_Root = data.content.popup + "&hd=" + domain;

	// Create UI to let user enter its desired agile domain name.
	$('#output')
			.append(
					'<p>Associate your account - one time setup</p>'
							+ '<input type="text" id="user_domain" placeholder="Enter your Domain." style="margin:0 10px 0 0;"/>'
							+ '<input type="button" value="Go" onclick="open_popup("'
							+ Url_Root
							+ '")"/>'
							+ '<p id="notify_user" style="display:none;">Please enter your domain.</p>');

	// Hide Loading Icon
	$('.loading').css('display', 'none');
	gadgets.window.adjustHeight();
}

/**
 * Open a pop-up window with URL for registration.
 * 
 * @method agile_open_popup
 * @param {String}
 *            url URL for domain registration.
 */
function agile_open_popup(url) {

	var User_Domain = $('#user_domain');
	// Text box validation for empty box.
	if (User_Domain.val() == 'Enter your Domain' || User_Domain.val() == '') {
		$('#notify_user').show().delay(3000).hide(1);
		User_Domain.focus();
		User_Domain.select();
	}
	// Open pop-up.
	else {

		url += '&domain=' + User_Domain.value;
		User_Domain.val() = '';
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
				agile_erase_cookie('Agile_Gadget_Cookie');
				login();
			}
		}, 100);
	}
}
