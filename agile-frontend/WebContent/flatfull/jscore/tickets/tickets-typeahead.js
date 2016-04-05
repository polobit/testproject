var Tickets_Typeahead = {
	 contact_typeahead :function(data){

	if (data == null)
		return;

	// To store contact names list
	var contact_names_list = [];

	/*
	 * Iterates through all the contacts and get name property
	 */
	$.each(data, function(index, contact)
	{
		var contact_name;

		// Appends first and last name to push in to a list
		contact_name = getContactName(contact) + "-" + contact.id;

		// Spaces are removed from the name, name should be used as a key in map
		// "TYPEHEAD_TAGS"
		contact_names_list.push(contact_name.split(" ").join(""));
	});

	// Returns list of contact/company names
	return contact_names_list;
},

 cc_emails_typeahead :function(data){

	if (data == null)
		return;

	// To store contact names list
	var contact_names_list = [];

	/*
	 * Iterates through all the contacts and get name property
	 */
	$.each(data, function(index, contact)
	{
		var contact_name;

		// Appends first and last name to push in to a list
		contact_name = getContactName(contact) + "-" + contact.id;

		// Spaces are removed from the name, name should be used as a key in map
		// "TYPEHEAD_TAGS"
		contact_names_list.push(contact_name.split(" ").join(""));
	});

	// Returns list of contact/company names
	return contact_names_list;
}


};