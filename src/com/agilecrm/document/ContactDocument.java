package com.agilecrm.document;

import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.time.DateUtils;

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

public class ContactDocument
{

    // Get the SearchService for the default namespace
    private static SearchService searchService = SearchServiceFactory
	    .getSearchService();

    // Get the index. If not yet created, create it.
    public static Index index = searchService.getIndex(IndexSpec.newBuilder()
	    .setName("contacts").setConsistency(Consistency.PER_DOCUMENT));;

    public static void buildDocument(Contact contact)
    {
	System.out.println("contact id : " + contact.id);
	// Get builder object
	Document.Builder doc = Document.newBuilder();

	// Map to store all the fields
	Map<String, String> fields = new HashMap<String, String>();

	// Set contactField objects in to map
	for (ContactField contactField : contact.properties)
	{

	    CustomFieldDef customField = null;

	    if (contactField.type.equals(ContactField.FieldType.CUSTOM))
		customField = CustomFieldDef.getFieldByName(contactField.name);

	    // If CustomField is not required field then return should not
	    // be
	    // added to document
	    if (contactField.type.equals(ContactField.FieldType.CUSTOM)
		    && customField != null
		    && !CustomFieldDef.getFieldByName(contactField.name).searchable)
		return;

	    String normalized_value = normalizeString(contactField.value);

	    // Replace special characters with "_" in field name
	    String field_name = contactField.name.replaceAll("[^a-zA-Z0-9_]",
		    "_");

	    System.out.println(normalized_value);

	    // If key already exists append contactfield value to respective
	    // value in map
	    if (fields.containsKey(field_name))
	    {
		String value = normalizeString(fields.get(field_name)) + " "
			+ normalized_value;

		normalized_value = value;
	    }

	    fields.put(field_name, normalized_value);

	}

	String tags = normalizeSet(contact.tags);

	// put String tags
	if (tags != null)
	    fields.put("tags", tags);
	/*
	 * for (String tag : contact.tags) {
	 * doc.addField(Field.newBuilder().setName("tags").setAtom(tag)); }
	 */
	// Set fields to document from map
	for (Map.Entry<String, String> e : fields.entrySet())
	{
	    doc.addField(Field.newBuilder().setName(e.getKey())
		    .setText(e.getValue()));
	}

	// Set created date with out time component
	Date truncatedDate = DateUtils.truncate(new Date(), Calendar.DATE);
	doc.addField(Field.newBuilder().setName("created_time")
		.setDate(truncatedDate));

	// Save updated time if updated time is not 0
	if (contact.updated_time > 0L)
	{
	    Date updatedDate = DateUtils.truncate(new Date(
		    contact.updated_time * 1000), Calendar.DATE);

	    doc.addField(Field.newBuilder().setName("updated_time")
		    .setDate(updatedDate));
	}

	// Other fields in contacts
	doc.addField(Field.newBuilder().setName("lead_score")
		.setNumber(contact.lead_score));

	// Save tokends
	doc.addField(Field.newBuilder().setName("search_tokens")
		.setText(getSearchTokens(contact.properties)));

	// Add document to Index
	addToIndex(doc.setId(contact.id.toString()).build());

	System.out.println(doc);
    }

    private static void addToIndex(Document doc)
    {
	try
	{
	    index.add(doc);

	}
	catch (AddException e)
	{
	    if (StatusCode.TRANSIENT_ERROR.equals(e.getOperationResult()
		    .getCode()))
	    {
		// retry adding document
	    }
	}
    }

    // Split the contact fields and send normalized string
    private static String getSearchTokens(List<ContactField> properties)
    {
	// Create Search Keyword Values
	Set<String> tokens = new HashSet<String>();
	Set<String> search_tokens = new HashSet<String>();

	// first name and last name for different combinations to search
	String firstName = "";
	String lastName = "";

	String contactName = "";
	for (ContactField contactField : properties)
	{

	    if (contactField.name.equals("first_name"))
	    {
		firstName = contactField.value;
		continue;
	    }

	    if (contactField.name.equals("last_name"))
	    {
		lastName = contactField.value;
	    }

	    tokens.add(normalizeString(contactField.value));

	}

	// contact contact name first name then last name add to tokens
	contactName = normalizeString(firstName + lastName);
	tokens.add(contactName);

	// contact contact name last name then first name add to tokens
	contactName = normalizeString(lastName + firstName);
	tokens.add(contactName);

	if (tokens.size() != 0)
	    search_tokens = Util.getSearchTokens(tokens);

	return normalizeSet(search_tokens);
    }

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

    public static String normalizeString(String value)
    {

	// return ParserUtils.normalizePhrase("\"" + URLEncoder.encode(value)
	// + "\"");
	// return "\"" + (value) + "\"";

	return (value).replace(" ", "");
    }

    public static Collection getRelatedEntities(List contact_ids)
    {
	Objectify ofy = ObjectifyService.begin();
	// Return result contacts
	return ofy.get(Contact.class, contact_ids).values();
    }

    public static void deleteDocument(Contact contact)
    {
	index.remove(contact.id.toString());
    }

}
