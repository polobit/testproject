package com.agilecrm.contact.sync.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.scribe.utils.Preconditions;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.sync.ImportStatus;
import com.agilecrm.contact.sync.SyncClient;
import com.agilecrm.contact.sync.wrapper.WrapperServiceBuilder;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.email.SendMail;
import com.thirdparty.google.ContactPrefs;

/**
 * <code>ContactSyncService</code> provide method for wrap Contacts from third
 * party to agile domain and send Notification of import status to domain user
 * third party client needs to implement these method
 * 
 * @author jitendra
 * 
 */
public abstract class ContactSyncService implements SyncService
{
    protected static final String NOTIFICATION_TEMPLATE = "contact_sync_notification_template";

    protected WrapperServiceBuilder contactWrapper = null;

    /**
     * To check if it contacts limit is exceeded in current plan
     */
    BillingRestriction restriction = BillingRestrictionUtil.getBillingRestriction(true);
    DaoBillingRestriction contactRestriction = DaoBillingRestriction.getInstace(
	    DaoBillingRestriction.ClassEntities.Contact.toString(), restriction);

    protected ContactPrefs prefs;
    protected int total_synced_contact;

    @Override
    public SyncService createService(ContactPrefs pref)
    {
	Preconditions.checkNotNull(pref, "Prefs can't be null");
	this.prefs = pref;
	return this;
    }

    public boolean isLimitExceeded()
    {
	if (total_synced_contact >= MAX_SYNC_LIMIT)
	{
	    sendNotification(prefs.client.getNotificationEmailSubject());
	    return true;
	}
	sendNotification(prefs.client.getNotificationEmailSubject());
	return false;
    }

    // public List<Contact> retrieveContact();

    protected Map<ImportStatus, Integer> syncStatus;

    {
	syncStatus = new HashMap<ImportStatus, Integer>();
	for (ImportStatus status : ImportStatus.values())
	{
	    syncStatus.put(status, 0);
	}
    }

    public Contact wrapContactToAgileSchemaAndSave(Object object)
    {
	Contact contact = wrapContactToAgileSchema(object);

	if (contact == null)
	    return contact;

	++total_synced_contact;

	saveContact(contact);
	return contact;
    }

    private Contact wrapContactToAgileSchema(Object object)
    {
	if (contactWrapper == null)
	    try
	    {
		contactWrapper = getWrapperService().newInstance().buildWrapper(object);
	    }
	    catch (InstantiationException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	    catch (IllegalAccessException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }

	return contactWrapper.buildWrapper(object).buildContact();
    }

    /**
     * send Email Notification status to domain user after import completed.this
     * method needs to be called from third party client
     * 
     * @param Map
     *            Map<ImportStatus,Integer> map
     * @param notificationSubject
     *            String value of subject
     * 
     * 
     */

    public void sendNotification(String notificationSubject)
    {
	DomainUser user = DomainUserUtil.getCurrentDomainUser();

	if (user != null)
	{
	    SendMail.sendMail(user.email, notificationSubject, NOTIFICATION_TEMPLATE, new Object[] { user, syncStatus });
	}
    }

    @Override
    public void saveContact(List<Contact> contacts)
    {
	for (Contact contact : contacts)
	{
	    saveContact(contact);
	}

	// Sets total number of contacts imported/updated
	syncStatus.put(ImportStatus.TOTAL, syncStatus.get(ImportStatus.TOTAL) + contacts.size());

    }

    private void saveContact(Contact contact)
    {
	if (ContactUtil.isDuplicateContact(contact))
	{
	    contact = ContactUtil.mergeContactFields(contact);
	    contact.save();
	    syncStatus.put(ImportStatus.MERGED_CONTACTS, syncStatus.get(ImportStatus.MERGED_CONTACTS) + 1);
	}
	else if (contactRestriction.can_create())
	{
	    addTagToContact(contact);
	    contact.save();
	    restriction.contacts_count++;
	    syncStatus.put(ImportStatus.NEW_CONTACTS, syncStatus.get(ImportStatus.NEW_CONTACTS) + 1);
	}
	else
	{
	    syncStatus.put(ImportStatus.LIMIT_REACHED, syncStatus.get(ImportStatus.LIMIT_REACHED) + 1);
	}

    }

    private void addTagToContact(Contact contact)
    {
	String tag;
	if (prefs.client == SyncClient.GOOGLE)
	    tag = "gmail contact".toLowerCase();
	else
	    tag = prefs.client.toString().toLowerCase() + " contact";

	contact.addTags(StringUtils.capitalize(tag));
    }
}
