package com.agilecrm.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringReader;
import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TimeZone;
import java.util.TreeSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.io.IOUtils;
import org.apache.commons.io.LineIterator;
import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
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
import com.agilecrm.deals.CustomFieldData;
import com.agilecrm.deals.Milestone;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.MilestoneUtil;
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

	ACCESS_DENIED, TYPE, PROBABILITY;

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
     * Reads CSV data from blob input stream and returns list of string arrays
     * 
     * @param blobStream
     * @param encoding_type
     * @return
     */
    private List<String[]> getCSVDataFromStream(InputStream blobStream, String encoding_type)
    {
	List<String[]> data = new ArrayList<String[]>();

	// Reads blob data line by line upto first 10 line of file
	Reader csvStream = null;
	try
	{
	    if (StringUtils.isEmpty(encoding_type))
		csvStream = new InputStreamReader(blobStream, "UTF-8");
	    else
		csvStream = new InputStreamReader(blobStream, encoding_type);

	}
	catch (UnsupportedEncodingException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	if (csvStream == null)
	    return data;

	CSVReader reader = new CSVReader(csvStream);

	try
	{
	    data = reader.readAll();

	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	finally
	{
	    // Closes reader after reading data
	    try
	    {
		reader.close();
	    }
	    catch (IOException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	}

	return data;

    }

    /**
     * Creates contacts,companies from CSV string using a contact prototype
     * built from import page. It takes owner id to sent contact owner
     * explicitly instead of using session manager, as there is a chance of
     * getting null in backends.
     * 
     * Contact is saved only if there is email exists and it is a valid email.
     * 
     * Down the line Encoding type should read from request based on user
     * preference and encode the input stream and read data
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

	int allowedContacts = billingRestriction.getCurrentLimits().getContactLimit();
	boolean limitCrossed = false;

	List<String[]> contacts = getCSVDataFromStream(blobStream, "UTF-8");

	if (contacts.isEmpty())
	    return;

	String[] headings = contacts.remove(0);

	contact.type = Contact.Type.PERSON;

	LinkedHashSet<String> tags = new LinkedHashSet<String>();

	// Adds new tags to temporary list to save them in all contacts
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
	Map<Object, Object> status = new HashMap<Object, Object>();
	status.put("type", "Contacts");

	/**
	 * Iterates through all the records from blob
	 */
	for (String[] csvValues : contacts)
	{
	    // Set to hold the notes column positions so they can be created
	    // after a contact is created.
	    Set<Integer> notes_positions = new TreeSet<Integer>();

	    Contact tempContact = new Contact();

	    // Cloning so that wrong tags don't get to some contact if previous
	    // contact is merged with exiting contact
	    tempContact.tags = (LinkedHashSet<String>) contact.tags.clone();
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
		if (field.name.equalsIgnoreCase(Contact.NAME))
		{
		    field.value = StringUtils.capitalise(csvValues[j].toLowerCase());
		}

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
		if (limitCrossed)
		{
		    ++limitExceeded;
		    continue;
		}

		if (billingRestriction.contacts_count >= allowedContacts)
		{
		    limitCrossed = true;

		    continue;
		}
	    }

	    try
	    {
		tempContact.save();
	    }
	    catch (Exception e)
	    {
		System.out.println("exception raised while saving contact ");
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

	SendMail.sendMail(domainUser.email, "CSV Contacts Import Status", SendMail.CSV_IMPORT_NOTIFICATION,
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

	int allowedContacts = billingRestriction.getCurrentLimits().getContactLimit();
	boolean limitCrossed = false;

	List<String[]> companies = getCSVDataFromStream(blobStream, "UTF-8");

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
	int nameMissing = 0;
	Map<Object, Object> status = new HashMap<Object, Object>();
	status.put("type", type);

	// creates contacts by iterating contact properties

	for (String[] csvValues : companies)
	{

	    Contact tempContact = new Contact();
	    tempContact.tags = (LinkedHashSet<String>) contact.tags.clone();

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

		if (ContactUtil.companyExists(companyName))
		{
		    tempContact = ContactUtil.mergeCompanyFields(tempContact);
		    isMerged = true;
		}
	    }
	    else
	    {
		++nameMissing;
		continue;
	    }

	    /**
	     * If it is new contacts billingRestriction count is increased and
	     * checked with plan limits
	     */

	    ++billingRestriction.contacts_count;

	    if (limitCrossed)
	    {
		++limitExceeded;
		continue;
	    }

	    if (billingRestriction.contacts_count >= allowedContacts)
	    {
		limitCrossed = true;
	    }

	    try
	    {
		tempContact.save();
	    }
	    catch (Exception e)
	    {
		System.out.println("exception raised while saving company");
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
	    buildCSVImportStatus(status, ImportStatus.NAME_MANDATORY, nameMissing);

	}
	else
	{
	    buildCSVImportStatus(status, ImportStatus.SAVED_CONTACTS, savedCompany);
	}

	// Sends notification on CSV import completion
	dBbillingRestriction.send_warning_message();

	SendMail.sendMail(domainUser.email, "CSV Companies Import Status", SendMail.CSV_IMPORT_NOTIFICATION,
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

    public void createDealsFromCSV(InputStream blobStream, ArrayList<LinkedHashMap<String, String>> schema,
	    String ownerId) throws PlanRestrictedException, IOException
    {
	Integer totalDeals = 0;
	Integer savedDeals = 0;
	Integer failedDeals = 0;
	Integer probabilityError = 0;
	/**
	 * Reading CSV file from input stream
	 */
	Map<String, Object> status = new HashMap<String, Object>();
	status.put("type", "Deals");
	List<String[]> deals = getCSVDataFromStream(blobStream, "UTF-8");
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
	    String mileStoneValue = null;

	    // retriveing track information
	    ArrayList<CustomFieldData> customFields = new ArrayList<CustomFieldData>();
	    List<Milestone> list = null;
	    for (int i = 0; i < dealPropValues.length; i++)
	    {

		LinkedHashMap<String, String> prop = (LinkedHashMap<String, String>) schema.get(i);

		if (prop.size() > 0)
		{

		    String type = (String) prop.get("type");
		    String value = prop.get("value");
		    if (type.equalsIgnoreCase("SYSTEM"))
		    {
			if (value.equalsIgnoreCase("name"))
			{
			    opportunity.name = dealPropValues[i];
			}
			else if (value.equalsIgnoreCase("track"))
			{
			    String trackName = dealPropValues[i];
			    list = MilestoneUtil.getMilestonesList(trackName);
			    if (list != null && list.size() > 0)
			    {
				opportunity.track = trackName;
			    }

			}

			else if (value.equalsIgnoreCase("description"))
			{
			    opportunity.description = dealPropValues[i];
			}
			else if (value.equalsIgnoreCase("milestone"))
			{
			    mileStoneValue = dealPropValues[i];
			    if (!mileStoneValue.isEmpty())
			    {
				if (list != null)
				{
				    for (Milestone milestone : list)
				    {
					String[] milestonesName = milestone.milestones.split(",");
					for (String s : milestonesName)
					{
					    if (s.equalsIgnoreCase(mileStoneValue))
					    {
						opportunity.milestone = mileStoneValue;
						opportunity.pipeline_id = milestone.id;
						break;
					    }
					}
				    }
				}

			    }

			}
			else if (value.equals("probability"))
			{
			    Double probability = Double.parseDouble(parse(dealPropValues[i]));
			    if (probability > 100)
			    {
				opportunity.probability = 100;
			    }
			    else
			    {
				try
				{
				    opportunity.probability = (int) Math.round(probability);
				}
				catch (NumberFormatException | ClassCastException e)
				{
				    e.printStackTrace();
				}
			    }
			}
			else if (value.equalsIgnoreCase("value"))
			{
			    Double dealValue = Double.parseDouble(parse(dealPropValues[i]));
			    if (dealValue > Double.valueOf(1000000000000.0))
			    {
				opportunity.expected_value = 0.0;
			    }
			    else
			    {
				opportunity.expected_value = dealValue;
			    }
			}
			else if (value.equalsIgnoreCase("closeDate"))
			{
			    String dealDate = dealPropValues[i];
			    if (dealDate != null && !dealDate.isEmpty())
			    {
				//date is dd/MM/yyyy format
				String[]data = dealDate.split("/");
				if(data.length == 3){
				    Calendar c = Calendar.getInstance();
				    int year = Integer.parseInt(data[2]);
				    int month = Integer.parseInt(data[0]);
				    int day = Integer.parseInt(data[1]);
				    c.set(year, month-1, day);
				    Date date = c.getTime();
				    opportunity.close_date = date.getTime()/1000;
				}else{
				    opportunity.close_date = null;
				}
				
				

			    }
			    else
			    {
				opportunity.close_date = null;
			    }

			}
			else if (value.equalsIgnoreCase("relatedTo"))
			{
			    String data = dealPropValues[i].toLowerCase();
			    boolean email = isValidEmail(data);

			    if (email)
			    {
				try
				{
				    Contact contact = ContactUtil.searchContactByEmail(data);
				    if (contact.id != null)
				    {
					opportunity.addContactIds(contact.id.toString());
				    }
				}
				catch (NullPointerException e)
				{
				    e.printStackTrace();
				}
			    }
			}
			else if (value.equalsIgnoreCase("note"))
			{
			    Note note = new Note();
			    note.description = dealPropValues[i];
			    note.save();
			}

		    }
		    else
		    {
			CustomFieldData custom = new CustomFieldData();
			custom.name = value;
			custom.value = dealPropValues[i];
			customFields.add(custom);

		    }
		}

	    }

	    opportunity.setOpportunityOwner(ownerKey);

	    // check milestone if null the search in default

	    if (opportunity.milestone == null)
	    {
		Milestone milestone = MilestoneUtil.getMilestones();
		if (milestone != null && !mileStoneValue.isEmpty())
		{
		    opportunity.pipeline_id = milestone.id;
		    // search for milestone name
		    String[] milestonesValues = milestone.milestones.split(",");
		    if (milestonesValues.length > 0)
		    {
			for (String s : milestonesValues)
			{
			    if (s != null)
			    {
				if (s.equalsIgnoreCase(mileStoneValue))
				{
				    opportunity.milestone = s;
				    opportunity.track = "Default";
				    break;
				}
			    }
			}
		    }

		}
	    }
	    // add all custom field in deals
	    opportunity.custom_data = customFields;
	    try
	    {

		opportunity.save();
		savedDeals++;

	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
		failedDeals++;
	    }
	}

	buildDealsImportStatus(status, "SAVED", savedDeals);
	buildDealsImportStatus(status, "FAILED", failedDeals + probabilityError);
	buildDealsImportStatus(status, "TOTAL", totalDeals);

	SendMail.sendMail(domainUser.email, "CSV Deals Import Status", "csv_deal_import", new Object[] { domainUser,
		status });
	BulkActionNotifications.publishconfirmation(BulkAction.DEALS_CSV_IMPORT, String.valueOf(savedDeals));

    }

    private void buildDealsImportStatus(Map<String, Object> statusMap, String status, Integer count)
    {

	statusMap.put(status, count);
    }

    private boolean isValidEmail(final String hex)
    {
	String EMAIL_PATTERN = "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@"
		+ "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
	Pattern pattern = Pattern.compile(EMAIL_PATTERN);
	Matcher matcher = pattern.matcher(hex);
	return matcher.matches();

    }

    private String parse(String data)
    {
	return data.replaceAll("[\\%$&*#@!()+\\- A-Za-z]", "").trim();
    }

}
