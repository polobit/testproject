/**
 * @auther jitendra
 * @since 2014
 */
package com.agilecrm.contact.sync.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.scribe.utils.Preconditions;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.sync.ImportStatus;
import com.agilecrm.contact.sync.Type;
import com.agilecrm.contact.sync.wrapper.ContactWrapper;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.access.UserAccessControl;
import com.agilecrm.user.access.UserAccessControl.AccessControlClasses;
import com.agilecrm.user.access.exception.AccessDeniedException;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.email.SendMail;
import com.googlecode.objectify.Key;
import com.thirdparty.google.ContactPrefs;

/**
 * <code>ContactSyncService</code> provide method for wrap Contacts from third
 * party to agile domain and send Notification of import status to domain user
 * third party client needs to implement these method
 * 
 * @author jitendra
 * 
 */
public abstract class ContactSyncService implements IContactSyncService
{

    String bulk_action_tracker = String.valueOf(System.currentTimeMillis());

    /** NOTIFICATION_TEMPLATE. */
    protected static final String NOTIFICATION_TEMPLATE = "contact_sync_notification_template";

    /** contact wrapper. */
    protected ContactWrapper contactWrapper = null;

    /**
     * To check if it contacts limit is exceeded in current plan
     */
    protected BillingRestriction restriction = BillingRestrictionUtil.getBillingRestriction(true);

    /** contact restriction. */
    DaoBillingRestriction contactRestriction = DaoBillingRestriction.getInstace(
	    DaoBillingRestriction.ClassEntities.Contact.toString(), restriction);

    /** ContactPrefs. */
    protected ContactPrefs prefs;

    /** total_synced_contact. */
    protected int total_synced_contact;

    private UserAccessControl accessControl = null;

    /**
     * creates ContactSyncService Instance at runtime follows Dynamic
     * Polymorphism
     */
    @Override
    public IContactSyncService createService(ContactPrefs pref)
    {
	Preconditions.checkNotNull(pref, "Prefs can't be null");
	this.prefs = pref;
	Key<DomainUser> key = prefs.getDomainUser();
	if (key == null)
	    return null;
	DomainUser user = DomainUserUtil.getDomainUser(key.getId());
	if (user == null)
	    return null;

	accessControl = UserAccessControl.getAccessControl(AccessControlClasses.Contact, null, user);
	UserInfo info = new UserInfo("agilecrm.com", user.email, user.name);
	SessionManager.set(info);
	return this;
    }

    protected int getAgileMaxLimit()
    {
	return contactRestriction.getPendingCount();
    }

    protected int getFetchSize()
    {
	int pending = getAgileMaxLimit();
	if (pending > 400)
	    return 200;

	if (pending == 1)
	    return 0;

	return pending / 2;
    }

    /**
     * Checks if is limit exceeded as per user plan
     * 
     * @return true, if is limit exceeded
     */
    public boolean isLimitExceeded()
    {
	if (total_synced_contact >= MAX_SYNC_LIMIT)
	{
	    sendNotification(prefs.type.getNotificationEmailSubject());
	    return true;
	}

	return false;
    }

    // public List<Contact> retrieveContact();

    /**
     * building import status map will hold how many new Contact ,merge Contact
     * ,Conflict Contact found as sync status.
     */
    protected Map<ImportStatus, Integer> syncStatus;

    {
	syncStatus = new HashMap<ImportStatus, Integer>();
	for (ImportStatus status : ImportStatus.values())
	{
	    syncStatus.put(status, 0);
	}
    }

    /**
     * Wrap contact to agile schema and save.
     * 
     * @param object
     *            the object
     * @return the contact
     */
    public Contact wrapContactToAgileSchemaAndSave(Object object)
    {
	try
	{
	    Contact contact = wrapContactToAgileSchema(object);

	    if (contact == null)
		return contact;

	    ++total_synced_contact;

	    contact = saveContact(contact);

	    // Works as save callback to perform actions like creating
	    // notes/tasks
	    // and relating to newly created contact
	    contactWrapper.saveCallback();
	    return contact;

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Wrap contact to agile schema return Contact Object in agile schema
     * format.
     * 
     * @param object
     *            the object
     * @return the contact
     */
    protected Contact wrapContactToAgileSchema(Object object)
    {
	if (contactWrapper == null)
	    try
	    {
		contactWrapper = getWrapperService().newInstance().getWrapper(object, prefs);
	    }
	    catch (InstantiationException e)
	    {
		e.printStackTrace();
	    }
	    catch (IllegalAccessException e)
	    {
		e.printStackTrace();
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }

	return contactWrapper.getWrapper(object).buildContact();
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

	// Saves limits
	restriction.save();

	buildNotificationStatus();

	System.out.println("----Synced contacts------" + syncStatus.get(ImportStatus.TOTAL));

	if (syncStatus.get(ImportStatus.TOTAL) != null && syncStatus.get(ImportStatus.TOTAL).intValue() == 0)
	    return;

	if (user != null)
	{

	    int emailRequired = syncStatus.get(ImportStatus.EMAIL_REQUIRED);
	    if (emailRequired == 0)
		syncStatus.remove(ImportStatus.EMAIL_REQUIRED);

	    SendMail.sendMail(user.email, notificationSubject, NOTIFICATION_TEMPLATE, new Object[] { user, syncStatus });

	    SendMail.sendMail("yaswanth@agilecrm.com", notificationSubject + " - " + user.domain,
		    NOTIFICATION_TEMPLATE, new Object[] { user, syncStatus });
	}
    }

    /**
     * Builds the notification status creates Map of Total New Contact,Merge
     * Contact and Failed Contact save in Agile for Email Notification .
     * 
     * @return the map
     */
    private Map<ImportStatus, Integer> buildNotificationStatus()
    {
	Integer fail = syncStatus.get(ImportStatus.TOTAL_FAILED);
	Integer total = syncStatus.get(ImportStatus.TOTAL);
	Integer totalSaved = syncStatus.get(ImportStatus.SAVED_CONTACTS);
	for (Map.Entry<ImportStatus, Integer> entry : syncStatus.entrySet())
	{
	    if (entry.getKey() == ImportStatus.NEW_CONTACTS)
	    {
		total += entry.getValue();
		totalSaved += entry.getValue();
	    }
	    else if (entry.getKey() == ImportStatus.MERGED_CONTACTS)
	    {
		total += entry.getValue();
		totalSaved += entry.getValue();
	    }
	    else if (entry.getKey() == ImportStatus.LIMIT_REACHED)
	    {
		total += entry.getValue();
		fail += entry.getValue();
	    }

	}

	syncStatus.put(ImportStatus.TOTAL_FAILED, fail);
	syncStatus.put(ImportStatus.TOTAL, total);
	syncStatus.put(ImportStatus.SAVED_CONTACTS, totalSaved);

	return syncStatus;
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.agilecrm.contact.sync.service.SyncService#saveContact(java.util.List)
     */
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

    /**
     * Update last synced in prefs.
     */
    protected abstract void updateLastSyncedInPrefs();

    /**
     * Save contact.
     * 
     * @param contact
     *            the contact
     */
    
    private boolean findDuplicateAndMerge(Contact contact,Map<String, Object> queryMap)
    {
	boolean isDuplicate = false;
	if (prefs.type == Type.SHOPIFY)
	{
	    boolean isDuplicateById = false;

	    

	    int count = contact.dao.getCountByProperty(queryMap);
	    if (count > 0)
	    {
		isDuplicate = isDuplicateById = true;
	    }
	    else
	    {
		isDuplicate = ContactUtil.isDuplicateContact(contact);
	    }

	    if (isDuplicate && isDuplicateById)
	    {
		//mergeContacts(contact, queryMap);
		return true;
	    }
	}
	else
	{
	    isDuplicate = ContactUtil.isDuplicateContact(contact);
	}

	//if (isDuplicate)
	    //mergeContacts(contact, null);

	return isDuplicate;

    }

    private Contact mergeContacts(Contact contact, final Map<String, Object> queryMap)
    {
	Contact oldContact = null;
	if (queryMap != null)
	{
	    oldContact = Contact.dao.getByProperty(queryMap);
	    if (oldContact != null)
		contact = ContactUtil.mergeContactFeilds(contact, oldContact);
	    return contact;
	}

	return ContactUtil.mergeContactFields(contact);
    }
    
    private Contact saveContact(Contact contact)
    {
	addTagToContact(contact);
	Map<String, Object> queryMap = new HashMap<String , Object>();
	if (prefs.type == Type.SHOPIFY)
	{
    queryMap.put("properties.name", "shopifyId");
    queryMap.put("properties.value", contact.getContactFieldValue("shopifyId"));
	}
	boolean isUpdated= findDuplicateAndMerge(contact,queryMap);
	if (isUpdated)
	{
	    contact = mergeContacts(contact,queryMap);

	    accessControl.setObject(contact);
	    if (!accessControl.canDelete())
	    {
		syncStatus.put(ImportStatus.ACCESS_DENIED, syncStatus.get(ImportStatus.ACCESS_DENIED) + 1);
		return contact;
	    }
	    try
	    {

		contact.bulkActionTracker = bulk_action_tracker;
		contact.save();

		syncStatus.put(ImportStatus.MERGED_CONTACTS, syncStatus.get(ImportStatus.MERGED_CONTACTS) + 1);
	    }
	    catch (AccessDeniedException e)
	    {
		syncStatus.put(ImportStatus.ACCESS_DENIED, syncStatus.get(ImportStatus.ACCESS_DENIED) + 1);
	    }
	    catch (Exception e)
	    {
		System.out.println("exception raised : " + e.getMessage());
	    }
	}
	else if (contactRestriction.can_create())
	{
	    try
	    {
		contact.bulkActionTracker = bulk_action_tracker;
		contact.save();
	    }
	    catch (AccessDeniedException e)
	    {
		syncStatus.put(ImportStatus.ACCESS_DENIED, syncStatus.get(ImportStatus.ACCESS_DENIED) + 1);
		return contact;
	    }
	    restriction.contacts_count++;
	    syncStatus.put(ImportStatus.NEW_CONTACTS, syncStatus.get(ImportStatus.NEW_CONTACTS) + 1);
	}
	else
	{
	    syncStatus.put(ImportStatus.LIMIT_REACHED, syncStatus.get(ImportStatus.LIMIT_REACHED) + 1);
	}

	return contact;
    }

    /**
     * Adds the tag to contact.
     * 
     * @param contact
     *            the contact
     */
    private void addTagToContact(Contact contact)
    {
	String tag;
	if (prefs.type == Type.GOOGLE)
	    tag = "gmail contact".toLowerCase();
	else
	    tag = prefs.type.toString().toLowerCase() + " contact";

	contact.tags.add(StringUtils.capitalize(tag));
    }

    protected boolean canSync()
    {
	return contactRestriction.can_create();
    }
}
