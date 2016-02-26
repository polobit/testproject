package com.agilecrm.search.util;

import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.CustomFieldDef;
import com.agilecrm.contact.email.bounce.EmailBounceStatus;
import com.agilecrm.contact.email.bounce.EmailBounceStatus.EmailBounceType;
import com.agilecrm.contact.util.CustomFieldDefUtil;
import com.agilecrm.util.StringUtils2;
import com.agilecrm.workflows.status.CampaignStatus;
import com.agilecrm.workflows.unsubscribe.UnsubscribeStatus;
import com.google.appengine.api.search.Document;
import com.google.appengine.api.search.Field;

/**
 * <code> SearchUtil </code> contains utility methods normalizing, splitting in
 * to keywords, it is used by ContactDocument class
 * 
 */
public class SearchUtil
{
    /**
     * Normalizes all the contact properties and added to a map with key
     * normalized field name.
     * 
     * @param contact
     *            {@link Contact}
     * @return {@link Map}
     */
	

    public static Map<String, String> getFieldsMap(Contact contact, Document.Builder doc)
    {
	// Map to store all the fields
	Map<String, String> fields = new HashMap<String, String>();

	// Sets contactField objects in to map
	for (ContactField contactField : contact.properties)
	{
	    // if (StringUtils.isEmpty(contactField.value))
	    // continue;
		
		 // Trims the spaces in field value
	    String normalized_value = normalizeString(contactField.value);
	    String field_name = normalizeTextSearchString(contactField.name);
		
		/*
		 * Add UTM parameter in a Search Document of contact. If UTM parameter is Avialable 
		 */
	    System.out.println("Custome Field NamE "+ field_name);
		if (!(StringUtils.isEmpty(contactField.value)) && (contactField.name.equals(Contact.UTM_SOURCE) || contactField.name.equals(Contact.UTM_MEDIUM) || contactField.name.equals(Contact.UTM_CAMPAIGN) || contactField.name.equals(Contact.UTM_TERM) || contactField.name.equals(Contact.UTM_CONTENT)))
		{
			 doc.addField(Field.newBuilder().setName(field_name).setText(StringUtils.lowerCase(normalized_value)));
		     fields.put(field_name, normalized_value);
			 continue;
		}
		
		
	    CustomFieldDef customField = null;

	    if (contactField.value == null || contactField.name == null)
		continue;

	    /*
	     * Iterates through custom properties of contact
	     */
	    if (ContactField.FieldType.CUSTOM.equals(contactField.type))
	    {
		// Get the custom field based on field name
		customField = CustomFieldDefUtil.getFieldByName(contactField.name);

		/*
	         * Checks whether customField is not available or custom field
	         * is not search enabled then continue loop, field will not be
	         * added in document
	         */
		if (customField == null || !customField.searchable)
		    continue;
	    }

	   

	    System.out.println(field_name);
	    /*
	     * Replaces special characters with "_" in field name
	     */
	    field_name = field_name.replaceAll("[^a-zA-Z0-9_]", "_");

	    if (customField != null && customField.field_type == CustomFieldDef.Type.DATE)
	    {
		try
		{
		    doc.addField(Field.newBuilder().setName(normalizeTextSearchString(field_name) + "_time_epoch")
			    .setNumber(Double.valueOf(contactField.value)));
		    fields.put(normalizeTextSearchString(field_name) + "_time", contactField.value);
		}
		catch (NumberFormatException e)
		{
		    e.printStackTrace();
		}
		catch (Exception e)
		{
		    e.printStackTrace();
		}
		continue;
	    }
	    else if (customField != null && customField.field_type == CustomFieldDef.Type.NUMBER)
	    {
		try
		{
		    doc.addField(Field.newBuilder().setName(normalizeTextSearchString(field_name) + "_number")
			    .setNumber(Double.valueOf(contactField.value)));
		    fields.put(normalizeTextSearchString(field_name) + "_number", contactField.value);
		}
		catch (Exception e)
		{
		    e.printStackTrace();
		}
		continue;
	    }

	    if (customField == null && field_name.equals(Contact.PHONE))
	    {
		normalized_value = getPhoneNumberTokens(contactField.value);
		if (fields.containsKey(field_name))
		{
		    String value = fields.get(field_name) + " " + normalized_value;

		    normalized_value = value;
		}
		doc.addField(Field.newBuilder().setName(field_name).setText(normalized_value));
		fields.put(field_name, normalized_value);
		continue;
	    }
	    
		if (customField == null && field_name.equals(Contact.ADDRESS)) {
			splitAddressAndAddToSearch(fields, doc, contactField);
			continue;
		}
		if (customField == null && (field_name.equals(Contact.FIRST_NAME) || field_name.equals(Contact.LAST_NAME))) {
			 doc.addField(Field.newBuilder().setName(field_name).setText(StringUtils.lowerCase(normalized_value)));
		    fields.put(field_name, normalized_value);
			continue;
		}
		
			
		

	    /*
	     * If key already exist appends contact field value to respective
	     * value in map(ex: multiple email can be stored for a contact with
	     * same field name)
	     */
	    if (fields.containsKey(field_name))
	    {
		String value = normalizeString(fields.get(field_name)) + " " + normalized_value;

		normalized_value = value;
	    }

	    /*
	     * Sets fields to document from the map of contact fields values
	     */
	    doc.addField(Field.newBuilder().setName(field_name).setText(normalized_value));

	    // If key do not exist with field_name add it to map
	    fields.put(field_name, normalized_value);
	}

	/*
	 * Removes spaces in each tag, and concat all tags with space between
	 * them(ex: ["agile dev", "clickdesk dev"] to "agiledev clickdeskdev")
	 */
	String tags = normalizeTagsSet(contact.getContactTags());

	// put String tags
	if (tags != null)
	    fields.put("tags", tags);

	/*
	 * Sets fields to document from the map of contact fields values
	 */
	doc.addField(Field.newBuilder().setName("tags").setText(tags));

	return fields;
    }
    
    /**
     * Splits the address in text search so that it can be used for filtering.
     * @param fields
     * @param doc
     * @param contactField
     */
    private static void splitAddressAndAddToSearch(Map<String, String> fields, Document.Builder doc, ContactField contactField)
	{
		String city = null, country = null, state=null, zip=null;
		// Trims the spaces in field value
	    String normalized_value = normalizeString(contactField.value);
	    String field_name = normalizeTextSearchString(contactField.name);
		try
		{
			JSONObject addressJSON = new JSONObject(contactField.value);
			try {
				city = addressJSON.getString("city");
				} catch(JSONException e){
			}
			try {
				country = addressJSON.getString("country");
				} catch(JSONException e){
			}
			try {
				state = addressJSON.getString("state");
				} catch(JSONException e){
			}
			try {
				zip = addressJSON.getString("zip");
				} catch(JSONException e){
			}
			if(StringUtils.isNotEmpty(city)) {
				if (fields.containsKey("city"))
				{
				    String value = fields.get("city") + " " + normalizeString(city);
				    value = normalizeString(value);
				    doc.addField(Field.newBuilder().setName("city").setText(value));
				    fields.put("city", value);
				} else {				
					String value = normalizeString(city);
					doc.addField(Field.newBuilder().setName("city").setText(value));
					fields.put("city", value);
				}
			}
			if(StringUtils.isNotEmpty(country)) {
				if (fields.containsKey("country"))
				{
				    String value = fields.get("country") + " " + normalizeString(country);
				    value = normalizeString(value);
				    doc.addField(Field.newBuilder().setName("country").setText(value));
				    fields.put("country", value);
				} else {				
					String value = normalizeString(country);
					doc.addField(Field.newBuilder().setName("country").setText(value));
					fields.put("country", value);
				}
			}
			if(StringUtils.isNotEmpty(zip)) {
				if (fields.containsKey("zip"))
				{
				    String value = fields.get("zip") + " " + normalizeString(zip);
				    value = normalizeString(value);
				    doc.addField(Field.newBuilder().setName("zip").setText(value));
				    fields.put("zip", value);
				} else {
					String value = normalizeString(zip);
					doc.addField(Field.newBuilder().setName("zip").setText(value));
					fields.put("zip", value);
				}
			}
			if(StringUtils.isNotEmpty(state)) {
				if (fields.containsKey("state"))
				{
				    String value = fields.get("state") + " " + normalizeString(state);
				    value = normalizeString(value);
				    doc.addField(Field.newBuilder().setName("state").setText(value));
				    fields.put("state", value);
				} else {		
					String value = normalizeString(state);
					doc.addField(Field.newBuilder().setName("state").setText(value));
					fields.put("state", value);
				}
			}

		}
		catch (JSONException e)
		{
			System.err.print("Got exception in adding addressJSON to ext search " + e.getMessage());
		}
		if (fields.containsKey(field_name))
		{
		    String value = fields.get(field_name) + " " + normalized_value;

		    doc.addField(Field.newBuilder().setName(field_name).setText(value));
			fields.put(field_name, value);
		} else {
			doc.addField(Field.newBuilder().setName(field_name).setText(normalized_value));
			fields.put(field_name, normalized_value);
		}
		
	}

    /**
     * Removes spaces from the string
     * 
     * @param value
     * @return {@link String}
     */
    public static String normalizeString(String value)
    {

	// return ParserUtils.normalizePhrase("\"" + URLEncoder.encode(value)
	// + "\"");
	// return "\"" + (value) + "\"";

	if (StringUtils.isEmpty(value))
	    return "";

	return (value).replace(" ", "");
    }

    /**
     * Removes spaces from the string
     * 
     * @param value
     * @return {@link String}
     */
    public static String normalizeTextSearchString(String value)
    {

	// return ParserUtils.normalizePhrase("\"" + URLEncoder.encode(value)
	// + "\"");
	// return "\"" + (value) + "\"";

	if (StringUtils.isEmpty(value))
	    return "";

	value = (value).replace(" ", "");

	// Checks if value is compatible as text search table heading
	if (!value.matches("^[A-Za-z][A-Za-z0-9_]*$"))
	{
	    // Replaces particular set of special chars with their respective
	    // names
	    value = (value).replace(" ", "").replace("@", "_AT_").replace("#", "_HASH_").replace("-", "_HYPHEN_")
		    .replace(":", "_COLON_").replace(";", "_SEMI_COLON_").replace("&", "_AMPERSAND_")
		    .replace("*", "_ASTERISK_");

	    // If string still doesn't satisfy text search criteria, all specail
	    // characters are replaced with _SPECIAL_
	    if (!value.matches("^[A-Za-z_][A-Za-z0-9_]*$"))
		value = value.replaceAll("[^A-Za-z0-9_]", "_SPECAIL_");

	    // Removes "_" from the sarting of string as it could be added when
	    // special character is replaced with _<special char name>_
	    if (value.startsWith("_"))
		value = value.substring(1);
	    //replace first numeric character with NUM_
	    if (value.length() >0 && value.substring(0, 1).matches("[0-9]")) {
	    	value = value.replaceFirst(value.substring(0, 1), "NUM_");
	    }

	    System.out.println("value to map : " + value);
	}

	return value;
    }

    /**
     * Normalizes the set values: trims spaces in the set value and concats all
     * values space separated
     * 
     * ["agile dev", "clickdesk dev"] to "agiledev clickdeskdev"
     * 
     * @param values
     *            {@link Set}
     * @return {@link String}
     */
    public static String normalizeSet(Set<String> values)
    {
	String normalizedString = "";

	// Concat all tags in to one string normalized and space seperated
	for (String tag : values)
	{
	    normalizedString += " " + normalizeString(tag);
	}

	return normalizedString.trim();
    }

    /**
     * Splits the contact fields in to fragments and returns normalized string
     * 
     * @param properties
     *            {@link List}
     * @return {@link String}
     */
    public static String getSearchTokens(List<ContactField> properties)
    {
	// Holds Search Keyword Values
	Set<String> tokens = new HashSet<String>();

	// Holds first name and last name for different combinations to search
	String firstName = "";
	String lastName = "";

	/*
	 * Iterates through contact properties and gets fist name last name (for
	 * combinations first_name + last_name , last_name + first_name),
	 * converts address string to map and saves address keywords to search
	 */
	for (ContactField contactField : properties)
	{
	    if ("first_name".equals(contactField.name))
	    {
		firstName = contactField.value;
	    }

	    else if ("last_name".equals(contactField.name))
	    {
		lastName = contactField.value;
	    }

	    else if ("address".equals(contactField.name))
	    {
		// Creates HashMap from Address JSON string
		try
		{
		    // Converts address JSON string(sent so from client) to a
		    // map
		    HashMap<String, String> addressMap = new ObjectMapper().readValue(contactField.value,
			    new TypeReference<HashMap<String, String>>()
			    {
			    });

		    // save the address values
		    tokens.addAll(addressMap.values());
		}
		catch (Exception e)
		{
		    e.printStackTrace();
		}
	    }

	    // If field is not first_name or last_name or address directly
	    tokens.add(normalizeString(contactField.value));

	}

	String contactName = "";

	// contact contact name first name then last name add to tokens
	contactName = normalizeString(firstName + lastName);
	tokens.add(contactName);

	// contact contact name last name then first name add to tokens
	contactName = normalizeString(lastName + firstName);
	tokens.add(contactName);

	// Splits each token in to fragments to search based on keyword
	if (tokens.size() != 0)
	    tokens = StringUtils2.getSearchTokens(tokens);

	// Returns normalized set
	return normalizeSet(tokens);
    }
    
    /**
     * Adds first letter of firstname, lastname for Person and 
	 * name for Company to text search.
     * @param contact
     * @param doc
     */
    public static void addNameFirstLetter(Contact contact, Document.Builder doc)
    {
    	ContactField firstNameField = contact.getContactFieldByName(Contact.FIRST_NAME);
		ContactField lastNameField = contact.getContactFieldByName(Contact.LAST_NAME);
		ContactField nameField = contact.getContactFieldByName(Contact.NAME);
		String first_name = firstNameField != null ? firstNameField.value : "";
		String last_name = lastNameField != null ? lastNameField.value : "";
		String name = nameField != null ? nameField.value : "";
		if(StringUtils.isNotEmpty(first_name)) {
			doc.addField(Field.newBuilder().setName("first_name_start").setText(first_name.substring(0, 1)));
		}
		if(StringUtils.isNotEmpty(last_name)) {
			doc.addField(Field.newBuilder().setName("last_name_start").setText(last_name.substring(0, 1)));
		}
		if(StringUtils.isNotEmpty(name)) {
			doc.addField(Field.newBuilder().setName("name_start").setText(name.substring(0, 1)));
		}
	}

    public static String getDateWithoutTimeComponent(Long millSeconds)
    {
	/*
	 * Truncate date Document search date is without time component
	 */
	Date truncatedDate = DateUtils.truncate(new Date(millSeconds), Calendar.DATE);

	// Format date(formated as stored in document)
	Format formatter = new SimpleDateFormat("yyyy-MM-dd");

	// Formated to build query
	return formatter.format(truncatedDate);
    }

    public static String getDateWithoutTimeComponent(Long millSeconds, String format)
    {
	if (StringUtils.isEmpty(format))
	    return null;
	/*
	 * Truncate date Document search date is without time component
	 */
	Date truncatedDate = DateUtils.truncate(new Date(millSeconds), Calendar.DATE);

	// Format date(formated as stored in document)
	Format formatter = new SimpleDateFormat(format);

	// Formated to build query
	return formatter.format(truncatedDate);
    }

    public static String getPhoneNumberTokens(String phoneNumber)
    {
	if (StringUtils.isEmpty(phoneNumber))
	{
	    return "";
	}
	phoneNumber = StringUtils2.extractNumber(phoneNumber);
	if (phoneNumber.length() > 8)
	{
	    phoneNumber = phoneNumber + " " + phoneNumber.substring(phoneNumber.length() - 8);
	}
	return phoneNumber;
    }

    /**
     * Returns campaign status string with each campaign status separated by
     * space
     * 
     * @param contact
     * @return
     */
    public static String getCampaignStatus(Contact contact)
    {

	Set<String> campaignSearchStatus = new HashSet<String>();
	String campaignStatus = "";

	try
	{
	    // CampaignStatus - ACTIVE, REMOVE AND DONE
	    for (CampaignStatus campaignStatusObj : contact.campaignStatus)
	    {
		if (campaignStatusObj == null || campaignStatusObj.campaign_id == null)
		    continue;

		campaignSearchStatus.add(campaignStatusObj.campaign_id.toString());
		campaignSearchStatus.add(campaignStatusObj.status.replaceAll("-", "_"));
	    }

	    String emailStatus = "";

	    // EmailBounce Status - BOUNCED AND SPAM
	    for (EmailBounceStatus emailBounceStatus : contact.emailBounceStatus)
	    {
		if (emailBounceStatus == null || emailBounceStatus.campaign_id == null)
		    continue;

		if (emailBounceStatus.emailBounceType.equals(EmailBounceType.HARD_BOUNCE))
			emailStatus = emailBounceStatus.campaign_id + "_" + "HARDBOUNCED";

		if (emailBounceStatus.emailBounceType.equals(EmailBounceType.SOFT_BOUNCE))
			emailStatus = emailBounceStatus.campaign_id + "_" + "SOFTBOUNCED";
			
		// If SPAM, replace with SPAM
		if (emailBounceStatus.emailBounceType.equals(EmailBounceType.SPAM))
			emailStatus = emailBounceStatus.campaign_id + "_" + "SPAM";

		campaignSearchStatus.add(emailBounceStatus.campaign_id.toString());
		campaignSearchStatus.add(emailStatus);
	    }

	    // Unsubscribe Status - UNSUBSCRIBED
	    for (UnsubscribeStatus unsubscribeStatus : contact.unsubscribeStatus)
	    {
		if (unsubscribeStatus == null || unsubscribeStatus.campaign_id == null)
		    continue;

		campaignSearchStatus.add(unsubscribeStatus.campaign_id.toString());
		campaignSearchStatus.add(unsubscribeStatus.campaign_id + "_" + "UNSUBSCRIBED");
	    }

	    // Append each status along with campaign id
	    for(String status: campaignSearchStatus)
		campaignStatus += (campaignStatus == "" ? "" : " ") + status;
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while adding campaign search status..." + e.getMessage());
	    e.printStackTrace();
	}

	return campaignStatus;

    }
    
	/**
	 * Removes spaces from the string and replace hipen with _AGILE_HIPEN_
	 * 
	 * @param value
	 * @return {@link String}
	 */
	public static String normalizeTag(String value) {

		if (StringUtils.isEmpty(value))
			return "";

		return (value).replace("-", "_AGILE_HIPEN_").replace(" ", "");
	}

	/**
	 * Normalizes the set values: Removes spaces and replace hipen with
	 * _AGILE_HIPEN_
	 * 
	 * 
	 * @param values
	 *            {@link Set}
	 * @return {@link String}
	 */
	public static String normalizeTagsSet(Set<String> values) {
		String normalizedString = "";

		// Concat all tags in to one string normalized and space seperated
		for (String tag : values) {
			normalizedString += " " + normalizeTag(tag);
		}
		return normalizedString.trim();
	}

}
