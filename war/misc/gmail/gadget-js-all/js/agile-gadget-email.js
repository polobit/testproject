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
	var names = [];
	var matches = [];
	
	// Generate mails from gmail.
	if (bool) {
		// Fetch the array of content matches.
		matches = google.contentmatch.getContentMatches();
	}
	
	// Take email and sender's info for local host.
	else {
		matches = [{email_from: "dheeraj@invox.com"},{name_from: " Dheeraj Patidar "},{email_to: "dj.mtech11@gmail.com"}, 
		       		{name_to: "Jack "},{email_cc: "chandan@agilecrm.com;gashok@gashok.mygbiz.com;yaswanth@agilecrm.com"},
					{name_cc: "Chandan Kumar;;Yaswanth Praveen"}, 
		       		{email: "Subject1@gmail.com"},{email: "subject2@gmail.com"},{email: "tutu@gmaill.com"},
		       		{email: "meme@bhiya.com"},{email: "pohe@jirawan.com"}]
	}
	
	// Iterate through the array and display output for each match.
	for ( var match in matches) {
		for ( var key in matches[match]) {
			
			var Common_Key = (key).split("_");
			var Stringed_Mail_Data = (matches[match][key]).split(";");
			for(var loop in Stringed_Mail_Data){
				// Check emails
				if (Common_Key[0] == "email") {
					emails.push(Stringed_Mail_Data[loop]);
				}
				// Check names
				else {
					names.push(Stringed_Mail_Data[loop]);
				}
			}
		}
	}
	
	var emailLength = emails.length;
	var nameLength = names.length;
	
	for(var loop = nameLength; loop <= emailLength; loop++){
		names[loop] = "";
	}
	
	console.log(emails);
	console.log(names);
	
	// Return formatted mail and info array.
	return [emails, names];
}