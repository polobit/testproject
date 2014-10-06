function hasScope(scope)
{
	var scopes = CURRENT_DOMAIN_USER.scopes;
	
	if(!scopes)
		return true;
	
	return jQuery.inArray(scope, scopes) > -1;
}

function canImportContacts()
{
	return hasScope("IMPORT_CONTACTS");
}

function showContactsImportAccessDeniedMessage(el)
{
   $(el).html("<h4>Access denied to sync contacts. Please contact Admin</h4>");	
}