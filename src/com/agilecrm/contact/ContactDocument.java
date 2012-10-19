package com.agilecrm.contact;

import java.net.URLEncoder;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.time.DateUtils;

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
	    String normalized_value = URLEncoder.encode(contactField.value);

	    System.out.println(normalized_value);

	    // If key already exists append contactfield value to respective
	    // value in map
	    if (fields.containsKey(contactField.name))
	    {
		String value = fields.get(contactField.name) + " "
			+ normalized_value;

		normalized_value = value;
	    }

	    fields.put(contactField.name, normalized_value);

	}

	String tags = NormalizeSet(contact.tags);

	// put String tags
	// if (tags != null)
	// fields.put("tags", tags);

	for (String tag : contact.tags)
	{
	    doc.addField(Field.newBuilder().setName("tags").setAtom(tag));
	}

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

	for (ContactField contactField : properties)
	{
	    if (contactField.value != null)
		tokens.add(contactField.value);
	}

	if (tokens.size() != 0)
	    search_tokens = Util.getSearchTokens(tokens);

	return NormalizeSet(search_tokens);
    }

    private static String NormalizeSet(Set<String> values)
    {
	String normalizedString = "";

	// Concat all tags in to one string normalized and space seperated
	for (String tag : values)
	{
	    normalizedString = normalizedString + " " + URLEncoder.encode(tag);
	}

	return normalizedString;
    }

    public static void deleteDocument(Contact contact)
    {
	index.remove(contact.id.toString());
    }
}
