package com.agilecrm.contact.export.util;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.contact.CustomFieldDef;
import com.agilecrm.contact.CustomFieldDef.SCOPE;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.export.ContactCSVExport;
import com.agilecrm.contact.util.CustomFieldDefUtil;

public class ContactExportCSVUtil
{

    /**
     * Builds contacts csv and write to blob file.
     * 
     * @param writeChannel
     * @param contactList
     * @param isFirstTime
     */
    /*
     * public static void writeContactCSV(FileWriteChannel writeChannel,
     * List<Contact> contactList, String[] headers, Boolean isFirstTime) { try {
     * CSVWriter writer = new CSVWriter(Channels.newWriter(writeChannel,
     * "UTF8"));
     * 
     * if (isFirstTime) writer.writeNext(headers);
     * 
     * Map<String, Integer> indexMap =
     * ContactExportCSVUtil.getIndexMapOfCSVHeaders(headers);
     * 
     * for (Contact contact : contactList) { if (contact == null) continue;
     * 
     * String str[] = ContactCSVExport.insertContactProperties(contact,
     * indexMap, headers.length); List<Note> notes =
     * NoteUtil.getNotes(contact.id); writer.writeNext(addNotes(str, notes)); }
     * 
     * // Close without finalizing writer.close(); } catch (Exception e) {
     * e.printStackTrace();
     * System.err.println("Exception occured in writeContactCSV " +
     * e.getMessage()); } }
     */

    /**
     * Returns array of CSV Headers. Appends custom fields labels as CSV Headers
     * to array.
     * 
     * @return String[]
     */
    public static String[] getCSVHeadersForContact()
    {
	// CSV Header will get initialized in the same order
	String[] headers = { ContactCSVExport.FIRST_NAME, ContactCSVExport.LAST_NAME, ContactCSVExport.TITLE,
		ContactCSVExport.COMPANY, ContactCSVExport.EMAIL_DEFAULT, ContactCSVExport.EMAIL_HOME,
		ContactCSVExport.EMAIL_WORK, ContactCSVExport.PHONE_DEFAULT, ContactCSVExport.PHONE_WORK,
		ContactCSVExport.PHONE_HOME, ContactCSVExport.PHONE_MOBILE, ContactCSVExport.PHONE_MAIN,
		ContactCSVExport.PHONE_HOME_FAX, ContactCSVExport.PHONE_WORK_FAX, ContactCSVExport.PHONE_OTHER,
		ContactCSVExport.ADDRESS, ContactCSVExport.CITY, ContactCSVExport.STATE, ContactCSVExport.COUNTRY,
		ContactCSVExport.ZIP, ContactCSVExport.WEBSITE_DEFAULT, ContactCSVExport.WEBSITE,
		ContactCSVExport.SKYPE, ContactCSVExport.TWITTER, ContactCSVExport.LINKEDIN, ContactCSVExport.FACEBOOK,
		ContactCSVExport.XING, ContactCSVExport.BLOG, ContactCSVExport.GOOGLE_PLUS, ContactCSVExport.FLICKR,
		ContactCSVExport.GITHUB, ContactCSVExport.YOUTUBE, ContactCSVExport.TAGS, ContactCSVExport.TAGS_TIME };

	return getHeaders(ContactExportCSVUtil.appendCustomFieldsToHeaders(headers, SCOPE.PERSON));
    }

    /**
     * Returns array of CSV Headers. Appends custom fields labels as CSV Headers
     * to array.
     * 
     * @return String[]
     */
    public static String[] getCSVHeadersForCompany()
    {
	// CSV Header will get initialized in the same order
	String[] headers = { ContactCSVExport.NAME, ContactCSVExport.URL, ContactCSVExport.EMAIL_DEFAULT,
		ContactCSVExport.EMAIL_PRIMARY, ContactCSVExport.EMAIL_ALTERNATE, ContactCSVExport.PHONE_DEFAULT,
		ContactCSVExport.PHONE_PRIMARY, ContactCSVExport.PHONE_ALTERNATE, ContactCSVExport.PHONE_FAX,
		ContactCSVExport.PHONE_OTHER, ContactCSVExport.ADDRESS, ContactCSVExport.CITY, ContactCSVExport.STATE,
		ContactCSVExport.COUNTRY, ContactCSVExport.ZIP, ContactCSVExport.WEBSITE_DEFAULT,
		ContactCSVExport.WEBSITE, ContactCSVExport.SKYPE, ContactCSVExport.TWITTER, ContactCSVExport.LINKEDIN,
		ContactCSVExport.FACEBOOK, ContactCSVExport.XING, ContactCSVExport.BLOG, ContactCSVExport.GOOGLE_PLUS,
		ContactCSVExport.FLICKR, ContactCSVExport.GITHUB, ContactCSVExport.YOUTUBE };

	return getHeaders(ContactExportCSVUtil.appendCustomFieldsToHeaders(headers, SCOPE.COMPANY));
    }

    /**
     * Appends Custom fields to CSV Headers string array. If Exception occurs it
     * simply returns headers without appending custom fields.
     * 
     * @param headers
     *            - string array of headers.
     * @return String[]
     */
    public static String[] appendCustomFieldsToHeaders(String[] headers, SCOPE scope)
    {
	// Can't append elements directly in java, so convert to ArrayList
	List<String> headersList = new ArrayList<String>(Arrays.asList(headers));

	try
	{
	    // List of custom fields
	    List<CustomFieldDef> customFields = CustomFieldDefUtil.getAllCustomFields(scope);

	    // Appends custom field labels to list
	    for (CustomFieldDef customField : customFields)
	    {
	    	if (!customField.field_type.equals(CustomFieldDef.Type.FORMULA))
	    	{
	    		headersList.add(customField.field_label);
	    	}
	    }

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
     * helper function will append note in contact entity this will add five
     * note max for each contact if notes are more than 5 then it will ignore
     * rest of notes
     */
    public static String[] addNotes(String[] contactData, List<Note> notes)
    {
	int count = 0;
	for (Note note : notes)
	{
	    StringBuilder sb = new StringBuilder();
	    if (note.subject != null)
		sb.append(note.subject.trim());
	    if (note.description != null)
		sb.append("\n" + note.description);
	    // ten notes are already added in header use that index.
	    contactData[contactData.length - 10 + count] = sb.toString();
	    count++;
	    if (count == 10)
		break;
	}
	return contactData;
    }

    /**
     * helper function modify original header and add new Note value in header
     * this function will add five header only as note
     * 
     * @param originalValues
     * @return
     */
    private static String[] getHeaders(String[] originalValues)
    {
	ArrayList<String> data = new ArrayList<String>();
	data.addAll(Arrays.asList(originalValues));
	data.add("Note1");
	data.add("Note2");
	data.add("Note3");
	data.add("Note4");
	data.add("Note5");
	data.add("Note6");
	data.add("Note7");
	data.add("Note8");
	data.add("Note9");
	data.add("Note10");
	return data.toArray(new String[data.size()]);
    }

    public static String getExportFileName(String prefix)
    {
	Date currentDate = new Date();
	SimpleDateFormat df = new SimpleDateFormat("MM-dd-yyyy_hh:mm");
	StringBuilder exportedFileName = new StringBuilder(prefix).append(df.format(currentDate)).append(".csv");
	return exportedFileName.toString();
    }

    public static void addToPullQueue(Long currentUserId, String contact_ids, String filter, String dynamicFilter)
    {

    }

    public static boolean isTextSearchQuery(String filter)
    {
	if (filter.startsWith("#tags/"))
	    return false;

	if (filter.equals("#contacts"))
	    return false;

	if (filter.contains("system-"))
	    return false;

	return true;

    }
}
