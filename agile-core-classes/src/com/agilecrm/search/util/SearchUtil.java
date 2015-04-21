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

	    // Trims the spaces in field value
	    String normalized_value = normalizeString(contactField.value);

	    String field_name = normalizeTextSearchString(contactField.name);

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
	String tags = normalizeSet(contact.getContactTags());

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
	    if (contactField.name.equals("first_name"))
	    {
		firstName = contactField.value;
	    }

	    else if (contactField.name.equals("last_name"))
	    {
		lastName = contactField.value;
	    }

	    else if (contactField.name.equals("address"))
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

		emailStatus = emailBounceStatus.campaign_id + "_" + "BOUNCED";

		// If SPAM, replace with SPAM
		if (emailBounceStatus.emailBounceType.equals(EmailBounceType.SPAM))
		    emailStatus = emailStatus.replace("BOUNCED", "SPAM");

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

}