package com.agilecrm.contact.export;

import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Tag;

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
	//specific to contact
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
    public static final String PHONE_PRIMARY = "Phone(Primary)";
    public static final String PHONE_ALTERNATE = "Phone(Alternate)";
    public static final String PHONE_FAX = "Phone(Fax)";
    

    public static final String EMAIL_DEFAULT = "Email(default)";
    public static final String EMAIL_HOME = "Email(Home)";
    public static final String EMAIL_WORK = "Email(Work)";
    public static final String EMAIL_PRIMARY = "Email(Primary)";
    public static final String EMAIL_ALTERNATE = "Email(Alternate)";

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
    
    //specific to company
    public static final String NAME = "Name";
    public static final String URL = "Url";

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
	    	setFieldAtIndex(FIRST_NAME, field.value, str, indexMap);

	    if (field.name.equals(Contact.LAST_NAME))
	    	setFieldAtIndex(LAST_NAME, field.value, str, indexMap);

	    if (field.name.equals(Contact.TITLE))
	    	setFieldAtIndex(TITLE, field.value, str, indexMap);

	    if (field.name.equals(Contact.COMPANY))
	    	setFieldAtIndex(COMPANY, field.value, str, indexMap);
	    
	    if (field.name.equals(Contact.NAME))
	    	setFieldAtIndex(NAME, field.value, str, indexMap);

		if (field.name.equals(Contact.URL))
			setFieldAtIndex(URL, field.value, str, indexMap);

	    if (field.name.equals(Contact.EMAIL))
	    {
		// if email subtype is null
		if (StringUtils.isBlank(field.subtype))
			setFieldAtIndex(EMAIL_DEFAULT, field.value, str, indexMap);

		if ("home".equals(field.subtype))
			setFieldAtIndex(EMAIL_HOME, field.value, str, indexMap);

		if ("work".equals(field.subtype))
			setFieldAtIndex(EMAIL_WORK, field.value, str, indexMap);
		
		if ("primary".equalsIgnoreCase(field.subtype))
			setFieldAtIndex(EMAIL_PRIMARY, field.value, str, indexMap);

		if ("alternate".equalsIgnoreCase(field.subtype))
			setFieldAtIndex(EMAIL_ALTERNATE, field.value, str, indexMap);

	    }
	    
	    if (field.name.equals(Contact.PHONE))
	    {
		// if phone subtype is null
		if (StringUtils.isBlank(field.subtype))
			setFieldAtIndex(PHONE_DEFAULT, field.value, str, indexMap);

		if ("work".equals(field.subtype))
			setFieldAtIndex(PHONE_WORK, field.value, str, indexMap);
		
		if ("home".equals(field.subtype))
			setFieldAtIndex(PHONE_HOME, field.value, str, indexMap);
		
		if ("mobile".equals(field.subtype))
			setFieldAtIndex(PHONE_MOBILE, field.value, str, indexMap);
		
		if ("main".equals(field.subtype))
			setFieldAtIndex(PHONE_MAIN, field.value, str, indexMap);
		
		if ("home fax".equals(field.subtype))
			setFieldAtIndex(PHONE_HOME_FAX, field.value, str, indexMap);
		
		if ("work fax".equals(field.subtype))
			setFieldAtIndex(PHONE_WORK_FAX, field.value, str, indexMap);
		
		if ("other".equals(field.subtype))
			setFieldAtIndex(PHONE_OTHER, field.value, str, indexMap);
		
		if ("primary".equals(field.subtype))
			setFieldAtIndex(PHONE_PRIMARY, field.value, str, indexMap);
		
		if ("alternate".equals(field.subtype))
			setFieldAtIndex(PHONE_ALTERNATE, field.value, str, indexMap);
		
		if ("fax".equals(field.subtype))
			setFieldAtIndex(PHONE_FAX, field.value, str, indexMap);
		
	    }

	    if (field.name.equals(Contact.WEBSITE))
	    {
		// if website subtype is null
		if (StringUtils.isBlank(field.subtype))
			setFieldAtIndex(WEBSITE_DEFAULT, field.value, str, indexMap);

		if ("URL".equals(field.subtype))
			setFieldAtIndex(WEBSITE, field.value, str, indexMap);

		if ("LINKEDIN".equals(field.subtype) || "LINKED_IN".equals(field.subtype))
			setFieldAtIndex(LINKEDIN, field.value, str, indexMap);

		if ("TWITTER".equals(field.subtype))
			setFieldAtIndex(TWITTER, field.value, str, indexMap);

		if ("SKYPE".equals(field.subtype))
			setFieldAtIndex(SKYPE, field.value, str, indexMap);

		if ("FACEBOOK".equals(field.subtype))
			setFieldAtIndex(FACEBOOK, field.value, str, indexMap);

		if ("XING".equals(field.subtype))
			setFieldAtIndex(XING, field.value, str, indexMap);

		if ("FEED".equals(field.subtype))
			setFieldAtIndex(BLOG, field.value, str, indexMap);

		if ("FLICKR".equals(field.subtype))
			setFieldAtIndex(FLICKR, field.value, str, indexMap);

		if ("GOOGLE-PLUS".equals(field.subtype))
			setFieldAtIndex(GOOGLE_PLUS, field.value, str, indexMap);

		if ("GITHUB".equals(field.subtype))
			setFieldAtIndex(GITHUB, field.value, str, indexMap);

		if ("YOUTUBE".equals(field.subtype))
			setFieldAtIndex(YOUTUBE, field.value, str, indexMap);
	    }

	    if (field.name.equals(Contact.ADDRESS))
	    {
		try
		{
		    JSONObject addressJSON = new JSONObject(field.value);

		    if (addressJSON.has("address"))
		    	setFieldAtIndex(ADDRESS, addressJSON.getString("address"), str, indexMap);

		    if (addressJSON.has("city"))
		    	setFieldAtIndex(CITY, addressJSON.getString("city"), str, indexMap);

		    if (addressJSON.has("state"))
		    	setFieldAtIndex(STATE, addressJSON.getString("state"), str, indexMap);

		    if (addressJSON.has("country"))
		    	setFieldAtIndex(COUNTRY, addressJSON.getString("country"), str, indexMap);

		    if (addressJSON.has("zip"))
		    	setFieldAtIndex(ZIP, addressJSON.getString("zip"), str, indexMap);
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
		    	setFieldAtIndex(field.name, field.value, str, indexMap);
		}
		catch (Exception e)
		{
		    System.out.println("Exception field values - " + field.name + ":" + field.value);
		    System.err.print("Got exception in insertContactProperties customfields " + e.getMessage());
		    continue;
		}
	    }

	}

	// Add tags and tagTimes without trailing commas
	String[] tagWithTimes = getTagsWithTimes(contact);
	
	setFieldAtIndex(TAGS, tagWithTimes[0], str, indexMap);
	setFieldAtIndex(TAGS_TIME, tagWithTimes[1], str, indexMap);

	return str;
    }

    /**
     * Returns String[] of tags and their times
     * 
     * @param contact
     *            - Contact object that is added
     * @return String[]
     */
    public static String[] getTagsWithTimes(Contact contact)
    {
	String tags = "";
	String tagTimes = "";

	for (Tag tag : contact.tagsWithTime)
	{
	    tags += tag.tag + ",";
	    tagTimes += tag.createdTime + ",";
	}

	// Return array having tags and tagTimes without trailing commas
	return new String[] { StringUtils.chop(tags), StringUtils.chop(tagTimes) };
    }
    
    private static void setFieldAtIndex(String fieldName, String fieldValue, String[] values, Map<String, Integer> indexMap) {
    	Integer index = indexMap.get(fieldName);
    	if(index != null) 
    		values[index] = fieldValue;
    }
}
