package com.agilecrm.search;

import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.time.DateUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.CustomFieldDef;
import com.agilecrm.util.Util;
import com.google.appengine.api.search.AddException;
import com.google.appengine.api.search.Consistency;
import com.google.appengine.api.search.Document;
import com.google.appengine.api.search.Field;
import com.google.appengine.api.search.Index;
import com.google.appengine.api.search.IndexSpec;
import com.google.appengine.api.search.SearchService;
import com.google.appengine.api.search.SearchServiceFactory;
import com.google.appengine.api.search.StatusCode;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * This <code>ContactDocument</code> class saves the contact object as a
 * document and enables to search on contacts, this class contains methods to
 * build contact document(buildDocument) and utility methods
 * 
 * @author Yaswanth
 * 
 * @since October 2012
 */
public class ContactDocument
{
    /**
     * Initializes search service for the app
     */
    private static SearchService searchService = SearchServiceFactory.getSearchService();

    /**
     * Index for the contact Document, Required to search on contacts document
     */
    public static Index index = searchService.getIndex(IndexSpec.newBuilder().setName("contacts")
	    .setConsistency(Consistency.PER_DOCUMENT));

    /**
     * Builds a document based on the contact given, saves each field value and
     * keywords can be queries on the using index of the document
     * 
     * @param contact
     *            {@link Contact}
     */
    public static void buildDocument(Contact contact)
    {
	// Get builder object to build document
	Document.Builder doc = Document.newBuilder();

	// Map to store all the fields
	Map<String, String> fields = new HashMap<String, String>();

	// Set contactField objects in to map
	for (ContactField contactField : contact.properties)
	{
	    CustomFieldDef customField = null;

	    /*
	     * If CustomField is not required field then return should not be
	     * added to document
	     */
	    if (contactField.type.equals(ContactField.FieldType.CUSTOM))
	    {
		// Get the custom field based on field name
		customField = CustomFieldDef.getFieldByName(contactField.name);

		/*
		 * Check whether customField is not available or customfield is
		 * not searchable continue loop, field will not be added in
		 * document
		 */
		if (customField == null || !customField.searchable)
		    continue;
	    }

	    // Trims the spaces in field value
	    String normalized_value = normalizeString(contactField.value);

	    /*
	     * Replace special characters with "_" in field name document search
	     * does not allow to save special characters in value
	     */
	    String field_name = contactField.name.replaceAll("[^a-zA-Z0-9_]", "_");

	    /*
	     * If key already exists append contactfield value to respective
	     * value in map(ex: multiple email can be stored for for contact
	     * with same field name)
	     */
	    if (fields.containsKey(field_name))
	    {
		String value = normalizeString(fields.get(field_name)) + " " + normalized_value;

		normalized_value = value;
	    }

	    // If key do not exist with field_name add it to map
	    fields.put(field_name, normalized_value);

	}

	/*
	 * Remove spaces in each tag and concat all tags with space between
	 * them(ex: ["agile dev", "clickdesk dev"] to "agiledeve clickdeskdev")
	 */
	String tags = normalizeSet(contact.tags);

	// put String tags
	if (tags != null)
	    fields.put("tags", tags);

	/*
	 * Set fields to document from the map of contact contact fields and
	 * field values
	 */
	for (Map.Entry<String, String> e : fields.entrySet())
	{
	    doc.addField(Field.newBuilder().setName(e.getKey()).setText(e.getValue()));
	}

	// Set created date to document with out time component
	Date truncatedDate = DateUtils.truncate(new Date(), Calendar.DATE);
	doc.addField(Field.newBuilder().setName("created_time").setDate(truncatedDate));

	// Save updated time if updated time is not 0
	if (contact.updated_time > 0L)
	{
	    Date updatedDate = DateUtils.truncate(new Date(contact.updated_time * 1000),
		    Calendar.DATE);

	    doc.addField(Field.newBuilder().setName("updated_time").setDate(updatedDate));
	}

	// Add Other fields to document in contacts
	doc.addField(Field.newBuilder().setName("lead_score").setNumber(contact.lead_score));

	/*
	 * get tokent from contact properties and save it in document
	 * "search_tokens"
	 */
	doc.addField(Field.newBuilder().setName("search_tokens")
		.setText(getSearchTokens(contact.properties)));

	// Add document to Index
	addToIndex(doc.setId(contact.id.toString()).build());
    }

    /**
     * This method adds the document to Index
     * 
     * @param doc
     *            {@link Document}
     */
    private static void addToIndex(Document doc)
    {
	try
	{
	    // Add document to index
	    index.add(doc);

	}
	catch (AddException e)
	{
	    if (StatusCode.TRANSIENT_ERROR.equals(e.getOperationResult().getCode()))
	    {
		// retry adding document
	    }
	}
    }

    /**
     * Split the contact fields and send normalized string
     * 
     * @param properties
     *            {@link List}
     * @return {@link String}
     */
    private static String getSearchTokens(List<ContactField> properties)
    {
	// Create Search Keyword Values
	Set<String> tokens = new HashSet<String>();

	// First name and last name for different combinations to search
	String firstName = "";
	String lastName = "";

	/*
	 * Iterate through contact properties and get fist name last name (for
	 * combinations first_name + last_name , last_name + first_name) and
	 * convert address string to map and save address keywords to search
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
		// Create HashMap from Address JSON string
		try
		{
		    // Convert address JSON string(sent so from client) to a map
		    HashMap<String, String> addressMap = new ObjectMapper().readValue(
			    contactField.value, new TypeReference<HashMap<String, String>>()
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

	// Split each token in to fragments to search based on keyword
	if (tokens.size() != 0)
	    tokens = Util.getSearchTokens(tokens);

	// Rerturn normalized set
	return normalizeSet(tokens);
    }

    /**
     * This method normalize the set values: trim spaces in the set value and
     * concat all values space separated
     * 
     * ["agile dev", "clickdesk dev"] to "agiledev clickdeskdev"
     * 
     * @param values
     *            {@link Set}
     * @return {@link String}
     */
    private static String normalizeSet(Set<String> values)
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
     * Remove spaces from the string
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
     * Get contact related to given document ids
     * 
     * @param doc_ids
     *            {@link List}
     * @return {@link Collection}
     */
    public static Collection getRelatedEntities(List doc_ids)
    {
	Objectify ofy = ObjectifyService.begin();

	// Return contact related to doc_ids
	return ofy.get(Contact.class, doc_ids).values();
    }

    /**
     * This method delete an entity from document(called when contact is deleted
     * then it should delete is respective entity in document)
     * 
     * @param contact
     *            {@link Contact}
     * 
     */
    public static void deleteDocumentEntity(Contact contact)
    {
	index.remove(contact.id.toString());
    }
}
