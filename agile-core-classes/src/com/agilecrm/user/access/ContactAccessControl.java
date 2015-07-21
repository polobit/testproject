package com.agilecrm.user.access;

import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Query;

/**
 * <code>ContactAccess</code> class checks if current user can
 * update/create/import/export contacts. It checks based on the scopes saved in
 * user info/domain user class
 * 
 * @author yaswanth
 * 
 */
public class ContactAccessControl extends UserAccessControl
{

    Contact contact = null;

    /**
     * Type casts entity object in to contact type
     */

    public void init()
    {
	try
	{
	    if (entityObject != null)
		contact = (Contact) entityObject;
	    else
		contact = new Contact();
	    System.out.println("scopes in contact checking");
	    System.out.println(getCurrentUserScopes());
	}
	catch (ClassCastException e)
	{
	    contact = new Contact();
	}
    }

    @Override
    public void setObject(Object object)
    {
	if (object != null)
	    contact = (Contact) object;
	else
	    contact = new Contact();
    }

    public boolean canCreate()
    {
	// If contact is defined it checks for update operation if owner in the
	// contact and current owner is different
	if (!isNew() && !checkOwner())
	{
	    return hasScope(UserAccessScopes.DELETE_CONTACTS);
	}

	if (isNew())
	    return hasScope(UserAccessScopes.CREATE_CONTACT);

	return true;
    }

    public boolean canDelete()
    {
	// Delete condition is checked only if current user is not owner of the
	// contact
	if (!isNew() && !checkOwner())
	{
	    return hasScope(UserAccessScopes.DELETE_CONTACTS);
	}

	return true;
    }

    /**
     * Checks if user can read other users contacts
     */
    public boolean canRead()
    {

	// If contact is defined it checks for update operation if owner in the
	// contact and current owner is different
	if (!checkOwner() || contact.getContactOwnerKey() == null)
	    return hasScope(UserAccessScopes.VIEW_CONTACTS);

	return true;
    }

    /**
     * Checks if current user is owner of the contact he is trying to access.
     * 
     * @return boolean
     */
    public boolean checkOwner()
    {
	if (contact == null || contact.getContactOwnerKey() == null)
	    return true;

	// Gets current user id and contact owner id and checks for equity
	Long currentContactOwnerId = contact.getContactOwnerKey().getId();
	UserInfo info = SessionManager.get();

	if (info == null)
	    return true;

	System.out.println("id" + info.getDomainId() + ", " + currentContactOwnerId);

	if (info.getDomainId().equals(currentContactOwnerId))
	    return true;

	return false;
    }

    /**
     * Checks if contact is new
     * 
     * @return
     */
    public boolean isNew()
    {
	if (contact == null || contact.id != null)
	    return false;

	return true;
    }

    public boolean canImport()
    {

	return hasScope(UserAccessScopes.IMPORT_CONTACTS);
    }

    public boolean canExport()
    {

	return hasScope(UserAccessScopes.EXPORT_CONTACTS);
    }

    public <T> Query<T> modifyDaoFetchQuery(Query<T> query)
    {
	UserInfo info = SessionManager.get();
	if (info == null)
	    return query;

	Key<DomainUser> ownerKey = new Key<DomainUser>(DomainUser.class, info.getDomainId());
	return query.filter("owner_key", ownerKey);
    }

    @Override
    public <T> Query<T> modifyQuery(Query<T> query)
    {
	return modifyDaoFetchQuery(query);
    }

    @Override
    public void modifyTextSearchQuery(List<SearchRule> rules)
    {
	UserInfo info = SessionManager.get();
	if (info == null)
	    return;

	SearchRule rule = new SearchRule();
	rule.RHS = info.getDomainId().toString();
	rule.CONDITION = RuleCondition.EQUALS;
	rule.LHS = "owner_id";

	rules.add(rule);
    }
}
