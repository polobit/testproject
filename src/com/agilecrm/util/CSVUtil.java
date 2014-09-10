package com.agilecrm.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import org.apache.commons.io.IOUtils;
import org.apache.commons.io.LineIterator;
import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import au.com.bytecode.opencsv.CSVReader;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.contact.util.bulk.BulkActionNotifications.BulkAction;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction;
import com.agilecrm.subscription.restrictions.entity.impl.ContactBillingRestriction;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.email.SendMail;
import com.googlecode.objectify.Key;

/**
 * <code>CSVUtil</code> is a utility class, which converts the given data of a
 * csv file into an array of json objects (each row of the file as a json
 * object).
 * <p>
 * Corresponding headers are taken as keys for the values. Also validates the
 * duplicates in the given data.
 * </p>
 * 
 * @author
 * 
 */
public class CSVUtil
{
    BillingRestriction billingRestriction;
    private ContactBillingRestriction dBbillingRestriction;

    private CSVUtil()
    {

    }

    public CSVUtil(BillingRestriction billingRestriction)
    {
	this.billingRestriction = billingRestriction;
	dBbillingRestriction = (ContactBillingRestriction) DaoBillingRestriction.getInstace(
		Contact.class.getSimpleName(), this.billingRestriction);

    }

    public static enum ImportStatus
    {
	TOTAL, SAVED_CONTACTS, MERGED_CONTACTS, DUPLICATE_CONTACT, NAME_MANDATORY, EMAIL_REQUIRED, INVALID_EMAIL, TOTAL_FAILED, NEW_CONTACTS, LIMIT_REACHED,

	ACCESS_DENIED, TYPE;

    }

    /**
     * Returns CSV headings from stream object. Reads first line
     * 
     * @param stream
     * @return
     * @throws Exception
     */
    public static List<String> getCSVHeadings(InputStream stream) throws Exception
    {
	// Reads blob data line by line upto first 10 line of file
	LineIterator iterator = IOUtils.lineIterator(stream, "UTF-8");

	if (!iterator.hasNext())
	    throw new Exception("Invalid CSV file");

	// Reads the first line
	String csv = iterator.nextLine();

	System.out.println(csv);

	// Creates csv reader from headings
	CSVReader reader = new CSVReader(new StringReader(csv.trim()));

	// Get Header Liner
	String[] headers = reader.readNext();
	if (headers == null)
	{
	    System.out.println("Empty List");
	    throw new Exception("Empty CSV");
	}

	// Creates list of headings
	List<String> headersList = new ArrayList<String>(Arrays.asList(headers));

	return headersList;

    }

    /**
     * Creates contacts,companies from CSV string using a contact prototype
     * built from import page. It takes owner id to sent contact owner
     * explicitly instead of using session manager, as there is a chance of
     * getting null in backends.
     * 
     * Contact is saved only if there is email exists and it is a valid email
     * 
     * @param blobStream
     * @param contact
     * @param ownerId
     * @throws IOException
     */
    public void createContactsFromCSV(InputStream blobStream, Contact contact, String ownerId)
	    throws PlanRestrictedException, IOException
    {
	// Refreshes count of contacts
	billingRestriction.refreshContacts();

	int availableContacts = billingRestriction.contacts_count;
	int allowedContacts = billingRestriction.getCurrentLimits().getContactLimit();
	boolean limitCrossed = false;

	// Reads blob data line by line upto first 10 line of file
	Reader csvStream = new InputStreamReader(blobStream, "UTF-8");

	System.out.println(contact);
	CSVReader reader = new CSVReader(csvStream);

	List<String[]> contacts = reader.readAll();

	if (contacts.isEmpty())
	    return;

	String[] headings = contacts.remove(0);

	contact.type = Contact.Type.PERSON;

	LinkedHashSet<String> tags = new LinkedHashSet<String>();

	tags.addAll(contact.tags);

	List<ContactField> properties = contact.properties;

	// Creates domain user key, which is set as a contact owner
	Key<DomainUser> ownerKey = new Key<DomainUser>(DomainUser.class, Long.parseLong(ownerId));

	DomainUser domainUser = DomainUserUtil.getDomainUser(ownerKey.getId());

	BulkActionUtil.setSessionManager(domainUser);

	System.out.println(contacts.size());

	// Counters to count number of contacts saved contacts
	int savedContacts = 0;
	int mergedContacts = 0;
	int limitExceeded = 0;
	int accessDeniedToUpdate = 0;
	List<String> emails = new ArrayList<String>();
	Map<Object, Object> status = new HashMap<Object, Object>();
	status.put("type", "Contacts");

	for (String[] csvValues : contacts)
	{
	    Set<Integer> notes_positions = new TreeSet<Integer>();

	    Contact tempContact = new Contact();
	    tempContact.tags = (LinkedHashSet<String>) contact.tags.clone();
	    tempContact.properties = contact.properties;

	    // Sets owner of contact explicitly. If owner is not set,
	    // contact
	    // prepersist
	    // tries to read it from session, and session is not shared with
	    // backends
	    tempContact.setContactOwner(ownerKey);

	    tempContact.properties = new ArrayList<ContactField>();

	    for (int j = 0; j < csvValues.length; j++)
	    {

		if (StringUtils.isBlank(csvValues[j]))
		    continue;

		csvValues[j] = csvValues[j].trim();

		ContactField field = properties.get(j);

		// This is hardcoding but found no way to get
		// tags
		// from the CSV file
		if (field == null)
		{
		    continue;
		}

		if ("tags".equals(field.name))
		{
		    // Multiple tags are supported. Multiple tags are added
		    // split at , or ;
		    String[] tagsArray = csvValues[j].split("[,;]+");

		    for (String tag : tagsArray)
			tempContact.tags.add(tag);
		    continue;
		}
		if (Contact.ADDRESS.equals(field.name))
		{
		    ContactField addressField = tempContact.getContactField(contact.ADDRESS);

		    JSONObject addressJSON = new JSONObject();

		    try
		    {
			if (addressField != null && addressField.value != null)
			{
			    addressJSON = new JSONObject(addressField.value);
			    addressJSON.put(field.value, csvValues[j]);
			    addressField.value = addressJSON.toString();
			}
			else
			{
			    addressJSON.put(field.value, csvValues[j]);
			    tempContact.properties.add(new ContactField(Contact.ADDRESS, addressJSON.toString(),
				    field.type.toString()));
			}

		    }
		    catch (JSONException e)
		    {
			// TODO Auto-generated catch block
			e.printStackTrace();
		    }
		    continue;
		}
		if ("note".equals(field.name))
		{
		    notes_positions.add(j);
		    continue;
		}

		// To avoid saving ignore field value/ and avoid fields with
		// empty values
		if (field.name == null || StringUtils.isEmpty(field.value))
		    continue;

		field.value = csvValues[j];

		tempContact.properties.add(field);

	    }

	    if (!isValidFields(tempContact, status))
		continue;

	    boolean isMerged = false;

	    // If contact is duplicate, it fetches old contact and updates data.
	    if (ContactUtil.isDuplicateContact(tempContact))
	    {
		// Checks if user can update the contact

		// Sets current object to check scope

		tempContact = ContactUtil.mergeContactFields(tempContact);
		isMerged = true;
	    }
	    else
	    {

		// If it is new contacts billingRestriction count is increased
		// and checked with plan limits

		++billingRestriction.contacts_count;
		try
		{
		    if (limitCrossed)
			continue;

		    if (billingRestriction.contacts_count >= allowedContacts)
		    {
			limitCrossed = true;
		    }

		}
		catch (PlanRestrictedException e)
		{
		    ++limitExceeded;
		    continue;
		}
	    }

	    try
	    {
		tempContact.save();
	    }
	    catch (Exception e)
	    {
		System.out.println("exception raised while saving contact "
			+ tempContact.getContactFieldValue(Contact.EMAIL));
		e.printStackTrace();

	    }
	    if (isMerged)
	    {
		mergedContacts++;
	    }
	    else
	    {
		// Increase counter on each contact save
		savedContacts++;
	    }

	    try
	    {

		// Creates notes, set CSV heading as subject and value as
		// description.
		for (Integer i : notes_positions)
		{
		    Note note = new Note();
		    note.subject = headings[i];
		    note.description = csvValues[i];
		    note.addRelatedContacts(String.valueOf(tempContact.id));

		    note.setOwner(new Key<AgileUser>(AgileUser.class, tempContact.id));
		    note.save();
		}
	    }
	    catch (Exception e)
	    {
		System.out.println("exception while saving contacts");
		e.printStackTrace();
	    }

	}

	calculateTotalFailedContacts(status);

	buildCSVImportStatus(status, ImportStatus.TOTAL, contacts.size());

	if (mergedContacts > 0)
	{
	    buildCSVImportStatus(status, ImportStatus.SAVED_CONTACTS, savedContacts + mergedContacts);
	    buildCSVImportStatus(status, ImportStatus.NEW_CONTACTS, savedContacts);
	    buildCSVImportStatus(status, ImportStatus.MERGED_CONTACTS, mergedContacts);
	    buildCSVImportStatus(status, ImportStatus.LIMIT_REACHED, limitExceeded);
	    buildCSVImportStatus(status, ImportStatus.ACCESS_DENIED, accessDeniedToUpdate);

	}
	else
	{
	    buildCSVImportStatus(status, ImportStatus.SAVED_CONTACTS, savedContacts);
	}

	// Sends notification on CSV import completion
	dBbillingRestriction.send_warning_message();

	SendMail.sendMail(domainUser.email, SendMail.CSV_IMPORT_NOTIFICATION_SUBJECT, SendMail.CSV_IMPORT_NOTIFICATION,
		new Object[] { domainUser, status });

	// Send notification after contacts save complete
	BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_CSV_IMPORT, String.valueOf(savedContacts));

    }

    /**
     * create Companies from csv file
     * 
     * @param statusMap
     * @param status
     * @param count
     */

    public void createCompaniesFromCSV(InputStream blobStream, Contact contact, String ownerId, String type)
	    throws PlanRestrictedException, IOException
    {
	// Refreshes count of contacts
	billingRestriction.refreshContacts();

	int availableContacts = billingRestriction.contacts_count;
	int allowedContacts = billingRestriction.getCurrentLimits().getContactLimit();
	boolean limitCrossed = false;

	// Reads blob data line by line upto first 10 line of file
	Reader csvStream = new InputStreamReader(blobStream, "UTF-8");

	System.out.println(contact);
	CSVReader reader = new CSVReader(csvStream);

	List<String[]> companies = reader.readAll();

	if (companies.isEmpty())
	    return;

	// remove header information form csv
	String[] headings = companies.remove(0);

	LinkedHashSet<String> tags = new LinkedHashSet<String>();

	tags.addAll(contact.tags);

	// copy contact schema or property
	List<ContactField> properties = contact.properties;

	// Creates domain user key, which is set as a contact owner
	Key<DomainUser> ownerKey = new Key<DomainUser>(DomainUser.class, Long.parseLong(ownerId));

	DomainUser domainUser = DomainUserUtil.getDomainUser(ownerKey.getId());

	BulkActionUtil.setSessionManager(domainUser);

	System.out.println(companies.size());

	// Counters to count number of contacts saved contacts
	int savedCompany = 0;
	int mergedCompany = 0;
	int limitExceeded = 0;
	int accessDeniedToUpdate = 0;
	int failedCompany = 0;
	Map<Object, Object> status = new HashMap<Object, Object>();
	status.put("type", type);

	// creates contacts by iterating contact properties

	for (String[] csvValues : companies)
	{

	    Contact tempContact = new Contact();
	    tempContact.tags = (LinkedHashSet<String>) contact.tags.clone();
	    tempContact.properties = contact.properties;

	    tempContact.type = Type.COMPANY;
	    tempContact.setContactOwner(ownerKey);

	    tempContact.properties = new ArrayList<ContactField>();
	    String companyName = null;

	    for (int j = 0; j < csvValues.length; j++)
	    {

		if (StringUtils.isBlank(csvValues[j]))
		    continue;

		csvValues[j] = csvValues[j].trim();

		ContactField field = properties.get(j);

		// This is hardcoding but found no way to get
		// tags
		// from the CSV file
		if (field == null)
		{
		    continue;
		}

		if (Contact.ADDRESS.equals(field.name))
		{
		    ContactField addressField = tempContact.getContactField(contact.ADDRESS);

		    JSONObject addressJSON = new JSONObject();

		    try
		    {
			if (addressField != null && addressField.value != null)
			{
			    addressJSON = new JSONObject(addressField.value);
			    addressJSON.put(field.value, csvValues[j]);
			    addressField.value = addressJSON.toString();
			}
			else
			{
			    addressJSON.put(field.value, csvValues[j]);
			    tempContact.properties.add(new ContactField(Contact.ADDRESS, addressJSON.toString(),
				    field.subtype.toString()));
			}

		    }
		    catch (JSONException e)
		    {
			// TODO Auto-generated catch block
			e.printStackTrace();
		    }
		    continue;
		}

		// To avoid saving ignore field value/ and avoid fields with
		// empty values
		if (field.name == null || StringUtils.isEmpty(field.value))
		    continue;

		if (field.name.equalsIgnoreCase(Contact.NAME))
		{
		    field.value = StringUtils.capitalise(csvValues[j].toLowerCase());
		    companyName = field.value;
		}
		else
		{
		    field.value = csvValues[j];
		}

		tempContact.properties.add(field);

	    }

	    boolean isMerged = false;

	    // save contact as company
	    if (companyName != null && !companyName.isEmpty())
	    {

		if (ContactUtil.companyExists(StringUtils.capitalise(companyName.toLowerCase())))
		{
		    tempContact = ContactUtil.mergeCompanyFields(tempContact);
		    isMerged = true;
		}
	    }
	    else
	    {
		continue;
	    }

	    /**
	     * If it is new contacts billingRestriction count is increased and
	     * checked with plan limits
	     */

	    ++billingRestriction.contacts_count;
	    try
	    {
		if (limitCrossed)
		    continue;

		if (billingRestriction.contacts_count >= allowedContacts)
		{
		    limitCrossed = true;
		}

	    }
	    catch (PlanRestrictedException e)
	    {
		++limitExceeded;
		continue;
	    }

	    try
	    {

		tempContact.save();

	    }
	    catch (Exception e)
	    {
		System.out.println("exception raised while saving contact "
			+ tempContact.getContactFieldValue(Contact.NAME));
		e.printStackTrace();
		failedCompany++;

	    }

	    if (isMerged)
	    {
		mergedCompany++;
	    }
	    else
	    {
		savedCompany++;
	    }

	}

	calculateTotalFailedContacts(status);

	buildCSVImportStatus(status, ImportStatus.TOTAL, companies.size());

	if (mergedCompany > 0)
	{
	    buildCSVImportStatus(status, ImportStatus.SAVED_CONTACTS, savedCompany + mergedCompany);
	    buildCSVImportStatus(status, ImportStatus.NEW_CONTACTS, savedCompany);
	    buildCSVImportStatus(status, ImportStatus.MERGED_CONTACTS, mergedCompany);
	    buildCSVImportStatus(status, ImportStatus.LIMIT_REACHED, limitExceeded);
	    buildCSVImportStatus(status, ImportStatus.ACCESS_DENIED, accessDeniedToUpdate);
	    buildCSVImportStatus(status, ImportStatus.TOTAL_FAILED, failedCompany);

	}
	else
	{
	    buildCSVImportStatus(status, ImportStatus.SAVED_CONTACTS, savedCompany);
	}

	// Sends notification on CSV import completion
	dBbillingRestriction.send_warning_message();

	SendMail.sendMail(domainUser.email, SendMail.CSV_IMPORT_NOTIFICATION_SUBJECT, SendMail.CSV_IMPORT_NOTIFICATION,
		new Object[] { domainUser, status });

	// Send notification after contacts save complete
	if (type.equalsIgnoreCase("Contacts"))
	{
	    BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_CSV_IMPORT, String.valueOf(savedCompany));
	}
	else
	{
	    BulkActionNotifications.publishconfirmation(BulkAction.COMPANIES_CSV_IMPORT, String.valueOf(savedCompany));
	}

    }

    public void buildCSVImportStatus(Map<Object, Object> statusMap, ImportStatus status, Integer count)
    {
	if (statusMap.containsKey(status))
	{
	    Integer value = (Integer) statusMap.get(status);
	    statusMap.put(status, value + count);
	    statusMap.get(status);
	    return;
	}

	statusMap.put(status, count);
	billingRestriction.refreshContacts();
    }

    public static void calculateTotalFailedContacts(Map<Object, Object> status)
    {
	int total = 0;

	for (Object o : status.values())
	{
	    System.out.println(o);
	    if (o.equals("Companies") || o.equals("Contacts"))
	    {
		continue;
	    }
	    else
	    {
		total += (int) o;
	    }
	}
	System.out.println(total);
	status.put(ImportStatus.TOTAL_FAILED, total);
    }

    public boolean isValidFields(Contact contact, Map<Object, Object> statusMap)
    {
	if (StringUtils.isBlank(contact.getContactFieldValue(Contact.FIRST_NAME))
		&& StringUtils.isBlank(contact.getContactFieldValue(Contact.LAST_NAME)))
	{
	    buildCSVImportStatus(statusMap, ImportStatus.NAME_MANDATORY, 1);
	    return false;
	}

	if (StringUtils.isBlank(contact.getContactFieldValue(Contact.EMAIL)))
	{
	    buildCSVImportStatus(statusMap, ImportStatus.EMAIL_REQUIRED, 1);
	    return false;
	}

	/*
	 * Iterator<ContactField> iterator = contact.properties.iterator();
	 * while (iterator.hasNext()) { ContactField field = iterator.next(); if
	 * (Contact.WEBSITE.equals(field.name) && !isValidURL(field.value))
	 * iterator.remove(); }
	 */
	return true;
    }

    /**
     * Create Deals from CSV file
     * 
     * @param blobStream
     * @param ownerId
     * @param type
     * @throws PlanRestrictedException
     * @throws IOException
     */

    public void createDealsFromCSV(InputStream blobStream, String ownerId, String type) throws PlanRestrictedException,
	    IOException
    {
	Integer totalDeals = 0;
	Integer savedDeals = 0;
	Integer failedDeals = 0;
	/**
	 * Reading CSV file from input stream
	 */
	CSVReader reader = new CSVReader(new InputStreamReader(blobStream, "UTF-8"));
	Map<String, Object> status = new HashMap<String, Object>();
	status.put("type", "Deals");
	List<String[]> deals = reader.readAll();
	// remove headings
	if (deals.isEmpty())
	{
	    return;
	}
	// remove header information form csv
	String[] headings = deals.remove(0);

	// Creates domain user key, which is set as a contact owner
	Key<DomainUser> ownerKey = new Key<DomainUser>(DomainUser.class, Long.parseLong(ownerId));

	DomainUser domainUser = DomainUserUtil.getDomainUser(ownerKey.getId());

	BulkActionUtil.setSessionManager(domainUser);
	totalDeals = deals.size();
	// create Deals by iterating deals properties
	Iterator<String[]> it = deals.iterator();
	while (it.hasNext())
	{
	    Opportunity opportunity = new Opportunity();
	    String[] dealPropValues = it.next();
	    for (int i = 0; i < dealPropValues.length; i++)
	    {
		String prop = headings[i];
		if (prop.equalsIgnoreCase("Deal Name") || prop.equalsIgnoreCase("Name"))
		{
		    opportunity.name = dealPropValues[i];
		}

		if (prop.equalsIgnoreCase("Value"))
		{
		    opportunity.expected_value = Double.parseDouble(dealPropValues[i]);
		}

		if (prop.equalsIgnoreCase("Probability"))
		{
		    opportunity.probability = Integer.parseInt(dealPropValues[i]);
		}
		if (prop.equalsIgnoreCase("Milestone"))
		{
		    opportunity.milestone = StringUtils.capitalise(dealPropValues[i].toLowerCase());
		}

		if (prop.equalsIgnoreCase("Close Date") || prop.equalsIgnoreCase("close"))
		{
		    // set close date
		    Calendar c = Calendar.getInstance();
		    try
		    {
			String dateValue = dealPropValues[i];
			String[] data = dateValue.split("/");
			c = Calendar.getInstance();
			if (data.length == 3)
			{
			    c.set(Integer.parseInt(data[2]), Integer.parseInt(data[1]), Integer.parseInt(data[0]));
			}
		    }

		    catch (Exception e)
		    {
			e.printStackTrace();

		    }
		    // System.out.println(c.g);

		    opportunity.close_date = Long.valueOf(c.getTimeInMillis() / 1000);
		}
		if (prop.equalsIgnoreCase("Description") || prop.equalsIgnoreCase("Descriptions"))
		{
		    opportunity.description = dealPropValues[i];
		}
		if (prop.equalsIgnoreCase("Note"))
		{
		    Note note = new Note();
		    note.description = dealPropValues[i];
		    note.save();
		}
	    }
	    opportunity.setOpportunityOwner(ownerKey);
	    try
	    {
		opportunity.save();
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
		failedDeals++;
	    }
	    savedDeals++;
	}

	buildDealsImportStatus(status, "SAVED", savedDeals);
	buildDealsImportStatus(status, "FAILD", failedDeals);
	buildDealsImportStatus(status, "TOTAL", totalDeals);

	SendMail.sendMail(domainUser.email, SendMail.CSV_IMPORT_NOTIFICATION_SUBJECT, "csv_deal_import", new Object[] {
		domainUser, status });
	BulkActionNotifications.publishconfirmation(BulkAction.DEALS_CSV_IMPORT, String.valueOf(savedDeals));

    }

    private void buildDealsImportStatus(Map<String, Object> statusMap, String status, Integer count)
    {

	statusMap.put(status, count);
    }
}
