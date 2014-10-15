function hasScope(scope)
{
	var scopes = CURRENT_DOMAIN_USER.scopes;
	
	if(!scopes)
		return true;
	
	return jQuery.inArray(scope, scopes) > -1;
}


function showContactsImportAccessDeniedMessage(el)
{
   $(el).html("<h4>Access denied to sync contacts. Please contact Admin</h4>");	
}

function hasScope(scope_constant)
{
	return (CURRENT_DOMAIN_USER.scopes && $.inArray(scope_constant, CURRENT_DOMAIN_USER.scopes) != -1);
}

function canEditContacts()
{
	return hasScope("DELETE_CONTACTS");
}

function canEditContacts()
{
	return hasScope("VIEW_CONTACTS");
}

function canCreateContacts()
{
	return hasScope("CREATE_CONTACT");
}

function canImportcontacts()
{
	if(!hasScope("CREATE_CONTACT"))
		return false; 
	return hasScope("IMPORT_CONTACTS");
}