package com.agilecrm.contact;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang.time.DateUtils;

import com.google.appengine.api.search.AddException;
import com.google.appengine.api.search.Consistency;
import com.google.appengine.api.search.Document;
import com.google.appengine.api.search.Field;
import com.google.appengine.api.search.Index;
import com.google.appengine.api.search.IndexSpec;
import com.google.appengine.api.search.SearchService;
import com.google.appengine.api.search.SearchServiceFactory;
import com.google.appengine.api.search.StatusCode;
import com.google.appengine.api.search.query.ParserUtils;

public class ContactDocument
{
    // Get the SearchService for the default namespace
    private static SearchService searchService = SearchServiceFactory
	    .getSearchService();

    // Get the index. If not yet created, create it.
    public static Index index = searchService.getIndex(IndexSpec.newBuilder()
	    .setName("contacts").setConsistency(Consistency.PER_DOCUMENT));;

    public static void buildDocument(Contact contact, Long id)
    {
	// Get builder object
	Document.Builder doc = Document.newBuilder();
	Map<String, String> fields = new HashMap<String, String>();

	// Set contactField objects in to map
	for (ContactField contactField : contact.properties)
	{

	    System.out.println("before decomposition : " + contactField.value);

	    String normalized_value = ParserUtils
		    .normalizePhrase(contactField.value);

	    System.out.println(normalized_value);

	    // If key already exists append contactfield value to respective
	    // value in map
	    if (fields.containsKey(contactField.name))
	    {
		String value = fields.get(contactField.name) + " "
			+ normalized_value;

		System.out.println(value);

		fields.put(contactField.name, value);
	    }
	    else
	    {

		fields.put(contactField.name, normalized_value);
	    }

	}

	String tags = "";

	for (String tag : contact.tags)
	{
	    tags = tags + " " + ParserUtils.normalizePhrase(tag);
	}

	System.out.println(tags);
	fields.put("tags", tags);

	System.out.println(fields);

	// Set fields to document from map
	for (Map.Entry<String, String> e : fields.entrySet())
	{
	    doc.addField(
		    Field.newBuilder().setName(e.getKey())
			    .setText(e.getValue())).setId(id.toString())
		    .build();
	}

	// Set created date with out time component
	Date truncatedDate = DateUtils.truncate(new Date(), Calendar.DATE);
	doc.addField(Field.newBuilder().setName("created_time")
		.setDate(truncatedDate));

	// Add document to Index
	addToIndex(doc.build());
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
}
