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

	// Add tags and tagTimes without trailing commas
	String[] tagWithTimes = getTagsWithTimes(contact);

	str[indexMap.get(TAGS)] = tagWithTimes[0];
	str[indexMap.get(TAGS_TIME)] = tagWithTimes[1];

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
}
