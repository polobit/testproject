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
 * @method agile_get_emails
 * @param {Boolean}
 *            bool Decide whether mail asked for Local host or gmail.
 * @returns {Array} Returns a formatted array.
 */
function agile_get_emails(bool) {

	var emails = [];
	var Sender_Name, Sender_Email = "";

	// Generate mails from gmail.
	if (bool) {
		// Fetch the array of content matches.
		matches = google.contentmatch.getContentMatches();

		// Iterate through the array and display output for each match.
		for ( var match in matches) {
			for ( var key in matches[match]) {
				// Check emails
				if (key == "email" || key == "email_sender") {
					// Ignore sender's email, don't add to mail array.
					if (key != "email_sender")
						emails.push(matches[match][key]);
					else
						// Store email sender's mail.
						Sender_Email = matches[match][key];
				}
				// Check email sender's name.
				if (key == "email_name")
					// Store email sender's name.
					matches[match][key] == (undefined || "" || null) ? Sender_Name = "" : Sender_Name = matches[match][key]; 
			}
		}
	}
	// Take email and sender's info for local host.
	else {
		emails = [ "manohar@invox.com", "maruthi.motors@invox.com",
				"dheeraj@invox.com", "praveen@invox.com",
				"maruthi.motors@invox.com", "adi.surendra.mohan.raju.morampudi@gmail.com" ];
		Sender_Email = "praveen@invox.com";
		Sender_Name = "Praveen Kumar";
	}

	// Return formatted mail and info array.
	return agile_email_formatter(emails, Sender_Email, Sender_Name);
}

/**
 * Check for duplicate emails and put email sender's email-id at first position
 * in array.
 * 
 * @method agile_email_formatter
 * @param {Array}
 *            emails Unsorted mail list.
 * @param {String}
 *            sender_email Email sender's mail-id.
 * @param {String}
 *            sender_name Email sender's name.
 */
function agile_email_formatter(emails, Sender_Email, Sender_Name) {

	var index = {};
	index[Sender_Email] = true;
	/*
	 * Traverse array from end to start, so removing the current item from the
	 * array, doesn't mess up the traversal.
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

	// Set sender of email as first mail in the mail list.
	emails.splice(0, 0, Sender_Email);
	// Return formatted mail and info array.
	return [ emails, Sender_Name, Sender_Email ];
}