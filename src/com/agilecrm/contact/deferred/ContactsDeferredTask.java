package com.agilecrm.contact.deferred;

import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.util.CacheUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.googlecode.objectify.Key;

/**
 * <code>ContactsDeferredTask</code> creates a deferred task which saves
 * contacts list in the Namespace specified. It needs to be initialized with
 * list of contacts, namespace and DomainUser key.
 * 
 * It is accessed from {@link ContactUtil} class to create deferred task with
 * list of contacts.
 * 
 * @author Yaswanth
 * 
 * @since December 2012
 * 
 */
public class ContactsDeferredTask implements DeferredTask
{

    /**
     * Represents key of the object in memcache
     */
    private String cacheKey;

    /**
     * Namespace in which contact is to be saved
     */
    private String namespace;

    /**
     * DomainUser key to set the owner field of the contact
     */
    private Key<DomainUser> owner_key;

    public ContactsDeferredTask(String cacheKey, String namespace,
	    Key<DomainUser> owner_key)
    {
	this.cacheKey = cacheKey;
	this.namespace = namespace;
	this.owner_key = owner_key;
    }

    @Override
    public void run()
    {
	// If key doesn't exist, returns with out processing the request
	if (!CacheUtil.isPresent(cacheKey))
	    return;

	// Gets the contacts list from the memcache
	List<Contact> contacts = (List<Contact>) CacheUtil.get(cacheKey);

	// Gets the current Namespace
	String oldNamespace = NamespaceManager.get();

	// Sets the new name space sent, to save the contact
	NamespaceManager.set(namespace);

	// Iterates through each contact, sets owner_key and save the contact
	for (Contact contact : contacts)
	{
	    // Sets the domain user key in contact
	    // contact.setDomainUser(owner_key);

	    // Saves the contact
	    contact.save();
	}

	// Sets back the old Namespace
	NamespaceManager.set(oldNamespace);

	// Removes the object from the memcache after the contacts are saved
	CacheUtil.remove(cacheKey);
    }
}
