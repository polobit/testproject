package com.agilecrm.search.util;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.CustomFieldDef;
import com.agilecrm.contact.util.CustomFieldDefUtil;
import com.agilecrm.util.Util;

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
    public static Map<String, String> getFieldsMap(Contact contact)
    {
	// Map to store all the fields
	Map<String, String> fields = new HashMap<String, String>();

	// Sets contactField objects in to map
	for (ContactField contactField : contact.properties)
	{
	    CustomFieldDef customField = null;

	    /*
	     * Iterates through custom properties of contact
	     */
	    if (contactField.type.equals(ContactField.FieldType.CUSTOM))
	    {
		// Get the custom field based on field name
		customField = CustomFieldDefUtil
			.getFieldByName(contactField.name);

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

	    /*
	     * Replaces special characters with "_" in field name
	     */
	    String field_name = contactField.name.replaceAll("[^a-zA-Z0-9_]",
		    "_");

	    /*
	     * If key already exist appends contact field value to respective
	     * value in map(ex: multiple email can be stored for a contact with
	     * same field name)
	     */
	    if (fields.containsKey(field_name))
	    {
		String value = normalizeString(fields.get(field_name)) + " "
			+ normalized_value;

		normalized_value = value;
	    }

	    // If key do not exist with field_name add it to map
	    fields.put(field_name, normalized_value);
	}

	/*
	 * Removes spaces in each tag, and concat all tags with space between
	 * them(ex: ["agile dev", "clickdesk dev"] to "agiledev clickdeskdev")
	 */
	String tags = normalizeSet(contact.tags);

	// put String tags
	if (tags != null)
	    fields.put("tags", tags);

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

	return (value).replace(" ", "");
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
		    HashMap<String, String> addressMap = new ObjectMapper()
			    .readValue(
				    contactField.value,
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
	    tokens = Util.getSearchTokens(tokens);

	// Returns normalized set
	return normalizeSet(tokens);
    }

}
