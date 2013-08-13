/**
 * One time domain registration:- Retrieve the domain of the current user.
 * gadgets.util.getUrlParameters()['parent'] returns a value (mail domain of
 * gmail account) of the form: http(s)://mail.google.com/mail/domain.com/html
 * for Gmail (other containers are similar). The example below shows a regular
 * expression for use with Gmail. For Calendar, use this regular expression
 * instead: /calendar\/hosted\/([^\/]+)/
 * 
 * @author Dheeraj
 */

/**
 * One time user domain registration.
 * 
 * @method user_setup
 * @param {Object}
 *            data contains one time session key and URL for request of
 *            registration.
 */
function user_setup(data) {

	/*
	 * E-mail from gmail account abc@userdomain.com --> domain = userdomain.com
	 */
	var domain = gadgets.util.getUrlParameters()['parent']
			.match(/.+\/a\/(.+)\/html/)[1];
	// Making URL to set-up user account.
	var url_root = data.content.popup + "&hd=" + domain;

	/*
	 * Creating text box and Go button to let user enter its desired agile
	 * domain name.
	 */

	$('#output')
			.append(
					'<p>Associate your account - one time setup</p>'
							+ '<input type="text" id="user_domain" placeholder="Enter your Domain." style="margin:0 10px 0 0;"/>'
							+ '<input type="button" value="Go" onclick="openPopup("'
							+ url_root + '")"/>');

	/*
	 * Hide Loading Icon
	 */
	document.getElementById('loading').style.display = 'none';
	gadgets.window.adjustHeight();
}

/**
 * Open a pop-up window with URL for registration.
 * 
 * @method openPopup
 * @param {String}
 *            url URL for domain registration.
 */
function openPopup(url) {

	var userDomain = document.getElementById('user_domain');
	// Text box validation for empty box
	if (userDomain.value == 'Enter your Domain' || userDomain.value == '') {
		alert("Please enter your domain !");
		userDomain.focus();
		userDomain.select();
	} else {

		url += '&domain=' + userDomain.value;
		userDomain.value = '';
		console.log(url);

		var popup = window.open(url, 'OpenID', 'height=400,width=400');
		// Check every 100 ms if the popup is closed.
		finishedInterval = setInterval(function() {
			/*
			 * If the popup is closed, we've either finished OpenID, or the user
			 * closed it. Verify with the server in case the user closed the
			 * popup.
			 */
			if (popup.closed) {
				login();
				clearInterval(finishedInterval);
			}
		}, 100);
	}
}
