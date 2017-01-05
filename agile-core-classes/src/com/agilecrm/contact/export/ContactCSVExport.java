package com.agilecrm.contact.export;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;
import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Tag;
import com.agilecrm.contact.util.ContactUtil;

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
    public static final String EMAIL_PERSONAL = "Email(Personal)";


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
    public static final String TAGS_TIME = "Tags Time Epoch";
    public static final String TAGS_TIME_NEW = "Tags Time";

    //specific to company
    public static final String NAME = "Name";
    public static final String URL = "Url";

    //created time column added - 05.06 - prakash
    public static final String CREATED_TIME = "Created Date";
    private static final DateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");
    private static final DateFormat dateTimeFormat = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
    
    //specific to leads
    public static final String LEAD_SOURCE = "Lead Source";
    public static final String LEAD_STATUS = "Lead Status";
    
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
    public static String[] insertContactProperties(Contact contact, Map<String, Integer> indexMap, int headersLength, Map<Long, String> source_map, Map<Long, String> status_map)
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

		if ("home".equals(field.subtype) || "personal".equalsIgnoreCase(field.subtype))
			setFieldAtIndex(EMAIL_PERSONAL, field.value, str, indexMap);

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
		    if (field.value != null){
		    	setFieldAtIndex(field.name, field.value, str, indexMap);
		    	try{
			    	Integer index = indexMap.get(field.name + " Name");
			    	if(index != null){  // if the dynamic index is present then it denotes that the custom filed is contact or company type
			    		JSONArray customFieldsArray = null;
			    		try {
			    			JSONParser parser = new JSONParser();
			    			customFieldsArray = (JSONArray)parser.parse(field.value);
						} catch (Exception e) {
							System.out.println("Exception occured while converting contact and company type custom fields JSON string to array");
							e.printStackTrace();
						}
			    		List<Contact> contacts = null;
			    		if(customFieldsArray != null && customFieldsArray.size() > 0)
			    		{
			    			contacts = ContactUtil.getContactsBulk(new org.json.JSONArray(customFieldsArray.toJSONString())) ;
			    		}
			    		if (contacts != null && contacts.size() > 0) {
			    			StringBuilder contactName = new StringBuilder("[");
				    		for(Contact cont : contacts){
				    			List<ContactField> prop = cont.properties ;
				    			if(cont.type.equals(Contact.Type.PERSON)){
				    				String fname = null ; String lname = null; 
				    				for(int k=0;k<prop.size();k++){
				    					if(prop.get(k).name.equals("first_name") && prop.get(k).type.equals(ContactField.FieldType.SYSTEM))
				    						fname = prop.get(k).value ;
				    					else if(prop.get(k).name.equals("last_name") && prop.get(k).type.equals(ContactField.FieldType.SYSTEM))
				    						lname = prop.get(k).value ;
				    				}
				    				contactName.append(fname);
				    				if(lname != null)
				    					contactName.append(" "+lname);
				    			}else{
				    				String name = null;
				    				for(int k=0;k<prop.size();k++){
				    					if(prop.get(k).name.equals("name") && prop.get(k).type.equals(ContactField.FieldType.SYSTEM)){
				    						name = prop.get(k).value ;
				    						break;
				    					}
				    				}
				    				contactName.append(name);
				    			}
				    			
				    			contactName.append(",");
				    		}
				    		contactName.replace(contactName.length()-1, contactName.length(),"");
				    		contactName.append("]");
				    		setFieldAtIndex(field.name+" Name", contactName.toString(), str, indexMap); // this is to show the name of the contact	
			    		}
			    	}		    			
		    	}catch(Exception e){}
		    }
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
	setFieldAtIndex(TAGS_TIME_NEW, tagWithTimes[2], str, indexMap);

	//Add creted time in MM/dd/yyyy format
	Date date = new Date();
	date.setTime(contact.created_time*1000);	
	setFieldAtIndex(CREATED_TIME, dateFormat.format(date), str, indexMap);
	// adding date in MM/dd/yyyy format done
	
	if(contact != null && contact.type == Contact.Type.LEAD && source_map != null)
	{
		String source_name = null;
		Long source_id = contact.getLead_source_id();
		if(source_id != null)
		{
			source_name = source_map.get(source_id);
		}
		setFieldAtIndex(LEAD_SOURCE, source_name, str, indexMap);
	}
	
	if(contact != null && contact.type == Contact.Type.LEAD && status_map != null)
	{
		String status_name = null;
		Long status_id = contact.getLead_status_id();
		if(status_id != null)
		{
			status_name = status_map.get(status_id);
		}
		setFieldAtIndex(LEAD_STATUS, status_name, str, indexMap);
	}
	
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
	String tagTimesNew = "";

	for (Tag tag : contact.tagsWithTime)
	{
		 tags += tag.tag + ",";
 	    if(tag.createdTime!=0)
 	    {
 	    	tagTimes += tag.createdTime;
 	    	Date date = new Date();
     		date.setTime(tag.createdTime);	
     	    tagTimesNew += dateTimeFormat.format(date);
 	    }
 	    tagTimes +=",";
 	    tagTimesNew += ",";
	}

	// Return array having tags and tagTimes without trailing commas
	return new String[] { StringUtils.chop(tags), StringUtils.chop(tagTimes), StringUtils.chop(tagTimesNew)};
    }
    
    private static void setFieldAtIndex(String fieldName, String fieldValue, String[] values, Map<String, Integer> indexMap) {
    	Integer index = indexMap.get(fieldName);
    	if(index != null) 
    		values[index] = fieldValue;
    }
}
