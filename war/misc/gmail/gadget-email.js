/**
 * Generates array of emails in case of retrieved from mail body and sender
 * info, and takes hard coded array in case of Local host. Then sort for
 * duplicate emails and rearrange emails.
 * 
 * @author Dheeraj
 */

/**
 * Extract emails from mail body and semder's info.
 * 
 * @method get_emails
 * @param {Boolean}
 *            bool to decide whether mail asked for Local host or gmail.
 * @returns {Array} returns a formatted array.
 */
function get_emails(bool) {

	var emails = [];
	var sender_name, sender_email = "";

	// Generate mails from gmail.
	if (bool) {
		// Fetch the array of content matches.
		matches = google.contentmatch.getContentMatches();

		// Iterate through the array and display output for each match.
		for ( var match in matches) {
			for ( var key in matches[match]) {
				// If emails
				if (key == "email" || key == "email_sender") {
					// If sender's email ignore don't add to mail array.
					if (key != "email_sender")
						emails.push(matches[match][key]);
					else
						// Store email sender's mail in variable.
						sender_email = matches[match][key];
				}
				// If email sender's name
				if (key == "email_name")
					// Store email sender's name in variable.
					sender_name = matches[match][key];
			}
		}
	}
	// Take email and sender's info for local host.
	else {
		emails = [ "manohar@invox.com", "maruthi.motors@invox.com",
				"dheeraj@invox.com", "praveen@invox.com",
				"maruthi.motors@invox.com" ];
		sender_email = "praveen@invox.com";
		sender_name = "Praveen Kumar";
	}

	// Return formatted mail info array.
	return email_formatter(emails, sender_email, sender_name);
}

/**
 * Format email in order and check for duplicate emails and put email sender's
 * email-id at first position in array.
 * 
 * @method email_formatter
 * @param {Array}
 *            emails unsorted mail list.
 * @param {String}
 *            sender_email email sender's mail-id.
 * @param {String}
 *            sender_name email sender's name.
 */
function email_formatter(emails, sender_email, sender_name) {

	var index = {};
	index[sender_email] = true;
	/*
	 * Traverse array from end to start so removing the current item from the
	 * array. doesn't mess up the traversal.
	 */
	for ( var i = emails.length - 1; i >= 0; i--) {
		if (emails[i] in index) {
			// remove this item
			emails.splice(i, 1);
		} else {
			// add this value index
			index[emails[i]] = true;
		}
	}

	// Set sender of email as first mail in the mail list to pass in get contact
	emails.splice(0, 0, sender_email);
	if (!Is_Localhost)
		gadgets.window.adjustHeight();
	
	// Return formatted mail info as array.
	return [ emails, sender_name, sender_email ];
}