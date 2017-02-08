/**
 * @auther jitendra
 * @since 2014
 */
package com.agilecrm.contact.sync.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.scribe.utils.Preconditions;

import au.com.bytecode.opencsv.CSVWriter;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.sync.ImportStatus;
import com.agilecrm.contact.sync.Type;
import com.agilecrm.contact.sync.wrapper.ContactWrapper;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.db.GoogleSQL;
import com.agilecrm.export.gcs.GCSServiceAgile;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.access.UserAccessControl;
import com.agilecrm.user.access.UserAccessControl.AccessControlClasses;
import com.agilecrm.user.access.exception.AccessDeniedException;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.CSVUtil;
import com.agilecrm.util.FailedContactBean;
import com.agilecrm.util.email.SendMail;
import com.agilecrm.util.language.LanguageUtil;
import com.google.agile.repackaged.appengine.tools.cloudstorage.GcsFileOptions;
import com.google.appengine.api.NamespaceManager;
import com.google.gdata.data.contacts.ContactEntry;
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
	    //sendNotification(prefs.type.getNotificationEmailSubject(),null);
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
    public Contact wrapContactToAgileSchemaAndSave(Object object,List<FailedContactBean> mergedContacts)
    {
	try
	{
	    Contact contact = wrapContactToAgileSchema(object);
	    System.out.println("Contact while saving"+contact);
	    if (contact == null)
		return contact;

	    ++total_synced_contact;

	    contact = saveContact(contact,mergedContacts,object);
	    System.out.println("Contact After saving"+contact);
	    contactWrapper.updateContact(contact);
	    // Works as save callback to perform actions like creating
	    // notes/tasks
	    // and relating to newly created contact
	    contactWrapper.saveCallback();
	    System.out.println("Contact-------" + contact);
	    
	    if(contact.contact_company_id!=null){
	    	
	    Contact related_company=ContactUtil.getContact(Long.parseLong(contact.contact_company_id));

	    addTagToCompany(related_company);
	    if (prefs.type == Type.GOOGLE){
		    ContactField googleContactfield = contact.getContactFieldByName("Google_Sync_Type");

			// Does not create contact if it is already imported form google
			if (googleContactfield != null && "Agile_Google".equals(googleContactfield.value)){
				String tag = "gmail company".toLowerCase();

				contact.tags.remove(StringUtils.capitalize(tag));
			}
				
	    }
	    related_company.save();
	    }
	    return contact;

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("ContactSyncService wrapContactToAgileSchemaAndSave :"+e.getMessage());
	    System.out.println("ContactSyncService wrapContactToAgileSchemaAndSave :"+e);
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
	System.out.println("contact wrapper is " + contactWrapper);
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

    public void sendNotification(String notificationSubject,List<FailedContactBean> mergedContacts)
    {
	DomainUser user = DomainUserUtil.getCurrentDomainUser();
	
	// Get user prefs language
    String language = LanguageUtil.getUserLanguageFromDomainUser(user);
    
	// Saves limits
	restriction.save();

	buildNotificationStatus();
	
	System.out.println("----Synced contacts------" + syncStatus.get(ImportStatus.TOTAL));

	if (syncStatus.get(ImportStatus.TOTAL) != null && syncStatus.get(ImportStatus.TOTAL).intValue() == 0)
	    return;
	
	if(mergedContacts!=null && mergedContacts.size()>0){
	  GCSServiceAgile service;
	  CSVWriter failedContactsWriter = null;
	  String[] headings={"First name","Last name","Email"};
		GcsFileOptions options = new GcsFileOptions.Builder().mimeType("text/csv").contentEncoding("UTF-8")
			    .acl("public-read").addUserMetadata("domain", NamespaceManager.get()).build();

		    service = new GCSServiceAgile(NamespaceManager.get() + "_merged_contacts_" + GoogleSQL.getFutureDate()
			    + ".csv", "agile-export", options);
	  try
	{
		failedContactsWriter = new CSVWriter(service.getOutputWriter());
	}
	catch (IOException e)
	{
		// TODO Auto-generated catch block
		e.printStackTrace();
	};
	
	writeFailedContactsInCSV(failedContactsWriter, mergedContacts, headings);
	 byte[] data=null;
	 String[] strArr = new String[3];
	 try{

		    service.getOutputchannel().close();

		    System.out.println("closing stream");

		    
		   data = service.getDataFromFile();

		    System.out.println("byte data");

		    System.out.println(data.length);
		    
		    
	 //sendFailedContactImportFile(domainUser, new String(data, "UTF-8"), failedContacts.size(), status);
	 strArr[0] = "text/csv";
	 strArr[1]="MergedContacts.csv";
	 strArr[2]=new String(data, "UTF-8");
	 if (user != null)
		{

		    int emailRequired = syncStatus.get(ImportStatus.EMAIL_REQUIRED);
		    if (emailRequired == 0)
			syncStatus.remove(ImportStatus.EMAIL_REQUIRED);
	    	SendMail.sendMail(user.email, notificationSubject, NOTIFICATION_TEMPLATE, 
		    		new Object[] { user, syncStatus },SendMail.AGILE_FROM_EMAIL, SendMail.AGILE_FROM_NAME, language, strArr);
	    	
	    	SendMail.sendMail("yaswanth@agilecrm.com", notificationSubject + " - " + user.domain,
	    		    NOTIFICATION_TEMPLATE, new Object[] { user, syncStatus }, language);
		}
	    service.deleteFile();
	 }
	    catch(Exception e)
	    {
	    	e.printStackTrace();
	    }
	}
	
	else{
	if (user != null)
	{

	    int emailRequired = syncStatus.get(ImportStatus.EMAIL_REQUIRED);
	    if (emailRequired == 0)
		syncStatus.remove(ImportStatus.EMAIL_REQUIRED);
	   
	    SendMail.sendMail(user.email, notificationSubject, NOTIFICATION_TEMPLATE, new Object[] { user, syncStatus }, language);
    	

	    SendMail.sendMail("yaswanth@agilecrm.com", notificationSubject + " - " + user.domain,
		    NOTIFICATION_TEMPLATE, new Object[] { user, syncStatus }, language);
	}
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
    public void saveContact(List<Contact> contacts,List<FailedContactBean> mergedContacts)
    {
	for (Contact contact : contacts)
	{
	    saveContact(contact,mergedContacts,null);
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
	if (prefs.type == Type.SHOPIFY || prefs.type == Type.QUICKBOOK)
	{
	    boolean isDuplicateById = false;

	    

	    int count = contact.dao.getCountByProperty(queryMap);
	    System.out.println("Number of count of contact found for given querymap is " + count);
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
		{
	    	contact = ContactUtil.mergeContactFeilds(contact, oldContact);
	    	 return contact;
		}
	}

	return ContactUtil.mergeContactFields(contact);
    }
    
    private Contact saveContact(Contact contact,List<FailedContactBean> mergedContacts,Object object)
    {
	addTagToContact(contact);
	Map<String, Object> queryMap = null;
	if (prefs.type == Type.SHOPIFY)
	{
		queryMap = new HashMap<String , Object>();
    queryMap.put("properties.name", Contact.SHOPIFY_SYNC);
    queryMap.put("properties.value", contact.getContactFieldValue(Contact.SHOPIFY_SYNC));
	}
	if (prefs.type == Type.QUICKBOOK)
	{
		queryMap = new HashMap<String , Object>();
    queryMap.put("properties.name", Contact.QUICKBOOK_SYNC);
    queryMap.put("properties.value", contact.getContactFieldValue(Contact.QUICKBOOK_SYNC));
    
    System.out.println("Quickbook id for the ongoing contact is "+ contact.getContactFieldValue(Contact.QUICKBOOK_SYNC) );
	}
	
	
	boolean isUpdated= findDuplicateAndMerge(contact,queryMap);
	System.out.println("Is Contact duplicate  in contactsyncimpl is" + isUpdated);
	if (isUpdated)
	{
		
	    if (prefs.type == Type.GOOGLE){
	    	 contact = mergeContacts(contact,object);
	    ContactField googleContactfield = contact.getContactFieldByName("Google_Sync_Type");

		// Does not create contact if it is already imported form google
		if (googleContactfield != null && "Agile_Google".equals(googleContactfield.value))
		{
			String tag = "gmail contact".toLowerCase();

				contact.tags.remove(StringUtils.capitalize(tag));
		}
		}
	    else
	    	contact = mergeContacts(contact,queryMap);
	    accessControl.setObject(contact);
	    if (!accessControl.canCreate())
	    {
		syncStatus.put(ImportStatus.ACCESS_DENIED, syncStatus.get(ImportStatus.ACCESS_DENIED) + 1);
		return contact;
	    }
	    try
	    {

		contact.bulkActionTracker = bulk_action_tracker;
		contact.save();
		mergedContacts.add(new FailedContactBean(contact , "Contact is merged"));
		syncStatus.put(ImportStatus.MERGED_CONTACTS, syncStatus.get(ImportStatus.MERGED_CONTACTS) + 1);
		System.out.println("Total merged contact " + syncStatus.get(ImportStatus.MERGED_CONTACTS));
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
	    System.out.println("Total created contact " + syncStatus.get(ImportStatus.MERGED_CONTACTS));
	}
	else
	{
	    syncStatus.put(ImportStatus.LIMIT_REACHED, syncStatus.get(ImportStatus.LIMIT_REACHED) + 1);
	}

	return contact;
    }

    private Contact mergeContacts(Contact contact,Object object)
	{
		// TODO Auto-generated method stub
    	List<ContactField> emails = contact.getContactPropertiesList(Contact.EMAIL);

    	if (emails.size() == 0)
    	    return contact;

    	Contact oldContact = ContactUtil.getDuplicateContact(contact);

    	if (oldContact != null && oldContact.updated_time>=((ContactEntry)object).getUpdated().getValue())
    	{
    		List<ContactField> field = contact.getContactPropertiesList(Contact.COMPANY);
    		contact.properties.remove(field.get(0));
    		field = contact.getContactPropertiesList(Contact.TITLE);
    		contact.properties.remove(field.get(0));
    	}
    	if (oldContact != null)
    	    return ContactUtil.mergeContactFeilds(contact, oldContact);

    	return oldContact;
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
	if (prefs.type == Type.GOOGLE){
	    tag = "gmail contact".toLowerCase();
	     //adding source of the contact for reference
	    contact.source = "google sync";
	}
	else{
	    tag = prefs.type.toString().toLowerCase() + " contact";
	    //adding source of the contact for reference
	    contact.source = prefs.type.toString().toLowerCase() + " sync";
	}

	contact.tags.add(StringUtils.capitalize(tag));
    }

    protected boolean canSync()
    {
	return contactRestriction.can_create();
    }
    
    /**
     * Adds the tag to contact.
     * 
     * @param contact
     *            the contact
     */
    private void addTagToCompany(Contact contact)
    {
	String tag;
	if (prefs.type == Type.GOOGLE)
	    tag = "gmail company".toLowerCase();
	else
	    tag = prefs.type.toString().toLowerCase() + " company";

	contact.tags.add(StringUtils.capitalize(tag));
    }
    
    
    /**
     * write contacts in csv file
     * 
     * @param contact
     * @return
     */

    public void writeFailedContactsInCSV(CSVWriter writer, List<FailedContactBean> failedContacts, String[] headings)
    {
	try
	{
	    String[] heads = getHeading(headings);
	    writer.writeNext(heads);
	    for (FailedContactBean bean : failedContacts)
	    {
		writer.writeNext(toArray(toList(bean.getContact()), bean.getCauses(), heads.length));
	    }

	    writer.close();

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured in writeContactCSV " + e.getMessage());
	}
    }
    
    /**
     * helper function which convert contact property into Array of string for
     * write data in file
     * 
     * @param contact
     * @return
     */
    private String[] getHeading(String[] csvHeading)
    {
	String[] headings = new String[csvHeading.length + 1];
	int i = 0;
	for (String s : csvHeading)
	{
	    headings[i++] = s;
	}
	headings[i] = "Remarks";
	return headings;

    }

    private String[] toArray(List<String> properties, String errorMsg, int index)
    {
	try
	{
		for(int i=properties.size();i<index-1;i++){
			properties.add("");
		}
	    properties.add(errorMsg);
	}
	catch (ArrayIndexOutOfBoundsException e)
	{
	    e.printStackTrace();
	}
	String[] values = new String[properties.size()];

	int i = 0;
	for (String s : properties)
	{
	    values[i++] = s;
	}

	return values;

    }

    /**
     * helper function which convert contact property into Array of string for
     * write data in file
     * 
     * @param contact
     * @return
     */
    private List<String> toList(Contact contact)
    {
	List<String> list = new ArrayList<String>();
	ContactField first_name=contact.getContactField(Contact.FIRST_NAME);
	list.add(first_name!=null ? first_name.value : " ");
	ContactField last_name=contact.getContactField(Contact.LAST_NAME);
	list.add(last_name!=null ? last_name.value : " ");
	ContactField email=contact.getContactField(Contact.EMAIL);
	list.add(email!=null ? email.value : " ");
	
	System.out.println("List of csv data"+list);
	return list;
    }

}
