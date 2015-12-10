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

function canImportContacts()
{
	if(!hasScope("CREATE_CONTACT"))
		return false; 
	return hasScope("IMPORT_CONTACTS");
}

function canExportContacts()
{
	return hasScope("EXPORT_CONTACTS");
}

function canEditContact(owner_id)
{
	if((hasScope('UPDATE_CONTACTS') || hasScope('DELETE_CONTACTS')) || CURRENT_DOMAIN_USER.id == owner_id)
		return true;
	
	return false;
}

function canEditCurrentContact()
{
	var contact_model = App_Contacts.contactDetailView.model;
	
	if(!contact_model)
		return;
	var contact = contact_model.toJSON();
	
	if(!contact.owner)
		return true;
	
	return canEditContact(contact.owner.id);
}

function canRunBulkOperations()
{
	if(!hasScope('VIEW_CONTACTS'))
		return true;
	
	if(!(hasScope('UPDATE_CONTACTS') || hasScope('DELETE_CONTACTS')))
		return false;
	
	return true;
}