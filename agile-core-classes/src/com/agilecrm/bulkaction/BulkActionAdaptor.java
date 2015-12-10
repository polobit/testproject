package com.agilecrm.bulkaction;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.access.UserAccessControl;
import com.agilecrm.user.access.UserAccessControl.AccessControlClasses;
import com.agilecrm.user.access.UserAccessScopes;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.googlecode.objectify.Key;

public abstract class BulkActionAdaptor implements DeferredTask
{
    /**
     * 
     */
    private static final long serialVersionUID = -7597339468507292123L;
    protected Set<Key<Contact>> contactKeySet;
    protected UserInfo info;
    protected String namespace;
    protected Key<DomainUser> key;
    private List<Contact> contacts = null;
    private DomainUser user = null;

    public void run()
    {
	// TODO Auto-generated method stub
	if (!isValidTask())
	    return;

	String oldNamespace = NamespaceManager.get();

	try
	{
	    NamespaceManager.set(namespace);
	    setSession();
	    performAction();
	}
	catch (Exception e)
	{
	    System.out.println("Error in subscribing campaign " + contactKeySet);
	    e.printStackTrace();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    protected List<Contact> fetchContacts()
    {
	if (contacts != null)
	    return contacts;

	try
	{
	    contacts = Contact.dao.fetchAllByKeys(new ArrayList<Key<Contact>>(contactKeySet));
	    // ContactUtil.processContacts(contacts);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    contacts = new ArrayList<Contact>();
	    for (Key<Contact> contactKey : contactKeySet)
	    {
		try
		{
		    contacts.add(Contact.dao.get(contactKey));
		}
		catch (Exception e1)
		{
		    e.printStackTrace();
		}
	    }
	}

	if (user != null)
	{

	    UserAccessControl access = UserAccessControl.getAccessControl(AccessControlClasses.Contact, null, user);

	    if (contacts != null && !access.hasScope(UserAccessScopes.DELETE_CONTACTS))
	    {
		Iterator<Contact> contactIterator = contacts.iterator();
		while (contactIterator.hasNext())
		{
		    Contact contact = contactIterator.next();
		    access.setObject(contact);
		    if (!access.canDelete())
			contactIterator.remove();
		}
	    }

	}

	return contacts;

    }

    private void setSession()
    {
	if (info != null)
	{
	    SessionManager.set(info);
	}

	if (key != null)
	{
	    user = DomainUserUtil.getDomainUser(key.getId());
	    if (user == null)
		return;

	    BulkActionUtil.setSessionManager(user);
	}

    }

    /**
     * Abstract method
     */
    public abstract boolean isValidTask();

    protected abstract void performAction();

}
