// Get Emails
function agile_get_emails()
{
	var emails = [];

	// If Local Host,
	if (Is_Localhost)
	{
		emails = [
				{ email_from : "devika@faxdesk.com" },
				{ name_from : "Devika Jakkannagari" },
				{ email_to : "abhi@gashok.mygbiz.com;rahul@gashok.mygbiz.com;dheeraj@gashok.mygbiz.com;chandan@gashok.mygbiz.com;abhiranjan@gashok.mygbiz.com" },
				{ name_to : "Abhi;;D j p;;" }, { email_cc : "devikatest1@gmail.com;devikatest@gmail.com;teju@gmail.com" }, { name_cc : "Dev T1;;Teju" },
				{ email : "devikatest@gmail.com" }, { email : "test1@gmail.com" }, { email : "test1@gmail.com" }, { email : "pbx.kumar@gmail.com" }
		];

		// emails = [{email:"devikatest@gmail.com"}];
		//console.log(JSON.stringify(emails));

		return validateEmails(parse_emails(emails));
	}

	// Google Matches in 2D format
	emails = google.contentmatch.getContentMatches();
	//console.log(emails);
	//console.log(JSON.stringify(emails));
	return validateEmails(parse_emails(emails));
}

function validateEmails(emails){
	for(var email in emails){
		console.log('--------',emails[email]);
	}
	return emails;
}

// Convert 2d to 1d
function parse_emails(emails)
{
	return $.merge(collate_emails(emails, "from"), collate_emails(emails, "to")).concat(collate_emails(emails, "cc")).concat(agile_grep(emails, "email"));
}

// Finds email_key and then finds name_key and collates them
function collate_emails(emails, key)
{
	var emails1D = [];

	var email_key_array = agile_grep(emails, "email_" + key);
	if (email_key_array.length > 0)
	{
		// Parse from names
		email_key_name_array = agile_grep(emails, "name_" + key);
		$.each(email_key_array, function(index, email_key)
		{
			var email = {};
			email.key = key;
			email.email = email_key;
			
			if(email_key_name_array[index])
				email.name = email_key_name_array[index].trim();
			else
				email.name = "";
			emails1D.push(email);
		});
	}
console.log('--------',emails1D);
	return emails1D;
}

// Find for a certain element in emails
function agile_grep(array, key)
{
	var map = jQuery.grep(array, function(obj)
	{
		if (obj.hasOwnProperty(key))
			return obj; // or return obj.name, whatever.
	});

	if (map.length == 1 && key != 'email')
	{
		// console.log(map[0][key].split(";"));
		return map[0][key].split(";");
	}

	// console.log(map);
	return map;
}
