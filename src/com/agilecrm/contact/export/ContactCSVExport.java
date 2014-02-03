package com.agilecrm.contact.export;

import java.nio.channels.Channels;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import au.com.bytecode.opencsv.CSVWriter;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.CustomFieldDef;
import com.agilecrm.contact.Tag;
import com.agilecrm.contact.util.CustomFieldDefUtil;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.blobstore.BlobInfo;
import com.google.appengine.api.blobstore.BlobInfoFactory;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.files.AppEngineFile;
import com.google.appengine.api.files.FileService;
import com.google.appengine.api.files.FileServiceFactory;
import com.google.appengine.api.files.FileWriteChannel;

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

    public static final String PHONE_DEFAULT = "Phone(default)";
    public static final String PHONE_WORK = "Phone(Work)";
    public static final String PHONE_HOME = "Phone(Home)";
    public static final String PHONE_MOBILE = "Phone(Mobile)";
    public static final String PHONE_MAIN = "Phone(Main)";
    public static final String PHONE_HOME_FAX = "Phone(Home fax)";
    public static final String PHONE_WORK_FAX = "Phone(Work fax)";
    public static final String PHONE_OTHER = "Phone(Other)";

    public static final String EMAIL_DEFAULT = "Email(default)";
    public static final String EMAIL_HOME = "Email(Home)";
    public static final String EMAIL_WORK = "Email(Work)";

    public static final String WEBSITE_DEFAULT = "Website(default)";
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

    public static final String TAGS = "Tags";
    public static final String TAGS_TIME = "Tags time";

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

	    System.out.println("Path of blob file in writeContactCSVToBlobstore " + path);

	    // All contacts are obtained at a time.
	    if (isNoFilter == true)
	    {
		System.out.println("No filter is given, so closing channel immediately.");

		lock = true;
		writeChannel = fileService.openWriteChannel(file, lock);

		// Now finalize
		writeChannel.closeFinally();

	    }

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured in writeContactCSVToBlobstore " + e.getMessage());
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

	    System.out.println("Editing existing blob file...");

	    // If path is null return;
	    if (path == null)
	    {
		System.out.println("Given blob file path is null in editExistingBlobFile");
		return;
	    }

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

	    System.out.println("Closing blob file finally...");

	    // Close channel completely when contacts list completed
	    lock = true;
	    writeChannel = fileService.openWriteChannel(file, lock);

	    writeChannel.closeFinally();

	}
	catch (Exception e)
	{
	    e.printStackTrace();
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
		if (contact == null)
		    continue;

		String str[] = insertContactProperties(contact, indexMap, headers.length);
		writer.writeNext(str);
	    }

	    // Close without finalizing
	    writer.close();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured in writeContactCSV " + e.getMessage());
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
	// CSV Header will get initialized in the same order
	String[] headers = { FIRST_NAME, LAST_NAME, TITLE, COMPANY, EMAIL_DEFAULT, EMAIL_HOME, EMAIL_WORK, PHONE_DEFAULT, PHONE_WORK, PHONE_HOME, PHONE_MOBILE,
		PHONE_MAIN, PHONE_HOME_FAX, PHONE_WORK_FAX, PHONE_OTHER, ADDRESS, CITY, STATE, COUNTRY, ZIP, WEBSITE_DEFAULT, WEBSITE, SKYPE, TWITTER,
		LINKEDIN, FACEBOOK, XING, BLOG, GOOGLE_PLUS, FLICKR, GITHUB, YOUTUBE, TAGS, TAGS_TIME };

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
    public static String[] insertContactProperties(Contact contact, Map<String, Integer> indexMap, int headersLength)
    {
	// Initialize new array to insert as new row.
	String str[] = new String[headersLength];

	List<ContactField> properties = contact.properties;

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
		// if email subtype is null
		if (StringUtils.isBlank(field.subtype))
		    str[indexMap.get(EMAIL_DEFAULT)] = field.value;

		if ("home".equals(field.subtype))
		    str[indexMap.get(EMAIL_HOME)] = field.value;

		if ("work".equals(field.subtype))
		    str[indexMap.get(EMAIL_WORK)] = field.value;
	    }

	    if (field.name.equals(Contact.PHONE))
	    {
		// if phone subtype is null
		if (StringUtils.isBlank(field.subtype))
		    str[indexMap.get(PHONE_DEFAULT)] = field.value;

		if ("work".equals(field.subtype))
		{
		    str[indexMap.get(PHONE_WORK)] = field.value;
		}
		if ("home".equals(field.subtype))
		{
		    str[indexMap.get(PHONE_HOME)] = field.value;
		}
		if ("mobile".equals(field.subtype))
		{
		    str[indexMap.get(PHONE_MOBILE)] = field.value;
		}
		if ("main".equals(field.subtype))
		{
		    str[indexMap.get(PHONE_MAIN)] = field.value;
		}
		if ("home fax".equals(field.subtype))
		{
		    str[indexMap.get(PHONE_HOME_FAX)] = field.value;
		}
		if ("work fax".equals(field.subtype))
		{
		    str[indexMap.get(PHONE_WORK_FAX)] = field.value;
		}
		if ("other".equals(field.subtype))
		{
		    str[indexMap.get(PHONE_OTHER)] = field.value;
		}
	    }

	    if (field.name.equals(Contact.WEBSITE))
	    {
		// if website subtype is null
		if (StringUtils.isBlank(field.subtype))
		    str[indexMap.get(WEBSITE_DEFAULT)] = field.value;

		if ("URL".equals(field.subtype))
		    str[indexMap.get(WEBSITE)] = field.value;

		if ("LINKEDIN".equals(field.subtype) || "LINKED_IN".equals(field.subtype))
		    str[indexMap.get(LINKEDIN)] = field.value;

		if ("TWITTER".equals(field.subtype))
		    str[indexMap.get(TWITTER)] = field.value;

		if ("SKYPE".equals(field.subtype))
		    str[indexMap.get(SKYPE)] = field.value;

		if ("FACEBOOK".equals(field.subtype))
		    str[indexMap.get(FACEBOOK)] = field.value;

		if ("XING".equals(field.subtype))
		    str[indexMap.get(XING)] = field.value;

		if ("FEED".equals(field.subtype))
		    str[indexMap.get(BLOG)] = field.value;

		if ("FLICKR".equals(field.subtype))
		    str[indexMap.get(FLICKR)] = field.value;

		if ("GOOGLE-PLUS".equals(field.subtype))
		    str[indexMap.get(GOOGLE_PLUS)] = field.value;

		if ("GITHUB".equals(field.subtype))
		    str[indexMap.get(GITHUB)] = field.value;

		if ("YOUTUBE".equals(field.subtype))
		    str[indexMap.get(YOUTUBE)] = field.value;
	    }

	    if (field.name.equals(Contact.ADDRESS))
	    {
		try
		{
		    JSONObject addressJSON = new JSONObject(field.value);

		    if (addressJSON.has("address"))
			str[indexMap.get(ADDRESS)] = addressJSON.getString("address");

		    if (addressJSON.has("city"))
			str[indexMap.get(CITY)] = addressJSON.getString("city");

		    if (addressJSON.has("state"))
			str[indexMap.get(STATE)] = addressJSON.getString("state");

		    if (addressJSON.has("country"))
			str[indexMap.get(COUNTRY)] = addressJSON.getString("country");

		    if (addressJSON.has("zip"))
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
		    // add if not null
		    if (field.value != null)
			str[indexMap.get(field.name)] = field.value;
		}
		catch (Exception e)
		{
		    System.out.println("Exception field values - " + field.name + ":" + field.value);
		    System.err.print("Got exception in insertContactProperties customfields " + e.getMessage());
		    continue;
		}
	    }

	}

	List<String> tags = new ArrayList<String>();
	List<String> tagsTimes = new ArrayList<String>();

	for (Tag tag : contact.tagsWithTime)
	{
	    tags.add(tag.tag);
	    tagsTimes.add(String.valueOf(tag.createdTime));
	}

	str[indexMap.get(TAGS)] = convertListToString(tags);
	str[indexMap.get(TAGS_TIME)] = convertListToString(tagsTimes);

	return str;
    }

    /**
     * Returns String from list with each element separated by commas.
     * 
     * @param list
     *            - List to convert
     * @return String of elements separated by commas
     */
    public static String convertListToString(List<String> list)
    {
	String strigifiedList = "";
	int length = list.size();

	for (int i = 0; i < length; i++)
	{
	    if (i >= (length - 1))
	    {
		strigifiedList += list.get(i);
		break;
	    }
	    strigifiedList += list.get(i) + ", ";
	}

	return strigifiedList;
    }

    /**
     * Returns data stored in the blobfile with respect to given path.
     * 
     * @param path
     *            - blob file path.
     * @return String
     */
    public static List<String> retrieveBlobFileData(String path)
    {
	// if null return
	if (path == null)
	{
	    System.out.println("Obtained file path is null in retrieveBlobFileData");
	    return null;
	}

	// Get a file service
	FileService fileService = FileServiceFactory.getFileService();
	AppEngineFile file = new AppEngineFile(path);

	// Now read from the file using the Blobstore API
	BlobKey blobKey = fileService.getBlobKey(file);

	// if blobKey null return
	if (blobKey == null)
	{
	    System.out.println("BlobKey of file having path " + path + " is null");
	    return null;
	}

	// Get blob info
	BlobInfo blobInfo = new BlobInfoFactory().loadBlobInfo(blobKey);

	// BlobstoreService blobStoreService =
	// BlobstoreServiceFactory.getBlobstoreService();

	// Get size
	Long blobSize = blobInfo.getSize();
	System.out.println("blobSize = " + blobSize);

	// Returns partitions of data in list
	return readBlobFilePartionsInList(blobKey);
    }

    /**
     * Sends contact csv data as an attachment to current domain user email.
     * 
     * @param currentUserId
     *            - Current Domain User Id.
     * @param data
     *            - CSV data.
     */
    public static void exportContactCSVAsEmail(String currentUser, String data, String total)
    {
	// if fileData null, return
	if (data == null)
	{
	    System.out.println("Rejected to export csv. Data is null.");
	    return;
	}

	System.out.println("Domain User email is " + currentUser);

	JSONObject currentUserJSON = null;
	String toEmail = null;
	String domain = null;
	try
	{
	    currentUserJSON = new JSONObject(currentUser);
	    toEmail = currentUserJSON.getString("email");
	    domain = currentUserJSON.getString("domain");
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured in exportContactCSVAsEmail " + e.getMessage());
	}

	// Mandrill attachment should contain mime-type, file-name and
	// file-content.
	String[] strArr = { "text/csv", "Contacts.csv", data };

	System.out.println("Namespace in exportContactCSVAsEmail " + NamespaceManager.get());
	System.out.println("Domain is  " + domain);

	HashMap<String, String> map = new HashMap<String, String>();
	map.put("count", total);

	SendMail.sendMail(toEmail, SendMail.EXPORT_CONTACTS_CSV_SUBJECT, SendMail.EXPORT_CONTACTS_CSV, map, SendMail.AGILE_FROM_EMAIL,
		SendMail.AGILE_FROM_NAME, strArr);
    }

    /**
     * Removes blob file with respect to path.
     * 
     * @param path
     *            - blob file path
     */
    public static void deleteBlobFile(String path)
    {
	System.out.println("Deleting Blob File under ContactCSVExport...");

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

    /**
     * Reads entire blob data
     * 
     * @param blobKey
     *            - blobKey
     * @param blobSize
     *            - blob size
     * @param blobStoreService
     *            - blobstore service
     * @return byte[]
     */
    public static byte[] readBlobData(BlobKey blobKey, long blobSize, BlobstoreService blobStoreService)
    {
	byte[] allTheBytes = new byte[0];
	long amountLeftToRead = blobSize;
	long startIndex = 0;
	int attempt = 0;

	while (amountLeftToRead > 0 && attempt < 5)
	{
	    long amountToReadNow = Math.min(BlobstoreService.MAX_BLOB_FETCH_SIZE - 1, amountLeftToRead);
	    byte[] chunkOfBytes = blobStoreService.fetchData(blobKey, startIndex, startIndex + amountToReadNow - 1);

	    try
	    {
		allTheBytes = ArrayUtils.addAll(allTheBytes, chunkOfBytes);
	    }
	    catch (Exception e)
	    {
		System.err.println("Exception occured " + e.getMessage());

		System.out.println("Total size obtained till exception " + allTheBytes.length);

		// As we can fetch 32MB per API call, creating another service
		blobStoreService = BlobstoreServiceFactory.getBlobstoreService();

		amountLeftToRead += amountToReadNow;
		startIndex -= amountToReadNow;

		System.out.println("Attempting " + attempt + " time(s)");

		attempt++;
	    }

	    amountLeftToRead -= amountToReadNow;
	    startIndex += amountToReadNow;
	}

	return allTheBytes;
    }

    /**
     * Returns complete byte data in partitions. It can be used to overcome the
     * mail limit like Mandrill allows 25MB per message
     * 
     * @param blobKey
     *            - Blob key
     * @return partitions in List
     */
    public static List<String> readBlobFilePartionsInList(BlobKey blobKey)
    {

	if (blobKey == null)
	    return null;

	// Get blob info
	BlobInfo blobInfo = new BlobInfoFactory().loadBlobInfo(blobKey);
	BlobstoreService blobStoreService = BlobstoreServiceFactory.getBlobstoreService();

	// Get size
	Long blobSize = blobInfo.getSize();
	System.out.println("blobSize = " + blobSize);

	byte[] blobData = readBlobData(blobKey, blobSize, blobStoreService);
	String bytesInString = "";

	// Returns byte data in list
	List<String> blobPartitionList = new ArrayList<>();

	System.out.println("blobData = " + blobData.length);

	long maxSize = (25 * 1024 * 1024);

	// Max iterations
	long iterations = (blobSize / maxSize) + 1;
	System.out.println("blobSize iterations = " + iterations);

	try
	{
	    bytesInString = new String(blobData, "UTF-8");
	}
	catch (Exception e)
	{
	    bytesInString = new String(blobData);
	}

	System.out.println(bytesInString.length());

	for (int i = 0; i < iterations; i++)
	{
	    String data = "";
	    int beginIndex = (int) (i * maxSize), endIndex = (int) (maxSize * (i + 1));
	    try
	    {
		data = bytesInString.substring(beginIndex, endIndex);

	    }
	    catch (Exception e)
	    {
		System.out.println("1 " + e.getMessage());
		endIndex = bytesInString.length();
		try
		{
		    data = bytesInString.substring(beginIndex, endIndex);
		}
		catch (Exception e2)
		{
		    System.out.println("2 " + e2.getMessage());
		}
	    }

	    blobPartitionList.add(data);

	}

	System.out.println(blobPartitionList.size());
	return blobPartitionList;

    }
}
