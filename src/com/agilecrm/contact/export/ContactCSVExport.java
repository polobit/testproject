package com.agilecrm.contact.export;

import java.nio.channels.Channels;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import au.com.bytecode.opencsv.CSVWriter;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.CustomFieldDef;
import com.agilecrm.contact.util.CustomFieldDefUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.files.AppEngineFile;
import com.google.appengine.api.files.FileService;
import com.google.appengine.api.files.FileServiceFactory;
import com.google.appengine.api.files.FileWriteChannel;
import com.thirdparty.Mandrill;

/**
 * <code>ContactCSVExport</code> handles building CSV file for obtained
 * contacts. Constructs CSV file using opencsv CSVWriter and save it Google app
 * engine BlobStore. Sends CSV file as an attachment to current domain user
 * email.
 * 
 * @author Naresh
 * 
 */
public class ContactCSVExport
{

    /** CSV Headers **/
    public static final String FIRST_NAME = "First Name";
    public static final String LAST_NAME = "Last Name";
    public static final String TITLE = "Title";
    public static final String COMPANY = "Company";

    public static final String PHONE_WORK = "Phone(Work)";
    public static final String PHONE_HOME = "Phone(Home)";
    public static final String PHONE_MOBILE = "Phone(Mobile)";
    public static final String PHONE_MAIN = "Phone(Main)";
    public static final String PHONE_HOME_FAX = "Phone(Home fax)";
    public static final String PHONE_WORK_FAX = "Phone(Work fax)";
    public static final String PHONE_OTHER = "Phone(Other)";

    public static final String EMAIL_HOME = "Email(Home)";
    public static final String EMAIL_WORK = "Email(Work)";

    public static final String WEBSITE = "Website";
    public static final String SKYPE = "Skype";
    public static final String TWITTER = "Twitter";
    public static final String LINKEDIN = "LinkedIn";
    public static final String FACEBOOK = "Facebook";
    public static final String XING = "Xing";
    public static final String BLOG = "Blog";
    public static final String GOOGLE_PLUS = "Google+";
    public static final String FLICKR = "Flickr";
    public static final String GITHUB = "Github";
    public static final String YOUTUBE = "Youtube";

    public static final String ADDRESS = "Address";
    public static final String CITY = "City";
    public static final String STATE = "State";
    public static final String COUNTRY = "Country";
    public static final String ZIP = "Zip Code";

    /**
     * Constructs contact csv and write to blobstore. Returns blob file path to
     * fetch blob later through BlobStore API. There are two cases to handle
     * file writing to blobstore:
     * <p>
     * When there is no filter (i.e., isNoFilter is false), all contacts are
     * obtained at a time. So after writing to CSV completed, writeChannel is
     * closed immediately.
     * </p>
     * <p>
     * If there is a filter, 500 contacts are obtained each time. So
     * writeChannel shouldn't be closed immediately.
     * </p>
     * 
     * @param contacts
     *            - List of Contacts.
     * @param isNoFilter
     *            - Flag to identify whether filter is given or not.
     * @return String
     */
    public static String writeContactCSVToBlobstore(List<Contact> contacts, Boolean isNoFilter)
    {
	String path = null;
	try
	{
	    // Get a file service
	    FileService fileService = FileServiceFactory.getFileService();

	    // Create a new Blob file with mime-type "text/csv"
	    AppEngineFile file = fileService.createNewBlobFile("text/csv", "Contacts.csv");

	    // Open a channel to write to it
	    boolean lock = false;
	    FileWriteChannel writeChannel = fileService.openWriteChannel(file, lock);

	    // Builds Contact CSV
	    writeContactCSV(writeChannel, contacts, true);

	    // Blob file Path
	    path = file.getFullPath();

	    // All contacts are obtained at a time.
	    if (isNoFilter == true)
	    {
		lock = true;
		writeChannel = fileService.openWriteChannel(file, lock);

		// Now finalize
		writeChannel.closeFinally();

	    }

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return path;
    }

    /**
     * Appends content to existing blob file.
     * 
     * @param path
     *            - blob file path
     * @param contacts
     *            - contact list to convert to csv
     * @param isCompleted
     *            - flag to identity whether all contacts completed or not
     */
    public static void editExistingBlobFile(String path, List<Contact> contacts, Boolean isCompleted)
    {
	try
	{
	    // Get a file service
	    FileService fileService = FileServiceFactory.getFileService();
	    AppEngineFile file = new AppEngineFile(path);

	    FileWriteChannel writeChannel = null;
	    boolean lock = false;

	    // if contacts list not completed, write to channel without closing
	    if (!isCompleted)
	    {
		// Open a channel to write to it
		writeChannel = fileService.openWriteChannel(file, lock);

		writeContactCSV(writeChannel, contacts, false);
		return;

	    }

	    // Close channel completely when contacts list completed
	    lock = true;
	    writeChannel = fileService.openWriteChannel(file, lock);
	    writeChannel.closeFinally();

	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in editExistingBlobFile " + e.getMessage());
	}
    }

    /**
     * Builds contacts csv and write to blob file.
     * 
     * @param writeChannel
     * @param contactList
     * @param isFirstTime
     */
    public static void writeContactCSV(FileWriteChannel writeChannel, List<Contact> contactList, Boolean isFirstTime)
    {
	try
	{
	    CSVWriter writer = new CSVWriter(Channels.newWriter(writeChannel, "UTF8"));

	    String[] headers = getCSVHeadersForContact();

	    if (isFirstTime)
		writer.writeNext(headers);

	    Map<String, Integer> indexMap = getIndexMapOfCSVHeaders(headers);

	    for (Contact contact : contactList)
	    {
		List<ContactField> properties = contact.getProperties();
		String str[] = insertContactProperties(properties, indexMap, headers.length);
		writer.writeNext(str);
	    }

	    // Close without finalizing
	    writer.close();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Returns array of CSV Headers. Appends custom fields labels as CSV Headers
     * to array.
     * 
     * @return String[]
     */
    public static String[] getCSVHeadersForContact()
    {
	String[] headers = { FIRST_NAME, LAST_NAME, TITLE, COMPANY, EMAIL_HOME, EMAIL_WORK, PHONE_WORK, PHONE_HOME, PHONE_MOBILE, PHONE_MAIN, PHONE_HOME_FAX,
		PHONE_WORK_FAX, PHONE_OTHER, ADDRESS, CITY, STATE, COUNTRY, ZIP, WEBSITE, SKYPE, TWITTER, LINKEDIN, FACEBOOK, XING, BLOG, GOOGLE_PLUS, FLICKR,
		GITHUB, YOUTUBE };

	return appendCustomFieldsToHeaders(headers);
    }

    /**
     * Appends Custom fields to CSV Headers string array. If Exception occurs it
     * simply returns headers without appending custom fields.
     * 
     * @param headers
     *            - string array of headers.
     * @return String[]
     */
    private static String[] appendCustomFieldsToHeaders(String[] headers)
    {
	// Can't append elements directly in java, so convert to ArrayList
	List<String> headersList = new ArrayList<String>(Arrays.asList(headers));

	try
	{
	    // List of custom fields
	    List<CustomFieldDef> customFields = CustomFieldDefUtil.getAllCustomFields();

	    // Appends custom field labels to list
	    for (CustomFieldDef customField : customFields)
		headersList.add(customField.field_label);

	    // Converts ArrayList to String array before return
	    return headersList.toArray(new String[headersList.size()]);
	}
	catch (Exception e)
	{
	    System.err.println("Exception occurend in appendCustomFieldsToHeaders " + e.getMessage());
	    return headers;
	}

    }

    /**
     * Returns map with header names as keys and their array indexes as values.
     * It helps to add elements to array on the same index of header name
     * without worrying about their index in an array.
     * 
     * @param headers
     * @return
     */
    public static Map<String, Integer> getIndexMapOfCSVHeaders(String[] headers)
    {
	Map<String, Integer> indexMap = new HashMap<String, Integer>();

	// Map with header name as key and their index as value
	for (int i = 0; i < headers.length; i++)
	    indexMap.put(headers[i], i);

	return indexMap;
    }

    /**
     * Inserts contact properties into CSV w.r.t header name.
     * 
     * @param properties
     *            - List of Contact Properties
     * @param indexMap
     *            - indexMap to insert property under respected header name.
     * @param headers
     *            - CSV headers to build array with headers array length.
     * @return String[]
     */
    public static String[] insertContactProperties(List<ContactField> properties, Map<String, Integer> indexMap, int headersLength)
    {
	// Initialize new array to insert as new row.
	String str[] = new String[headersLength];

	for (ContactField field : properties)
	{
	    if (field.name.equals(Contact.FIRST_NAME))
		str[indexMap.get(FIRST_NAME)] = field.value;

	    if (field.name.equals(Contact.LAST_NAME))
		str[indexMap.get(LAST_NAME)] = field.value;

	    if (field.name.equals(Contact.TITLE))
		str[indexMap.get(TITLE)] = field.value;

	    if (field.name.equals(Contact.COMPANY))
		str[indexMap.get(COMPANY)] = field.value;

	    if (field.name.equals(Contact.EMAIL))
	    {
		if (field.subtype.equals("home"))
		    str[indexMap.get(EMAIL_HOME)] = field.value;

		if (field.subtype.equals("work"))
		    str[indexMap.get(EMAIL_WORK)] = field.value;
	    }

	    if (field.name.equals(Contact.PHONE))
	    {
		if (field.subtype.equals("work"))
		{
		    str[indexMap.get(PHONE_WORK)] = field.value;
		}
		if (field.subtype.equals("home"))
		{
		    str[indexMap.get(PHONE_HOME)] = field.value;
		}
		if (field.subtype.equals("mobile"))
		{
		    str[indexMap.get(PHONE_MOBILE)] = field.value;
		}
		if (field.subtype.equals("main"))
		{
		    str[indexMap.get(PHONE_MAIN)] = field.value;
		}
		if (field.subtype.equals("home fax"))
		{
		    str[indexMap.get(PHONE_HOME_FAX)] = field.value;
		}
		if (field.subtype.equals("work fax"))
		{
		    str[indexMap.get(PHONE_WORK_FAX)] = field.value;
		}
		if (field.subtype.equals("other"))
		{
		    str[indexMap.get(PHONE_OTHER)] = field.value;
		}
	    }

	    if (field.name.equals(Contact.WEBSITE))
	    {
		if (field.subtype.equals("URL"))
		    str[indexMap.get(WEBSITE)] = field.value;

		if (field.subtype.equals("LINKEDIN") || field.subtype.equals("LINKED_IN"))
		    str[indexMap.get(LINKEDIN)] = field.value;

		if (field.subtype.equals("TWITTER"))
		    str[indexMap.get(TWITTER)] = field.value;

		if (field.subtype.equals("SKYPE"))
		    str[indexMap.get(SKYPE)] = field.value;

		if (field.subtype.equals("FACEBOOK"))
		    str[indexMap.get(FACEBOOK)] = field.value;

		if (field.subtype.equals("XING"))
		    str[indexMap.get(XING)] = field.value;

		if (field.subtype.equals("FEED"))
		    str[indexMap.get(BLOG)] = field.value;

		if (field.subtype.equals("FLICKR"))
		    str[indexMap.get(FLICKR)] = field.value;

		if (field.subtype.equals("GOOGLE-PLUS"))
		    str[indexMap.get(GOOGLE_PLUS)] = field.value;

		if (field.subtype.equals("GITHUB"))
		    str[indexMap.get(GITHUB)] = field.value;

		if (field.subtype.equals("YOUTUBE"))
		    str[indexMap.get(YOUTUBE)] = field.value;
	    }

	    if (field.name.equals(Contact.ADDRESS))
	    {
		try
		{
		    JSONObject addressJSON = new JSONObject(field.value);

		    str[indexMap.get(ADDRESS)] = addressJSON.getString("address");
		    str[indexMap.get(CITY)] = addressJSON.getString("city");
		    str[indexMap.get(STATE)] = addressJSON.getString("state");
		    str[indexMap.get(COUNTRY)] = addressJSON.getString("country");
		    str[indexMap.get(ZIP)] = addressJSON.getString("zip");
		}
		catch (Exception e)
		{
		    System.err.print("Got exception in insertContactProperties addressJSON " + e.getMessage());
		    continue;
		}
	    }

	    if (field.type.equals(ContactField.FieldType.CUSTOM))
	    {
		try
		{
		    str[indexMap.get(field.name)] = field.value;
		}
		catch (Exception e)
		{
		    System.err.print("Got exception in insertContactProperties customfields " + e.getMessage());
		    continue;
		}
	    }

	}
	return str;
    }

    /**
     * Returns data stored in the blobfile with respect to given path.
     * 
     * @param path
     *            - blob file path.
     * @return String
     */
    public static String retrieveBlobFileData(String path)
    {
	// Get a file service
	FileService fileService = FileServiceFactory.getFileService();
	AppEngineFile file = new AppEngineFile(path);

	// Now read from the file using the Blobstore API
	BlobKey blobKey = fileService.getBlobKey(file);

	// Returns data in byte[]
	BlobstoreService blobStoreService = BlobstoreServiceFactory.getBlobstoreService();
	byte[] data = blobStoreService.fetchData(blobKey, 0, BlobstoreService.MAX_BLOB_FETCH_SIZE - 1);

	String str = new String(data);
	return str;

    }

    /**
     * Sends contact csv data as an attachment to current domain user email.
     * 
     * @param currentUserId
     *            - Current Domain User Id.
     * @param data
     *            - CSV data.
     */
    public static void exportContactCSVAsEmail(Long currentUserId, String data)
    {
	DomainUser user = DomainUserUtil.getDomainUser(currentUserId);

	if (user == null || StringUtils.isBlank(user.email))
	    return;

	// Mandrill attachment should contain mime-type, file-name and
	// file-content.
	String[] strArr = { "text/csv", "Contacts.csv", data };

	Mandrill.sendMail("noreply@agilecrm.com", "Agile CRM", user.email, "Agile CRM Contacts CSV", null, "Please find the attachment.", null, strArr);
    }

    /**
     * Removes blob file with respect to path.
     * 
     * @param path
     *            - blob file path
     */
    public static void deleteBlobFile(String path)
    {
	try
	{
	    // Get a file service
	    FileService fileService = FileServiceFactory.getFileService();
	    AppEngineFile file = new AppEngineFile(path);

	    // Now read from the file using the Blobstore API
	    BlobKey blobKey = fileService.getBlobKey(file);

	    // Delete blob from store before sending validation exception to
	    // client
	    BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
	    blobstoreService.delete(blobKey);
	}
	catch (Exception e)
	{
	    System.err.println("Got Exception in deleteBlobFile " + e.getMessage());
	}
    }

}
