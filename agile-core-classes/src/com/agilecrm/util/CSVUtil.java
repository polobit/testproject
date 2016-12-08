package com.agilecrm.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringReader;
import java.io.UnsupportedEncodingException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
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
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONException;
import org.json.JSONObject;

import au.com.bytecode.opencsv.CSVReader;
import au.com.bytecode.opencsv.CSVWriter;

import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.Activity.EntityType;
import com.agilecrm.activities.Category;
import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.activities.util.CategoriesUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.ContactField.FieldType;
import com.agilecrm.contact.CustomFieldDef;
import com.agilecrm.contact.CustomFieldDef.SCOPE;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.upload.blob.status.dao.ImportStatusDAO;
import com.agilecrm.contact.upload.blob.status.specifications.StatusProcessor;
import com.agilecrm.contact.upload.blob.status.specifications.StatusSender;
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
import com.agilecrm.deals.util.OpportunityUtil;
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
import com.agilecrm.user.util.AliasDomainUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.email.SendMail;
import com.agilecrm.util.language.LanguageUtil;
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
    private ImportStatusDAO importStatusDAO = null;
    private StatusSender statusSender = null;

    private StatusProcessor<?> statusProcessor = null;
    private static final DateFormat dateTimeFormat = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");

    private CSVUtil()
    {

    }

    public CSVUtil(BillingRestriction billingRestriction, UserAccessControl accessControl,
	    ImportStatusDAO importStatusDAO)
    {
	int i = 0;

	this.billingRestriction = billingRestriction;
	dBbillingRestriction = (ContactBillingRestriction) DaoBillingRestriction.getInstace(
		Contact.class.getSimpleName(), this.billingRestriction);

	//if (!VersioningUtil.isLocalHost())
	//{
	    GcsFileOptions options = new GcsFileOptions.Builder().mimeType("text/csv").contentEncoding("UTF-8")
	    		.acl("public-read").addUserMetadata("domain", NamespaceManager.get()).build();

	    service = new GCSServiceAgile(NamespaceManager.get() + "_failed_contacts_" + GoogleSQL.getFutureDate()
		    + ".csv", "agile-exports", options);
	//}

	this.accessControl = accessControl;

	this.importStatusDAO = importStatusDAO;

    }

    public static enum ImportStatus
    {
	TOTAL, SAVED_CONTACTS, MERGED_CONTACTS, DUPLICATE_CONTACT, NAME_MANDATORY, EMAIL_REQUIRED, INVALID_EMAIL, TOTAL_FAILED, NEW_CONTACTS, LIMIT_REACHED,

	ACCESS_DENIED, TYPE, PROBABILITY, TRACK, FAILEDCSV, INVALID_TAG, SOURCE_MISMATCHED, STATUS_MISMATCHED, CONVERTED_CONTACTS;

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
	    if (importStatusDAO != null && ownerKey != null)
		importStatusDAO.createNewImportStatus(ownerKey, data.size(), null);
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
     * Status sender is injected to import instance
     * 
     * @param statusSender
     */
    public void setStatusSender(StatusSender statusSender)
    {
	this.statusSender = statusSender;
    }

    /**
     * Status processor is injected to import instance
     * 
     * @param statusProcessor
     */
    public void setStatusProcessor(StatusProcessor<?> statusProcessor)
    {
	this.statusProcessor = statusProcessor;
    }

    private void reportStatus(int numberOfContacts)
    {
	if (statusSender != null && statusProcessor != null)
	{
	    System.out.println(statusProcessor);
	    statusProcessor.setCount(numberOfContacts);
	    statusSender.sendEmail(domainUser, statusProcessor);
	}
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
    private Key<DomainUser> ownerKey = null;
    private DomainUser domainUser = null;

    public void createContactsFromCSV(InputStream blobStream, Contact contact, String ownerId)
	    throws PlanRestrictedException, IOException
    {
    	
    	Map<Object, Object> stats = new HashMap<Object, Object>();
    	Long time = System.currentTimeMillis();
    	stats.put("start_time", dateTimeFormat.format(time));
	// Creates domain user key, which is set as a contact owner
	this.ownerKey = new Key<DomainUser>(DomainUser.class, Long.parseLong(ownerId));

	domainUser = DomainUserUtil.getDomainUser(ownerKey.getId());

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
	reportStatus(csvData.size());
	

	if (csvData.isEmpty())
	    return;
	// extract csv heading from csv file
	String[] headings = csvData.remove(0);
	stats.put("count", csvData.size());
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
	 * Processed contacts count.
	 */
	int processedContacts = 0;
	int resettedProcessedcontacts = 0;
	/**
	 * Iterates through all the records from blob
	 */
	for (String[] csvValues : csvData)
	{
	    processedContacts++;
	    resettedProcessedcontacts++;
	    if (resettedProcessedcontacts >= 1000)
	    {
		try
		{
		    resettedProcessedcontacts = 0;
		    importStatusDAO.updateStatus(processedContacts);
		}
		catch (Exception e)
		{
		    e.printStackTrace();
		}

	    }

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
			    tag = tag.trim();
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
		    	String companyName = csvValues[j].trim();
			tempContact.properties.add(new ContactField(Contact.COMPANY, companyName,
				null));
		    }

		    tempContact.properties.add(field);
		    tempContact.source = "importing" ;
		    System.out.println("temp contact source is "+tempContact.source);

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
			failedContacts.add(new FailedContactBean(getDummyContact(properties, csvValues) , "Contact is merged"));
		    tempContact = ContactUtil.mergeContactFields(tempContact);
		    accessControl.setObject(tempContact);
		    if (!accessControl.canCreate())
		    {
			accessDeniedToUpdate++;
			failedContacts.add(new FailedContactBean(getDummyContact(properties, csvValues),
				"Error! Access denied to update contact"));

			continue;
		    }
		    /*else{
		    	failedContacts.add(new FailedContactBean(tempContact , "Contact is been merged"));
		    }*/
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
				"Error! limit is exceeded"));
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
		failedContacts.add(new FailedContactBean(getDummyContact(properties, csvValues),"Error! "+e.getMessage()));
		continue;
	    }
	    catch (AccessDeniedException e)
	    {

		accessDeniedToUpdate++;
		System.out.println("ACL exception raised while saving contact ");
		e.printStackTrace();
		failedContacts.add(new FailedContactBean(getDummyContact(properties, csvValues), "Error! "+e.getMessage()));

	    }
	    catch (Exception e)
	    {

		System.out.println("exception raised while saving contact "+e);
		e.printStackTrace();
		if (tempContact.id != null)
		{
		    failedContacts.add(new FailedContactBean(getDummyContact(properties, csvValues),
			    "Error! Exception raise while saving contact"));
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

	    processedContacts++;

	}// end of for loop

	try
	{
	    importStatusDAO.deleteStatus();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	if (failedContacts.size() > 0)
	    buildCSVImportStatus(status, ImportStatus.TOTAL_FAILED, failedContacts.size() - mergedContacts);

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
	
	buildFailedContacts(domainUser, failedContacts, headings, status,stats);
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
	List<FailedContactBean> failedCompanies = new ArrayList<FailedContactBean>();

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
	int tagInvalid = 0;
	Map<Object, Object> status = new HashMap<Object, Object>();
	status.put("type", type);

	// creates contacts by iterating contact properties

   
    
	for (String[] csvValues : companies)
	{

		 // Set to hold the notes column positions so they can be created
	    // after a contact is created.
	    Set<Integer> notes_positions = new TreeSet<Integer>();
	    Contact tempContact = new Contact();
	    tempContact.tags = (LinkedHashSet<String>) contact.tags.clone();

	    tempContact.type = Type.COMPANY;
	    tempContact.setContactOwner(ownerKey);

	    tempContact.properties = new ArrayList<ContactField>();
	    String companyName = null;
	    boolean canSave = true;/*boolean invalidName = true;*/
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
		 if ("note".equals(field.name))
		    {
			notes_positions.add(j);
			continue;
		    }
		csvValues[j] = checkAndTrimValue(csvValue);

		if ("tags".equals(field.name))
		{
		    // Multiple tags are supported. Multiple tags are added
		    // split at , or ;

		    String[] tagsArray = csvValues[j].split("[,;]+");
		    boolean isInvalid = false;
		    System.out.println("number of tags : " + tagsArray.length);
		    for (String tag : tagsArray)
		    {
			System.out.println("New tag : " + tag);
			tag = tag.trim();
			if (TagValidator.getInstance().validate(tag))
			{
			    tempContact.tags.add(tag);
			}
			else
			{
			    canSave = false;
			    isInvalid = true;
			    break;
			}

		    }
		    if (isInvalid)
		    {
			tagInvalid++;
			failedCompanies.add(new FailedContactBean(getDummyContact(properties, csvValues) , "Invalid tag added"));
			break;
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
		    companyName = field.value = csvValues[j].trim();
		    // added company in new field in lower case
		    tempContact.properties.add(new ContactField("company", companyName, null));
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
			failedCompanies.add(new FailedContactBean(getDummyContact(properties, csvValues) , "Company is merged"));
		    tempContact = ContactUtil.mergeCompanyFields(tempContact);
		    isMerged = true;
		}
		else
		{
			 ++billingRestriction.contacts_count;

			    if (limitCrossed)
			    {
				++limitExceeded;
				failedCompanies.add(new FailedContactBean(getDummyContact(properties, csvValues) , "Error! limit is exceeded"));
				continue;
			    }

			    if (billingRestriction.contacts_count >= allowedContacts)
			    {
				limitCrossed = true;
			    }
		}
		/*else if (!ContactUtil.isValidName(companyName)){
			failedCompanies.add(new FailedContactBean(getDummyContact(properties, csvValues) , "Invalid Company Name"));
			invalidName = false;
		}*/
	    }
	    else
	    {
		++nameMissing;
		failedCompanies.add(new FailedContactBean(getDummyContact(properties, csvValues) , "Company name is missing"));
		continue;
	    }
	   /* if (!invalidName)
	    {
	    	failedCompany++;
	    	continue;
	    }*/
	    if (!canSave)
	    {
		continue;
	    }

	    /**
	     * If it is new contacts billingRestriction count is increased and
	     * checked with plan limits
	     */

	    try
	    {
		tempContact.save();
	    }
	    catch (Exception e)
	    {
		System.out.println("exception raised while saving company");
		e.printStackTrace();
		if (tempContact.id != null)
		{
		    failedCompanies.add(new FailedContactBean(getDummyContact(properties, csvValues),
			    "Error! Exception raise while saving company"));
		}
		failedCompany++;
		continue;
	    }

	    if (isMerged)
	    {
		mergedCompany++;
	    }
	    else
	    {
		savedCompany++;
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
	if (tagInvalid > 0)
	{
	    buildCSVImportStatus(status, ImportStatus.INVALID_TAG, tagInvalid);
	}

	if (limitExceeded > 0)
	{
	    buildCSVImportStatus(status, ImportStatus.LIMIT_REACHED, limitExceeded);
	}
	if (accessDeniedToUpdate > 0)
	{
	    buildCSVImportStatus(status, ImportStatus.ACCESS_DENIED, accessDeniedToUpdate);
	}
	if (failedCompany > 0 || nameMissing > 0 || accessDeniedToUpdate > 0 || limitExceeded > 0 || tagInvalid > 0)
	{
	    buildCSVImportStatus(status, ImportStatus.TOTAL_FAILED, failedCompany + nameMissing + accessDeniedToUpdate
		    + limitExceeded + tagInvalid);
	}

	// avoid message of attached failed csv file add new property in map so
	// we can check if there is some company get failed we dont need that
	// message like find failed attached csv file for company
	// TODO: jitendra implement unsucessfull csv for company import

	// calculateTotalFailedContacts(status);

	// Sends notification on CSV import completion
	dBbillingRestriction.send_warning_message();

	/*SendMail.sendMail(domainUser.email, "CSV Companies Import Status", SendMail.CSV_IMPORT_NOTIFICATION,
		new Object[] { domainUser, status });*/
	buildFailedCompanies(domainUser, failedCompanies, headings, status);

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
	    failed.add(new FailedContactBean(getDummyContact(properties, csvValues), "Error! Name field can't be blank"));
	    return false;
	}
	if (StringUtils.isBlank(contact.getContactFieldValue(Contact.EMAIL)))
	{
	    buildCSVImportStatus(statusMap, ImportStatus.EMAIL_REQUIRED, 1);
	    failed.add(new FailedContactBean(getDummyContact(properties, csvValues), "Error! Email field can't be blank"));
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
	Integer mergedDeals = 0;

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
	String[] dealHeader =  deals.remove(0);

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
	    Set<Long> noteId = new TreeSet<>();
	    String[] dealPropValues = it.next();
	    String mileStoneValue = null;
	    boolean trackFound = false;
	    boolean milestoneFound = false;
	    boolean wrongMilestone = false;
	    ArrayList<CustomFieldData> customFields = new ArrayList<CustomFieldData>();
	    List<Milestone> list = null;
	    List<Category> source_list = null;
	    List<Category> reason_list = null;
	    Set<String> relatedContactIds = new HashSet<String>();
	    for (int i = 0; i < dealPropValues.length; i++)
	    {

		LinkedHashMap<String, String> prop = (LinkedHashMap<String, String>) schema.get(i);

		if (prop.size() > 0)
		{

		    String type = (String) prop.get("type");
		    String value = prop.get("value");
		    if (type.equalsIgnoreCase("SYSTEM"))
		    {
		    if(value != null && value.equalsIgnoreCase("id") && StringUtils.isNotEmpty(dealPropValues[i]))
		    {
		    	Long opportunityId = null;
		    	try 
		    	{
		    		opportunityId = Long.valueOf(dealPropValues[i].substring(3));
				}
		    	catch (Exception e) 
		    	{
					System.out.println("Exception while converting id in deals import.");
				}
		    	
		    	if(opportunityId != null)
		    	{
		    		opportunity = OpportunityUtil.getOpportunity(opportunityId);
		    	}
	    		if(opportunity != null)
	    		{
	    			List<String> conIdsList = opportunity.getContact_ids();
	    			System.out.println("conIdsList in deals import-----------"+conIdsList);
	    			if(conIdsList != null && conIdsList.size() > 0)
	    			{
	    				relatedContactIds.addAll(conIdsList);
	    				opportunity.setContact_ids(new ArrayList<String>());
	    			}
	    		}
	    		if(opportunity == null)
	    		{
	    			opportunity = new Opportunity();
	    		}
		    	
		    }
		    else if (value.equalsIgnoreCase("name"))
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
			    if(!trackFound){
			    	try {
						String trkName = null ;
						innerForloop :
						for(int m = i+1;m < dealPropValues.length ;m++)
						{
							LinkedHashMap<String, String> pr = (LinkedHashMap<String, String>) schema.get(m);
							if(!pr.equals(null) && pr.size() > 0)
							{
								String tName = pr.get("value"); String tType = pr.get("type");
								if(tType != null && tName != null && tType.equals("SYSTEM") && tName.equalsIgnoreCase("track"))
								{
									trkName = dealPropValues[m];
								    trackFound = true;
								    list = MilestoneUtil.getMilestonesList(trkName);
								    opportunity.track = trkName;
								    break innerForloop;
								}
							}
						}
					} catch (Exception e) {
						System.out.println("track missinc catch");
						e.printStackTrace();
					}			    	
			    }
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
					System.out.println("Inside try block---Imported deal value---"+val);
				    Double dealValue = Double.parseDouble(parse(val));
				    System.out.println("Inside try block---Imported deal value after conversion---"+dealValue);
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
					System.out.println("Exception occured while setting deal value in import");
				    e.printStackTrace();
				}
			    }
			}
			else if (value.equalsIgnoreCase("closeDate"))
			{
			    String dealDate = dealPropValues[i];
			    if (dealDate != null && !dealDate.isEmpty())
			    {
				// date is mm/dd/yyyy format
				String[] data = dealDate.split("/");
				if (data.length == 3)
				{
				    try
				    {
					Calendar c = Calendar.getInstance();
					int year = Integer.parseInt(data[2].trim());
					int month = Integer.parseInt(data[0].trim());
					int day = Integer.parseInt(data[1].trim());
					if (month > 0)
					{
					    month = month - 1;
					}
					c.set(year, month, day);
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
						System.out.println("Related contact email in deals import----"+emails[k]);
					    Contact contact = ContactUtil.searchContactByEmail(emails[k]);
					    if (contact != null && contact.id != null && !relatedContactIds.contains(contact.id.toString()))
					    {
					    System.out.println("Related contct id in deals import-----"+contact.id);
					    System.out.println("Contains Id------"+relatedContactIds.contains(contact.id.toString()));
						opportunity.addContactIds(contact.id.toString());
						relatedContactIds.add(contact.id.toString());
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
				try{
					  Note note = new Note();
					    note.subject = dealHeader[i];
					    note.description = dealPropValues[i];
					    note.save();
					    noteId.add(note.id);
				}catch(Exception e){
					System.out.println("note not saved for header while saving deals from import" + dealHeader[i]);
				}
			}
			else if(value.equalsIgnoreCase("dealSource"))
			{
				    String sourceName = dealPropValues[i];
				    //trackFound = true;
				    CategoriesUtil source= new CategoriesUtil();
				    source_list = source.getCategoryByName(sourceName);
				    if (source_list.size() > 0)
				   
				    {
				    	for(Category cat:source_list){
				    		opportunity.deal_source_id=cat.getId();
				    	}
					
				    }

			}
			else if(value.equalsIgnoreCase("lossReason"))
			{
				    String lossReason = dealPropValues[i];
				    //trackFound = true;
				    CategoriesUtil reason= new CategoriesUtil();
				    reason_list = reason.getCategoryByName(lossReason);
				    if (reason_list.size() > 0)
				    {
				    	for(Category cat:reason_list){
				    		opportunity.lost_reason_id=cat.getId();
				    	}
					
				    }

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

	    //setting related notes in deals if any is present 
	    
	    if(noteId != null && noteId.size() > 0){
	    	if(opportunity.id != null && StringUtils.isNotEmpty(opportunity.id.toString()))
	    	{
	    		List<String> oldDealNoteIds = opportunity.getNote_ids();
	    		if(oldDealNoteIds != null)
	    		{
	    			for(String str : oldDealNoteIds)
	    			{
	    				if(StringUtils.isNotEmpty(str))
	    				{
	    					noteId.add(Long.valueOf(str));
	    				}
	    			}
	    		}
	    	}
	    	opportunity.setRelatedNotes(noteId);
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
	    
	    //Remove Lost Reason if milestone is not lost
	    
		String lostMilestone = "Lost";
		try
		{
			if(opportunity.pipeline_id!=0){
				 Milestone mile = MilestoneUtil.getMilestone(opportunity.pipeline_id);
				    if (mile.lost_milestone != null)
					lostMilestone = mile.lost_milestone;
			}
		   

		}
		catch (Exception e)
		{
		    e.printStackTrace();
		}
	    if(opportunity.milestone!=null && !opportunity.milestone.equalsIgnoreCase(lostMilestone))
	    {
	    	opportunity.lost_reason_id=null;
	    }
	    // add all custom field in deals
	    opportunity.custom_data = customFields;
	    try
	    {
    	if (opportunity.id != null && !StringUtils.isEmpty(opportunity.id.toString()) && !StringUtils.isEmpty(opportunity.name) && opportunity.pipeline_id != null
    			&& opportunity.milestone != null && !wrongMilestone)
		{
		    opportunity.save();
		    mergedDeals++;
		}
    	else if (!StringUtils.isEmpty(opportunity.name) && opportunity.pipeline_id != null
			&& opportunity.milestone != null && !wrongMilestone)
		{
		    opportunity.save();
		    savedDeals++;
		    try
			{
			    ActivitySave.createDealAddActivity(opportunity);
			}
			catch (JSONException e)
			{
			    // TODO Auto-generated catch block
			    e.printStackTrace();
			}
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
		System.out.println("StackTrace_of_deal_import"+ExceptionUtils.getFullStackTrace(e));
		failedDeals++;
	    }
	}

	buildDealsImportStatus(status, "SAVED", savedDeals);
	buildDealsImportStatus(status, "FAILED", totalDeals - (savedDeals + mergedDeals));
	buildDealsImportStatus(status, "TOTAL", totalDeals);
	buildDealsImportStatus(status, "MERGED", mergedDeals);
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

	// Get user prefs language
	String language = LanguageUtil.getUserLanguageFromDomainUser(domainUser);
	
	SendMail.sendMail(domainUser.email, "CSV Deals Import Status", "csv_deal_import", new Object[] { domainUser,
		status }, language);

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
	    Map<Object, Object> status,Map<Object, Object> stats)
    {
	String path = null;
	try
	{
	    System.out.println("Export functionality email" + failedContacts);
	    if (failedContacts == null || failedContacts.size() == 0)
	    {
		System.out.println("no failed conditions");
		// Send every partition as separate email
		sendFailedContactImportFile(domainUser, null, 0, status,stats);
		return;
	    }

	    System.out.println("writing file service");

	    // Builds Contact CSV
	    writeFailedContactsInCSV(getCSVWriterForFailedContacts(), failedContacts, headings);

	    System.out.println("wrote files to CSV");
	    byte[] data=null;
	    
	    try{

	    service.getOutputchannel().close();

	    System.out.println("closing stream");

	    
	    data = service.getDataFromFile();

	    System.out.println("byte data");

	    System.out.println(data.length);
	    }
	    catch(Exception e)
	    {
	    	e.printStackTrace();
	    }
	    System.out.println(domainUser.email);
	    
	    if(data==null)
	    {
	    	sendFailedContactImportFile(domainUser, "", failedContacts.size(), status,stats);
	    }
	    // Send every partition as separate email
	    else
	    sendFailedContactImportFile(domainUser, new String(data, "UTF-8"), failedContacts.size(), status,stats);

	    service.deleteFile();

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

    }
    
    private void buildFailedCompanies(DomainUser domainUser, List<FailedContactBean> failedCompanies, String[] headings,
    	    Map<Object, Object> status)
        {
    	String path = null;
    	try
    	{
    	    System.out.println("Export functionality email" + failedCompanies);
    	    if (failedCompanies == null || failedCompanies.size() == 0)
    	    {
    		System.out.println("no failed conditions");
    		// Send every partition as separate email
    		sendFailedCompaniesImportFile(domainUser, null, 0, status);
    		return;
    	    }

    	    System.out.println("writing file service");

    	    // Builds Contact CSV
    	    writeFailedContactsInCSV(getCSVWriterForFailedContacts(), failedCompanies, headings);

    	    System.out.println("wrote files to CSV");
    	    byte[] data=null;
    	    
    	    try{

    	    service.getOutputchannel().close();

    	    System.out.println("closing stream");

    	    
    	    data = service.getDataFromFile();

    	    System.out.println("byte data");

    	    System.out.println(data.length);
    	    }
    	    catch(Exception e)
    	    {
    	    	e.printStackTrace();
    	    }
    	    System.out.println(domainUser.email);
    	    
    	    if(data==null)
    	    {
    	    	sendFailedCompaniesImportFile(domainUser, "", failedCompanies.size(), status);
    	    }
    	    // Send every partition as separate email
    	    else
    	    	sendFailedCompaniesImportFile(domainUser, new String(data, "UTF-8"), failedCompanies.size(), status);

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
	    Map<Object, Object> status,Map<Object, Object> stats)
    {

    // Get user prefs language
    String language = LanguageUtil.getUserLanguageFromDomainUser(domainUser);
    	
	/*
	 * HashMap<String, String> map = new HashMap<String, String>();
	 * map.put("count", totalRecords);
	 */
    	Long time = System.currentTimeMillis();
    	stats.put("end_time", dateTimeFormat.format(time));
    	String domain = domainUser.domain;
		domainUser.domain = AliasDomainUtil.getCachedAliasDomainName(domain);
	if (totalRecords >= 1)
	{
	    String[] strArr = { "text/csv", "Import_Contacts_Remarks.csv", csvData };
	    SendMail.sendMail(domainUser.email, "CSV Contacts Import Status", SendMail.CSV_IMPORT_NOTIFICATION,
		    new Object[] { domainUser, status }, SendMail.AGILE_FROM_EMAIL, SendMail.AGILE_FROM_NAME, language, strArr);
	}
	else
	{
	    SendMail.sendMail(domainUser.email, "CSV Contacts Import Status", SendMail.CSV_IMPORT_NOTIFICATION,
		    new Object[] { domainUser, status }, language);
	}
	domainUser.domain = domain;
	SendMail.sendMail("nidhi@agilecrm.com", "CSV Contacts Import Status"+domainUser.domain, SendMail.CSV_IMPORT_STATS_NOTIFICATION,
		    new Object[] { stats}, language);

    }
  //send failed companies import file  
    public void sendFailedCompaniesImportFile(DomainUser domainUser, String csvData, int totalRecords,
    	    Map<Object, Object> status)
        {

    	/*
    	 * HashMap<String, String> map = new HashMap<String, String>();
    	 * map.put("count", totalRecords);
    	 */
    	String tempDomain = domainUser.domain;
		domainUser.domain = AliasDomainUtil.getCachedAliasDomainName(domainUser.domain);
    	
    	// Get user prefs language
    	String language = LanguageUtil.getUserLanguageFromDomainUser(domainUser);

    	if (totalRecords >= 1)
    	{
    	    String[] strArr = { "text/csv", "Import_Companies_Remarks.csv", csvData };
    	    SendMail.sendMail(domainUser.email, "CSV Companies Import Status", SendMail.CSV_IMPORT_NOTIFICATION,
    		    new Object[] { domainUser, status }, SendMail.AGILE_FROM_EMAIL, SendMail.AGILE_FROM_NAME, language, strArr);
    	}
    	else
    	{
    	    SendMail.sendMail(domainUser.email, "CSV Companies Import Status", SendMail.CSV_IMPORT_NOTIFICATION,
    		    new Object[] { domainUser, status }, language);
    	}
    	domainUser.domain = tempDomain;

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
    	try{
	if (failedContactsWriter != null)
	    return failedContactsWriter;

	System.out.println("building failed contacts service");
	return failedContactsWriter = new CSVWriter(service.getOutputWriter());
    	}
    	catch(Exception e)
    	{
    		e.printStackTrace();
    		return failedContactsWriter;
    	}
    }
    
    public void createLeadsFromCSV(InputStream blobStream, Contact contact, String ownerId) throws PlanRestrictedException, IOException
    {
    	// Creates domain user key, which is set as a contact owner
    	this.ownerKey = new Key<DomainUser>(DomainUser.class, Long.parseLong(ownerId));

    	domainUser = DomainUserUtil.getDomainUser(ownerKey.getId());

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
    	reportStatus(csvData.size());

    	if (csvData.isEmpty())
    	    return;
    	// extract csv heading from csv file
    	String[] headings = csvData.remove(0);

    	contact.type = Contact.Type.LEAD;

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
    	int sourceMismatched = 0;
    	int statusMismatched = 0;
    	int convertedContacts = 0;
    	Map<Object, Object> status = new HashMap<Object, Object>();
    	status.put("type", "Leads");

    	List<CustomFieldDef> customFields = CustomFieldDefUtil.getCustomFieldsByScopeAndType(SCOPE.CONTACT, "DATE");
    	List<CustomFieldDef> imagefield = CustomFieldDefUtil.getCustomFieldsByScopeAndType(SCOPE.CONTACT, "text");
    	
    	CategoriesUtil categoriesUtil = new CategoriesUtil();
    	List<Category> leadSourceList = categoriesUtil.getCategoriesByType(Category.EntityType.LEAD_SOURCE.toString());
    	List<Category> leadStatusList = categoriesUtil.getCategoriesByType(Category.EntityType.LEAD_STATUS.toString());
    	
    	Map<String, Long> leadSources = new HashMap<String, Long>();
    	Map<String, Long> leadStatuses = new HashMap<String, Long>();
    	
    	for(Category category : leadSourceList)
    	{
    		leadSources.put(StringUtils.lowerCase(category.getLabel()), category.getId());
    	}
    	
    	for(Category category : leadStatusList)
    	{
    		leadStatuses.put(StringUtils.lowerCase(category.getLabel()), category.getId());
    	}

    	/**
    	 * Processed contacts count.
    	 */
    	int processedContacts = 0;
    	int resettedProcessedcontacts = 0;
    	/**
    	 * Iterates through all the records from blob
    	 */
    	for (String[] csvValues : csvData)
    	{
    	    processedContacts++;
    	    resettedProcessedcontacts++;
    	    if (resettedProcessedcontacts >= 1000)
    	    {
    		try
    		{
    		    resettedProcessedcontacts = 0;
    		    importStatusDAO.updateStatus(processedContacts);
    		}
    		catch (Exception e)
    		{
    		    e.printStackTrace();
    		}

    	    }

    	    // Set to hold the notes column positions so they can be created
    	    // after a contact is created.
    	    Set<Integer> notes_positions = new TreeSet<Integer>();
    	    Contact tempContact = new Contact();

    	    boolean isMerged = false;
    	    boolean is_source_added = false;
    	    boolean is_status_added = false;
    	    boolean is_source_mismatch = false;
    	    boolean is_status_mismatch = false;
    	    boolean is_lead_converted = false;
    	    try
    	    {
    		// create dummy contact

    		// Cloning so that wrong tags don't get to some contact if
    		// previous
    		// contact is merged with exiting contact
    		tempContact.tags = (LinkedHashSet<String>) contact.tags.clone();
    		tempContact.setContactOwner(ownerKey);
    		tempContact.type = Type.LEAD;

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
    			    tag = tag.trim();
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
    				
    				CountryUtil.setCountryCode(addressJSON, field, csvValues[j]);
    				
    				addressField.value = addressJSON.toString();
    			    }
    			    else
    			    {
    			    CountryUtil.setCountryCode(addressJSON, field, csvValues[j]);
    			    
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
    		    
    		    if ("lead_source".equals(field.name))
    		    {
    		    is_source_added = true;
    		    //If no lead source, set Other as source
		    	if(StringUtils.isEmpty(csvValues[j]))
				{
		    		tempContact.setLead_source_id(leadSources.get("other"));
				}
		    	else
		    	{
		    		Long source_id = leadSources.get(StringUtils.lowerCase(csvValues[j]));
		    		if(source_id != null && source_id > 0)
		    		{
		    			tempContact.setLead_source_id(source_id);
		    		}
		    		else
		    		{
		    			is_source_mismatch = true;
		    		}
		    		continue;
		    	}
    		    }
    		    
    		    if ("lead_status".equals(field.name))
    		    {
    		    is_status_added = true;
    		    //If no lead status, set New as status
		    	if(StringUtils.isEmpty(csvValues[j]))
				{
		    		tempContact.setLead_status_id(leadStatuses.get("new"));
				}
		    	else
		    	{
		    		Long status_id = leadStatuses.get(StringUtils.lowerCase(csvValues[j]));
		    		if(status_id != null && status_id > 0)
		    		{
		    			tempContact.setLead_status_id(status_id);
		    			if("converted".equalsIgnoreCase(csvValues[j]))
		    			{
		    				is_lead_converted = true;
		    				tempContact.type = Type.PERSON;
		    				tempContact.setIs_lead_converted(is_lead_converted);
		    			}
		    		}
		    		else
		    		{
		    			is_status_mismatch = true;
		    		}
		    		continue;
		    	}
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
    		    	String companyName = csvValues[j].trim();
    			tempContact.properties.add(new ContactField(Contact.COMPANY, companyName,
    				null));
    		    }

    		    tempContact.properties.add(field);
    		    tempContact.source = "import" ;
    		    System.out.println("temp contact source is "+tempContact.source);

    		}// end of inner for loop

    		// Contact dummy = getDummyContact(properties, csvValues);

    		if (!isValidFields(tempContact, status, failedContacts, properties, csvValues))

    		    continue;

    		// If lead is duplicate with existed contact, it will not save.
    		if (ContactUtil.isDuplicateContact(tempContact))
    		{
    			failedContacts.add(new FailedContactBean(getDummyContact(properties, csvValues), "Duplicate Contact existed with same email."));
    			continue;
    		}
    		// If lead is duplicate, it fetches old lead and updates
    		// data.
    		if (ContactUtil.isDuplicateLead(tempContact))
    		{
    		    // Checks if user can update the contact

    		    // Sets current object to check scope

    		    tempContact = ContactUtil.mergeLeadFields(tempContact);
    		    accessControl.setObject(tempContact);
    		    if (!accessControl.canCreate())
    		    {
    			accessDeniedToUpdate++;
    			failedContacts.add(new FailedContactBean(getDummyContact(properties, csvValues),
    				"Access denied to update lead"));

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
    		    System.out.println("Leads limit - Allowed : "
    			    + billingRestriction.getCurrentLimits().getContactLimit() + " current leads count : "
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
    		if(is_source_mismatch && is_status_mismatch)
    		{
    			sourceMismatched++;
    			statusMismatched++;
    			failedContacts.add(new FailedContactBean(getDummyContact(properties, csvValues),
        				"source and status mismatched"));
    			continue;
    		}
    		else if(is_source_mismatch)
    		{
    			sourceMismatched++;
    			failedContacts.add(new FailedContactBean(getDummyContact(properties, csvValues),
        				"source mismatched"));
    			continue;
    		}
    		else if(is_status_mismatch)
    		{
    			statusMismatched++;
    			failedContacts.add(new FailedContactBean(getDummyContact(properties, csvValues),
        				"status mismatched"));
    			continue;
    		}
    		
    		//If no source added, set Other as source
    		if(!is_source_added)
    		{
    			tempContact.setLead_source_id(leadSources.get("other"));
    		}
    		//If no status added, set New as status
    		if(!is_status_added)
    		{
    			tempContact.setLead_status_id(leadStatuses.get("new"));
    		}
    		tempContact.save(false);
    	    }// end of try
    	    catch (InvalidTagException e)
    	    {

    		System.out.println("Invalid tag exception raised while saving lead ");
    		e.printStackTrace();
    		failedContacts.add(new FailedContactBean(getDummyContact(properties, csvValues), e.getMessage()));
    		continue;
    	    }
    	    catch (AccessDeniedException e)
    	    {

    		accessDeniedToUpdate++;
    		System.out.println("ACL exception raised while saving lead ");
    		e.printStackTrace();
    		failedContacts.add(new FailedContactBean(getDummyContact(properties, csvValues), e.getMessage()));

    	    }
    	    catch (Exception e)
    	    {

    		System.out.println("exception raised while saving lead ");
    		e.printStackTrace();
    		if (tempContact.id != null)
    		{
    		    failedContacts.add(new FailedContactBean(getDummyContact(properties, csvValues),
    			    "Exception raise while saving lead"));
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
    	    
    	    if(is_lead_converted)
    	    {
    	    convertedContacts++;
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
    		System.out.println("exception while saving leads");
    		e.printStackTrace();
    	    }

    	    processedContacts++;

    	}// end of for loop

    	try
    	{
    	    importStatusDAO.deleteStatus();
    	}
    	catch (Exception e)
    	{
    	    e.printStackTrace();
    	}

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
    	if (convertedContacts > 0)
    	{
    	    buildCSVImportStatus(status, ImportStatus.CONVERTED_CONTACTS, convertedContacts);
    	}
    	if (limitExceeded > 0)
    	{
    	    buildCSVImportStatus(status, ImportStatus.LIMIT_REACHED, limitExceeded);
    	}
    	if (accessDeniedToUpdate > 0)
    	{
    	    buildCSVImportStatus(status, ImportStatus.ACCESS_DENIED, accessDeniedToUpdate);
    	}
    	if (statusMismatched > 0)
    	{
    	    buildCSVImportStatus(status, ImportStatus.STATUS_MISMATCHED, statusMismatched);
    	}
    	if (sourceMismatched > 0)
    	{
    	    buildCSVImportStatus(status, ImportStatus.SOURCE_MISMATCHED, sourceMismatched);
    	}
    	buildCSVImportStatus(status, ImportStatus.FAILEDCSV, 1);

    	// Sends notification on CSV import completion
    	dBbillingRestriction.send_warning_message();

    	// Send notification after contacts save complete
    	BulkActionNotifications.publishconfirmation(BulkAction.LEADS_CSV_IMPORT, String.valueOf(savedContacts));
    	// create failed contact csv

    	buildFailedLeads(domainUser, failedContacts, headings, status);
    	if (savedContacts != 0 || mergedContacts != 0)
    	    ActivityUtil.createLogForImport(ActivityType.LEAD_IMPORT, EntityType.CONTACT, savedContacts,
    		    mergedContacts);
    }
    
    /**
     * build failed lead csv file
     * 
     * @param contact
     */
    private void buildFailedLeads(DomainUser domainUser, List<FailedContactBean> failedContacts, String[] headings,
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
		sendFailedLeadImportFile(domainUser, null, 0, status);
		return;
	    }

	    System.out.println("writing file service");

	    // Builds Contact CSV
	    writeFailedContactsInCSV(getCSVWriterForFailedContacts(), failedContacts, headings);

	    System.out.println("wrote files to CSV");
	    byte[] data=null;
	    
	    try{

	    service.getOutputchannel().close();

	    System.out.println("closing stream");

	    
	    data = service.getDataFromFile();

	    System.out.println("byte data");

	    System.out.println(data.length);
	    }
	    catch(Exception e)
	    {
	    	e.printStackTrace();
	    }
	    System.out.println(domainUser.email);
	    
	    if(data==null)
	    {
	    	sendFailedLeadImportFile(domainUser, "", failedContacts.size(), status);
	    }
	    // Send every partition as separate email
	    else
	    sendFailedLeadImportFile(domainUser, new String(data, "UTF-8"), failedContacts.size(), status);

	    service.deleteFile();

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

    }
    
    /**
     * helper function for send mail of import leads status with failed
     * lead csv attachment if failed leads are found then it will send
     * with failed contact csv file other wise send normal status mail
     * 
     */
    public void sendFailedLeadImportFile(DomainUser domainUser, String csvData, int totalRecords,
	    Map<Object, Object> status)
    {
    // Get user prefs language
    String language = LanguageUtil.getUserLanguageFromDomainUser(domainUser);
	if (totalRecords >= 1)
	{
	    String[] strArr = { "text/csv", "FailedLeads.csv", csvData };
	    SendMail.sendMail(domainUser.email, "CSV Leads Import Status", SendMail.CSV_IMPORT_NOTIFICATION,
		    new Object[] { domainUser, status }, SendMail.AGILE_FROM_EMAIL, SendMail.AGILE_FROM_NAME, language, strArr);
	}
	else
	{
	    SendMail.sendMail(domainUser.email, "CSV Leads Import Status", SendMail.CSV_IMPORT_NOTIFICATION,
		    new Object[] { domainUser, status }, language);
	}

    }
}