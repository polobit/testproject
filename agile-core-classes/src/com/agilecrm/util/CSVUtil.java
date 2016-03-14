package com.agilecrm.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringReader;
import java.io.UnsupportedEncodingException;
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
import java.util.TreeSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.io.IOUtils;
import org.apache.commons.io.LineIterator;
import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import au.com.bytecode.opencsv.CSVReader;
import au.com.bytecode.opencsv.CSVWriter;

import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.Activity.EntityType;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.ContactField.FieldType;
import com.agilecrm.contact.CustomFieldDef;
import com.agilecrm.contact.CustomFieldDef.SCOPE;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.CustomFieldDefUtil;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.contact.util.bulk.BulkActionNotifications.BulkAction;
import com.agilecrm.db.GoogleSQL;
import com.agilecrm.deals.CustomFieldData;
import com.agilecrm.deals.Milestone;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.MilestoneUtil;
import com.agilecrm.exception.InvalidTagException;
import com.agilecrm.export.gcs.GCSServiceAgile;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction;
import com.agilecrm.subscription.restrictions.entity.impl.ContactBillingRestriction;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.access.UserAccessControl;
import com.agilecrm.user.access.exception.AccessDeniedException;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.email.SendMail;
import com.agilecrm.validator.TagValidator;
import com.google.agile.repackaged.appengine.tools.cloudstorage.GcsFileOptions;
import com.google.appengine.api.NamespaceManager;
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
    String bulk_action_tracker = String.valueOf(System.currentTimeMillis());

    private ContactBillingRestriction dBbillingRestriction;

    private static final int MAX_ALLOWED_FIELD_VALUE_SIZE = 490;

    private UserAccessControl accessControl = null;
    private GCSServiceAgile service;
    private CSVWriter failedContactsWriter = null;

    private CSVUtil()
    {

    }

    public CSVUtil(BillingRestriction billingRestriction, UserAccessControl accessControl)
    {
	this.billingRestriction = billingRestriction;
	dBbillingRestriction = (ContactBillingRestriction) DaoBillingRestriction.getInstace(
		Contact.class.getSimpleName(), this.billingRestriction);

	GcsFileOptions options = new GcsFileOptions.Builder().mimeType("text/csv").contentEncoding("UTF-8")
		.acl("public-read").addUserMetadata("domain", NamespaceManager.get()).build();

	service = new GCSServiceAgile(
		NamespaceManager.get() + "_failed_contacts_" + GoogleSQL.getFutureDate() + ".csv", "agile-exports",
		options);

	this.accessControl = accessControl;

    }

    public static enum ImportStatus
    {
	TOTAL, SAVED_CONTACTS, MERGED_CONTACTS, DUPLICATE_CONTACT, NAME_MANDATORY, EMAIL_REQUIRED, INVALID_EMAIL, TOTAL_FAILED, NEW_CONTACTS, LIMIT_REACHED,

	ACCESS_DENIED, TYPE, PROBABILITY, TRACK, FAILEDCSV;

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

	// Creates domain user key, which is set as a contact owner
	Key<DomainUser> ownerKey = new Key<DomainUser>(DomainUser.class, Long.parseLong(ownerId));

	DomainUser domainUser = DomainUserUtil.getDomainUser(ownerKey.getId());

	BulkActionUtil.setSessionManager(domainUser);

	// Refreshes count of contacts. This is removed as it already calculated
	// in deferred task; there is limation on count in remote api (max count
	// it gives is 1000)
	// billingRestriction.refreshContacts();

	System.out.println(billingRestriction.getCurrentLimits().getPlanId() + " : "
		+ billingRestriction.getCurrentLimits().getPlanName());
	int allowedContacts = billingRestriction.getCurrentLimits().getContactLimit();
	boolean limitCrossed = false;
	// stores list of failed contacts in beans with causes
	List<FailedContactBean> failedContacts = new ArrayList<FailedContactBean>();

	List<String[]> csvData = getCSVDataFromStream(blobStream, "UTF-8");

	if (csvData.isEmpty())
	    return;
	// extract csv heading from csv file
	String[] headings = csvData.remove(0);

	contact.type = Contact.Type.PERSON;

	LinkedHashSet<String> tags = new LinkedHashSet<String>();

	// Adds new tags to temporary list to save them in all contacts
	tags.addAll(contact.tags);

	List<ContactField> properties = contact.properties;

	System.out.println(csvData.size());

	System.out.println("available scopes for user " + domainUser.email + ", scopes = "
		+ accessControl.getCurrentUserScopes());

	// Counters to count number of contacts saved contacts
	int savedContacts = 0;
	int mergedContacts = 0;
	int limitExceeded = 0;
	int accessDeniedToUpdate = 0;
	Map<Object, Object> status = new HashMap<Object, Object>();
	status.put("type", "Contacts");

	List<CustomFieldDef> customFields = CustomFieldDefUtil.getCustomFieldsByScopeAndType(SCOPE.CONTACT, "DATE");
	List<CustomFieldDef> imagefield = CustomFieldDefUtil.getCustomFieldsByScopeAndType(SCOPE.CONTACT, "text");

	/**
	 * Iterates through all the records from blob
	 */
	for (String[] csvValues : csvData)
	{
	    // Set to hold the notes column positions so they can be created
	    // after a contact is created.
	    Set<Integer> notes_positions = new TreeSet<Integer>();
	    Contact tempContact = new Contact();

	    boolean isMerged = false;
	    try
	    {
		// create dummy contact

		// Cloning so that wrong tags don't get to some contact if
		// previous
		// contact is merged with exiting contact
		tempContact.tags = (LinkedHashSet<String>) contact.tags.clone();
		tempContact.setContactOwner(ownerKey);

		tempContact.properties = new ArrayList<ContactField>();

		for (int j = 0; j < csvValues.length; j++)
		{

		    String csvValue = csvValues[j];
		    if (StringUtils.isBlank(csvValue))
			continue;

		    ContactField field = null;
		    if (j < properties.size())
		    {
			field = properties.get(j);
		    }
		    else
		    {
			break;
		    }

		    // This is hardcoding but found no way to get
		    // tags
		    // from the CSV file
		    if (field == null)
		    {
			continue;
		    }

		    if ("note".equals(field.name))
		    {
			notes_positions.add(j);
			continue;
		    }

		    // Trims content of field to 490 characters. It should not
		    // be trimmed for notes
		    csvValues[j] = checkAndTrimValue(csvValue);

		    if ("tags".equals(field.name))
		    {
			// Multiple tags are supported. Multiple tags are added
			// split at , or ;
			String[] tagsArray = csvValues[j].split("[,;]+");

			for (String tag : tagsArray)
			{
			    if (!TagValidator.getInstance().validate(tag))
			    {
				throw new InvalidTagException();
			    }
			    tempContact.tags.add(tag);
			}
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
			    e.printStackTrace();
			}
			continue;
		    }

		    // To avoid saving ignore field value/ and avoid fields with
		    // empty values
		    if (field.name == null)
			continue;

		    field.value = csvValues[j];

		    if (field.type.equals(FieldType.CUSTOM))
		    {
			for (CustomFieldDef customFieldDef : customFields)
			{
			    if (field.name.equalsIgnoreCase(customFieldDef.field_label))
			    {
				String customDate = csvValues[j];

				if (customDate != null && !customDate.isEmpty())
				{
				    field.value = getFormattedDate(customDate);
				}

			    }
			}

			// set image in custom fields
			if (field.name.equalsIgnoreCase(Contact.IMAGE))
			{

			    for (CustomFieldDef customFieldDef : imagefield)
			    {
				if (field.name.equalsIgnoreCase(customFieldDef.field_label))
				{
				    String img = csvValues[j];
				    if (!StringUtils.isBlank(img))
				    {
					field.value = img;
				    }
				}
			    }
			}

		    }
		    if (field.name.equalsIgnoreCase(Contact.COMPANY))
		    {
			tempContact.properties.add(new ContactField(Contact.COMPANY, csvValues[j].trim().toLowerCase(),
				null));
		    }

		    tempContact.properties.add(field);

		}// end of inner for loop

		// Contact dummy = getDummyContact(properties, csvValues);

		if (!isValidFields(tempContact, status, failedContacts, properties, csvValues))

		    continue;

		// If contact is duplicate, it fetches old contact and updates
		// data.
		if (ContactUtil.isDuplicateContact(tempContact))
		{
		    // Checks if user can update the contact

		    // Sets current object to check scope

		    tempContact = ContactUtil.mergeContactFields(tempContact);
		    accessControl.setObject(tempContact);
		    if (!accessControl.canDelete())
		    {
			accessDeniedToUpdate++;
			failedContacts.add(new FailedContactBean(getDummyContact(properties, csvValues),
				"Access denied to update contact"));

			continue;
		    }
		    isMerged = true;
		}
		else
		{

		    // If it is new contacts billingRestriction count is
		    // increased
		    // and checked with plan limits

		    ++billingRestriction.contacts_count;
		    System.out.println("Contacts limit - Allowed : "
			    + billingRestriction.getCurrentLimits().getContactLimit() + " current contacts count : "
			    + billingRestriction.contacts_count);
		    if (limitCrossed)
		    {
			++limitExceeded;
			failedContacts.add(new FailedContactBean(getDummyContact(properties, csvValues),
				"limit is exceeded"));
			continue;
		    }

		    if (billingRestriction.contacts_count >= allowedContacts)
		    {
			limitCrossed = true;

			continue;
		    }
		}

		tempContact.bulkActionTracker = bulk_action_tracker;
		tempContact.save(false);
	    }// end of try
	    catch (InvalidTagException e)
	    {

		System.out.println("Invalid tag exception raised while saving contact ");
		e.printStackTrace();
		failedContacts.add(new FailedContactBean(getDummyContact(properties, csvValues), e.getMessage()));
		continue;
	    }
	    catch (AccessDeniedException e)
	    {

		accessDeniedToUpdate++;
		System.out.println("ACL exception raised while saving contact ");
		e.printStackTrace();
		failedContacts.add(new FailedContactBean(getDummyContact(properties, csvValues), e.getMessage()));

	    }
	    catch (Exception e)
	    {

		System.out.println("exception raised while saving contact ");
		e.printStackTrace();
		if (tempContact.id != null)
		{
		    failedContacts.add(new FailedContactBean(getDummyContact(properties, csvValues),
			    "Exception raise while saving contact"));
		}

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

	}// end of for loop

	if (failedContacts.size() > 0)
	    buildCSVImportStatus(status, ImportStatus.TOTAL_FAILED, failedContacts.size());

	buildCSVImportStatus(status, ImportStatus.TOTAL, csvData.size());

	if (savedContacts > 0)
	{
	    buildCSVImportStatus(status, ImportStatus.NEW_CONTACTS, savedContacts);
	    buildCSVImportStatus(status, ImportStatus.SAVED_CONTACTS, savedContacts);
	}
	if (mergedContacts > 0)
	{
	    buildCSVImportStatus(status, ImportStatus.SAVED_CONTACTS, mergedContacts);

	    buildCSVImportStatus(status, ImportStatus.MERGED_CONTACTS, mergedContacts);

	}
	if (limitExceeded > 0)
	{
	    buildCSVImportStatus(status, ImportStatus.LIMIT_REACHED, limitExceeded);
	}
	if (accessDeniedToUpdate > 0)
	{
	    buildCSVImportStatus(status, ImportStatus.ACCESS_DENIED, accessDeniedToUpdate);
	}
	buildCSVImportStatus(status, ImportStatus.FAILEDCSV, 1);

	// Sends notification on CSV import completion
	dBbillingRestriction.send_warning_message();

	// Send notification after contacts save complete
	BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_CSV_IMPORT, String.valueOf(savedContacts));
	// create failed contact csv

	buildFailedContacts(domainUser, failedContacts, headings, status);
	if (savedContacts != 0 || mergedContacts != 0)
	    ActivityUtil.createLogForImport(ActivityType.CONTACT_IMPORT, EntityType.CONTACT, savedContacts,
		    mergedContacts);

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

		String csvValue = csvValues[j];
		if (StringUtils.isBlank(csvValue))
		    continue;
		ContactField field = null;
		if (j < properties.size())
		{
		    field = properties.get(j);
		}
		else
		{
		    break;
		}

		// This is hardcoding but found no way to get
		// tags
		// from the CSV file
		if (field == null)
		{
		    continue;
		}

		// Trims content of field to 490 characters. It should not
		// be trimmed for notes
		csvValues[j] = checkAndTrimValue(csvValue);

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
		    companyName = field.value = csvValues[j];
		    // added company in new field in lower case
		    tempContact.properties.add(new ContactField("company", companyName.trim().toLowerCase(), null));
		}
		else
		{
		    field.value = csvValues[j];
		}

		if (field.type.equals(FieldType.CUSTOM))
		{
		    List<CustomFieldDef> customFields = CustomFieldDefUtil.getCustomFieldsByScopeAndType(SCOPE.COMPANY,
			    "DATE");
		    for (CustomFieldDef customFieldDef : customFields)
		    {
			if (field.name.equalsIgnoreCase(customFieldDef.field_label))
			{
			    String customDate = csvValues[j];

			    if (customDate != null && !customDate.isEmpty())
			    {
				field.value = getFormattedDate(customDate);
			    }

			}
		    }
		}

		tempContact.properties.add(field);

	    }

	    boolean isMerged = false;

	    // save contact as company
	    if (companyName != null && !companyName.isEmpty())
	    {

		if (ContactUtil.isCompanyExist(companyName))
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

	buildCSVImportStatus(status, ImportStatus.TOTAL, companies.size());
	if (savedCompany > 0)
	{
	    buildCSVImportStatus(status, ImportStatus.NEW_CONTACTS, savedCompany);
	    buildCSVImportStatus(status, ImportStatus.SAVED_CONTACTS, savedCompany);
	}

	if (mergedCompany > 0)
	{
	    buildCSVImportStatus(status, ImportStatus.SAVED_CONTACTS, mergedCompany);

	    buildCSVImportStatus(status, ImportStatus.MERGED_CONTACTS, mergedCompany);

	}
	if (nameMissing > 0)
	{
	    buildCSVImportStatus(status, ImportStatus.NAME_MANDATORY, nameMissing);

	}

	if (limitExceeded > 0)
	{
	    buildCSVImportStatus(status, ImportStatus.LIMIT_REACHED, limitExceeded);
	}
	if (accessDeniedToUpdate > 0)
	{
	    buildCSVImportStatus(status, ImportStatus.ACCESS_DENIED, accessDeniedToUpdate);
	}
	if (failedCompany > 0 || nameMissing > 0 || accessDeniedToUpdate > 0 || limitExceeded > 0)
	{
	    buildCSVImportStatus(status, ImportStatus.TOTAL_FAILED, failedCompany + nameMissing + accessDeniedToUpdate
		    + limitExceeded);
	}

	// avoid message of attached failed csv file add new property in map so
	// we can check if there is some company get failed we dont need that
	// message like find failed attached csv file for company
	// TODO: jitendra implement unsucessfull csv for company import

	// calculateTotalFailedContacts(status);

	// Sends notification on CSV import completion
	dBbillingRestriction.send_warning_message();

	SendMail.sendMail(domainUser.email, "CSV Companies Import Status", SendMail.CSV_IMPORT_NOTIFICATION,
		new Object[] { domainUser, status });

	if (savedCompany != 0 || mergedCompany != 0)
	    ActivityUtil.createLogForImport(ActivityType.COMPANY_IMPORT, EntityType.CONTACT, savedCompany,
		    mergedCompany);
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

	if (count > 0)
	{
	    statusMap.put(status, count);
	}
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
	if (total > 0)
	{
	    status.put(ImportStatus.TOTAL_FAILED, total);
	}
    }

    public boolean isValidFields(Contact contact, Map<Object, Object> statusMap, List<FailedContactBean> failed,
	    List<ContactField> properties, String[] csvValues)
    {
	if (StringUtils.isBlank(contact.getContactFieldValue(Contact.FIRST_NAME))
		&& StringUtils.isBlank(contact.getContactFieldValue(Contact.LAST_NAME)))
	{
	    buildCSVImportStatus(statusMap, ImportStatus.NAME_MANDATORY, 1);
	    failed.add(new FailedContactBean(getDummyContact(properties, csvValues), "Name field can't be blank"));
	    return false;
	}
	if (StringUtils.isBlank(contact.getContactFieldValue(Contact.EMAIL)))
	{
	    buildCSVImportStatus(statusMap, ImportStatus.EMAIL_REQUIRED, 1);
	    failed.add(new FailedContactBean(getDummyContact(properties, csvValues), "Email field can't be blank"));
	    return false;
	}

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
	Integer nameMissing = 0;
	Integer trackMissing = 0;
	Integer milestoneMissing = 0;

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
	deals.remove(0);

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
	    boolean trackFound = false;
	    boolean milestoneFound = false;
	    boolean wrongMilestone = false;
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
			    trackFound = true;

			    list = MilestoneUtil.getMilestonesList(trackName);
			    if (list.size() == 0)
			    {
				trackMissing++;
				break;
			    }
			    else
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
			    milestoneFound = true;
			    if (trackFound)
			    {
				// check list of milestone if track is correct
				// then list may have some value
				if (!StringUtils.isBlank(mileStoneValue) && list.size() > 0)
				{
				    for (Milestone m : list)
				    {
					String[] values = m.milestones.split(",");
					for (String s : values)
					{
					    if (s.equalsIgnoreCase(mileStoneValue))
					    {
						opportunity.milestone = s;
						opportunity.pipeline_id = m.id;
						wrongMilestone = false;
						break;
					    }
					    else
					    {
						wrongMilestone = true;
					    }
					}
				    }
				}
			    }
			    else
			    {
				Milestone defaultMilestone = MilestoneUtil.getMilestones();
				if (defaultMilestone != null)
				{
				    String[] values = defaultMilestone.milestones.split(",");
				    // search milestone in default track
				    if (!StringUtils.isEmpty(mileStoneValue))
				    {
					for (String s : values)
					{
					    if (s.equalsIgnoreCase(mileStoneValue))
					    {
						opportunity.milestone = s;
						wrongMilestone = false;
						break;
					    }
					    else
					    {
						wrongMilestone = true;
					    }
					}
				    }
				}
				// set deals to default track
				opportunity.pipeline_id = defaultMilestone.id;
				// get default track
			    }

			}
			else if (value.equals("probability"))
			{
			    String prob = dealPropValues[i];
			    if (prob != null && (!prob.isEmpty()))
			    {
				try
				{
				    Double probability = Double.parseDouble(parse(prob));
				    if (probability > 100)
				    {
					opportunity.probability = 0;
				    }
				    else
				    {

					opportunity.probability = (int) Math.round(probability);

				    }
				}
				catch (NumberFormatException | ClassCastException e)
				{
				    e.printStackTrace();
				}
			    }
			}
			else if (value.equalsIgnoreCase("value"))
			{
			    String val = dealPropValues[i];
			    if (val != null && (!val.isEmpty()))
			    {
				try
				{
				    Double dealValue = Double.parseDouble(parse(val));
				    if (dealValue > Double.valueOf(1000000000000.0))
				    {
					opportunity.expected_value = 0.0;
				    }
				    else
				    {
					opportunity.expected_value = dealValue;
				    }
				}
				catch (NumberFormatException e)
				{
				    e.printStackTrace();
				}
			    }
			}
			else if (value.equalsIgnoreCase("closeDate"))
			{
			    String dealDate = dealPropValues[i];
			    if (dealDate != null && !dealDate.isEmpty())
			    {
				// date is dd-MM-yyyy format
				String[] data = dealDate.split("-");
				if (data.length == 3)
				{
				    try
				    {
					Calendar c = Calendar.getInstance();
					int year = Integer.parseInt(data[2].trim());
					int month = Integer.parseInt(data[1].trim());
					int day = Integer.parseInt(data[0].trim());
					if (month > 0)
					{
					    month = month - 1;
					}
					c.set(year, month , day);
					Date date = c.getTime();
					if (month > 11)
					{
					    opportunity.close_date = null;
					}
					else
					{
					    opportunity.close_date = date.getTime() / 1000;
					}
				    }
				    catch (NumberFormatException e)
				    {
					e.printStackTrace();
				    }
				}
				else
				{
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
			    if (StringUtils.isNotBlank(data))
			    {

				String[] emails = data.split(",");
				for (int k = 0; k < emails.length; k++)
				{

				    boolean email = isValidEmail(emails[k]);

				    if (email)
				    {
					try
					{
					    Contact contact = ContactUtil.searchContactByEmail(emails[k]);
					    if (contact != null && contact.id != null)
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

	    // case2: if track is mapped and milestone is not mapped then deal
	    // should
	    // go in that track and first milestone value
	    if (StringUtils.isEmpty(opportunity.milestone) && trackFound && list.size() > 0)
	    {
		Milestone milestone = list.get(0);
		if (milestone != null)
		{
		    String[] values = milestone.milestones.split(",");
		    opportunity.milestone = values[0];
		    opportunity.pipeline_id = milestone.id;
		}
	    }

	    // case3: if track and milestone both are not mapped then deal
	    // should go
	    // in default track of first milestone
	    if (!trackFound && !milestoneFound)
	    {
		Milestone milestone = MilestoneUtil.getMilestones();
		if (milestone != null)
		{
		    opportunity.pipeline_id = milestone.id;
		    String[] values = milestone.milestones.split(",");
		    opportunity.milestone = values[0];
		}
	    }

	    // add all custom field in deals
	    opportunity.custom_data = customFields;
	    try
	    {
		if (!StringUtils.isEmpty(opportunity.name) && opportunity.pipeline_id != null
			&& opportunity.milestone != null && !wrongMilestone)
		{
		    opportunity.save();
		    savedDeals++;
		}
		else
		{
		    if (StringUtils.isEmpty(opportunity.name))
		    {
			nameMissing++;
		    }
		    if (wrongMilestone)
		    {
			buildDealsImportStatus(status, "MILESTONE", ++milestoneMissing);
		    }

		}

	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
		failedDeals++;
	    }
	}

	buildDealsImportStatus(status, "SAVED", savedDeals);
	buildDealsImportStatus(status, "FAILED", totalDeals - savedDeals);
	buildDealsImportStatus(status, "TOTAL", totalDeals);
	if (nameMissing > 0)
	{
	    buildDealsImportStatus(status, "NAMEMISSING", nameMissing);
	}

	if (trackMissing > 0)
	{
	    buildDealsImportStatus(status, "TRACKMISING", trackMissing);
	}
	if (milestoneMissing > 0)
	{
	    buildDealsImportStatus(status, "MILESTONE", milestoneMissing);
	}

	SendMail.sendMail(domainUser.email, "CSV Deals Import Status", "csv_deal_import", new Object[] { domainUser,
		status });

	if (savedDeals > 0)
	    ActivityUtil.createLogForImport(ActivityType.DEAL_IMPORT, EntityType.DEAL, savedDeals, 0);
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

    /**
     * parse string data
     * 
     * @param data
     * @return
     */
    private String parse(String data)
    {

	String lastdecimalIndexVal = "";
	if (data.indexOf(".") > 0)
	{
	    lastdecimalIndexVal = data.substring(data.lastIndexOf("."));
	    data = data.substring(0, data.lastIndexOf("."));
	}

	String parseVal = data.replaceAll("[\\W A-Za-z]", "");
	System.out.println(parseVal);

	return (parseVal + lastdecimalIndexVal).trim();

    }

    /**
     * build failed contact csv file
     * 
     * @param contact
     */
    private void buildFailedContacts(DomainUser domainUser, List<FailedContactBean> failedContacts, String[] headings,
	    Map<Object, Object> status)
    {
	String path = null;
	try
	{
	    System.out.println("Export functionality email" + failedContacts);
	    if (failedContacts == null || failedContacts.size() == 0)
	    {
		System.out.println("no failed conditions");
		// Send every partition as separate email
		sendFailedContactImportFile(domainUser, null, 0, status);
		return;
	    }

	    System.out.println("writing file service");

	    // Builds Contact CSV
	    writeFailedContactsInCSV(getCSVWriterForFailedContacts(), failedContacts, headings);

	    System.out.println("wrote files to CSV");

	    service.getOutputchannel().close();

	    System.out.println("closing stream");

	    byte[] data = service.getDataFromFile();

	    System.out.println("byte data");

	    System.out.println(data.length);
	    System.out.println(domainUser.email);

	    // Send every partition as separate email
	    sendFailedContactImportFile(domainUser, new String(data, "UTF-8"), failedContacts.size(), status);

	    service.deleteFile();

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

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
		writer.writeNext(toArray(toList(bean.getContact().properties), bean.getCauses(), heads.length));
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
	headings[i] = "Error";
	return headings;

    }

    private String[] toArray(List<String> properties, String errorMsg, int index)
    {
	try
	{
	    properties.add(index - 1, errorMsg);
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
    private List<String> toList(List<ContactField> contactProperties)
    {
	List<String> list = new ArrayList<String>();
	for (ContactField field : contactProperties)
	{
	    list.add(field.value);
	}

	return list;
    }

    /**
     * helper function for send mail of import contacts status with failed
     * contact csv attachment if failed contacts are found then it will send
     * with failed contact csv file other wise send normal status mail
     * 
     */
    public void sendFailedContactImportFile(DomainUser domainUser, String csvData, int totalRecords,
	    Map<Object, Object> status)
    {

	/*
	 * HashMap<String, String> map = new HashMap<String, String>();
	 * map.put("count", totalRecords);
	 */

	if (totalRecords >= 1)
	{
	    String[] strArr = { "text/csv", "FailedContacts.csv", csvData };
	    SendMail.sendMail(domainUser.email, "CSV Contacts Import Status", SendMail.CSV_IMPORT_NOTIFICATION,
		    new Object[] { domainUser, status }, SendMail.AGILE_FROM_EMAIL, SendMail.AGILE_FROM_NAME, strArr);
	}
	else
	{
	    SendMail.sendMail(domainUser.email, "CSV Contacts Import Status", SendMail.CSV_IMPORT_NOTIFICATION,
		    new Object[] { domainUser, status });
	}

    }

    /**
     * Helper function create dummy contact
     * 
     * @param schema
     * @param csvData
     * @return Contact
     */
    public Contact getDummyContact(List<ContactField> contactProperties, String[] csvData)
    {

	Contact dummyContact = new Contact();

	for (int j = 0; j < csvData.length; j++)
	{

	    ContactField temp = contactProperties.get(j);

	    ContactField field = new ContactField(temp.name, csvData[j], temp.subtype);

	    dummyContact.properties.add(field);
	}
	return dummyContact;
    }

    private String checkAndTrimValue(String value)
    {
	value = value.trim();

	// If field value is more than 500, it will trim the value
	if (value.length() > MAX_ALLOWED_FIELD_VALUE_SIZE)
	    value = value.substring(0, MAX_ALLOWED_FIELD_VALUE_SIZE);

	return value;
    }

    private String getFormattedDate(String dateString)
    {
	String formatedDate = null;
	// date is MM-dd-yyyy or MM/dd/yyyy format
	String[] data = dateString.split("[-/]");

	if (data.length == 3)
	{

	    try
	    {
		Calendar c = Calendar.getInstance();
		int year = Integer.parseInt(data[2].trim());
		int day = Integer.parseInt(data[1].trim());
		int month = Integer.parseInt(data[0].trim());
		if (month > 0)
		{
		    month = month - 1;
		}
		c.set(year, month, day);
		Date date = c.getTime();
		if (month > 11)
		{
		    formatedDate = null;
		}
		else
		{
		    formatedDate = "" + date.getTime() / 1000;
		}
		if (year < 1000)
		    return formatedDate = null;
	    }
	    catch (NumberFormatException e)
	    {
		System.out.println("Invalid date.. year must be 4 digit");
		e.printStackTrace();
	    }

	}

	return formatedDate;
    }

    private CSVWriter getCSVWriterForFailedContacts() throws IOException
    {
	if (failedContactsWriter != null)
	    return failedContactsWriter;

	System.out.println("building failed contacts service");
	return failedContactsWriter = new CSVWriter(service.getOutputWriter());
    }

}