package com.agilecrm.search.document;

import java.io.IOException;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import com.agilecrm.contact.Contact;
import com.agilecrm.search.BuilderInterface;
import com.agilecrm.search.util.SearchUtil;
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
 * <code>ContactDocument</code> class represents "Document" created based on app
 * engine search API, It describes contact field values in the document, adds it
 * to index and initialized search service which enables search capabilities.
 * <p>
 * <code>ContactDocument</code> is created whenever a contact is being saved or
 * updated, its field values are trimmed, special characters in field values or
 * field names are replaced with "_" before creating a doc.
 * <p>
 * The type of the field is specified according to type of the field value
 * (created/updated time are added as DATE type in document), and other fields
 * are described in document as TEXT type.
 * </p>
 * When queried on <code>ContactDocument</code> class index using to search API
 * queries returns ContactDocument entity ids, so this class contains a method
 * to return contacts list respective to document ids </p>
 * <p>
 * <blockquote>
 * 
 * <pre>
 * ContactDocument.buildDocument(contact);
 * </pre>
 * 
 * </blockquote> <code>ContactDocument</code> contains methods to buildDocument,
 * and return contacts related to documents ids
 * </p>
 * 
 * @author Yaswanth
 * 
 * @since October 2012
 */
public class ContactDocument implements BuilderInterface
{

    /**
     * Initializes/get search service for the app
     */
    private static SearchService searchService = SearchServiceFactory
	    .getSearchService();

    /**
     * Index for the contact Document, Required to search on contacts document
     */
    public static Index index = searchService.getIndex(IndexSpec.newBuilder()
	    .setName("contacts").setConsistency(Consistency.PER_DOCUMENT));

    /**
     * Describes all the contact field values in the document based on the
     * contact given, and adds to index, created_time and update_time are saved
     * as DATE type, remaining field values are stored as TEXT type in Document
     * 
     * <p>
     * Calls normalize on each field value and also normalizes the tags set and
     * adds to document
     * </p>
     * 
     * @param contact
     *            {@link Contact}
     */
    public void add(Object entity)
    {
	Contact contact = (Contact) entity;

	// Gets builder object required to build a document
	Document.Builder doc = Document.newBuilder();

	// Processes contact property fields and tags(in normalized form)
	Map<String, String> fields = SearchUtil.getFieldsMap(contact);

	/*
	 * Sets fields to document from the map of contact fields values
	 */
	for (Map.Entry<String, String> e : fields.entrySet())
	{
	    doc.addField(Field.newBuilder().setName(e.getKey())
		    .setText(e.getValue()));
	}

	// Sets created date to document with out time component(Search API
	// support date without time component)
	Date truncatedDate = DateUtils.truncate(new Date(), Calendar.DATE);
	doc.addField(Field.newBuilder().setName("created_time")
		.setDate(truncatedDate));

	// Describes updated time document if updated time is not 0.
	if (contact.updated_time > 0L)
	{
	}

	// Adds Other fields in contacts to document
	doc.addField(Field.newBuilder().setName("lead_score")
		.setNumber(contact.lead_score));

	// Adds Other fields in contacts to document
	doc.addField(Field.newBuilder().setName("star_value")
		.setNumber(contact.star_value));

	addTagFields(contact.tags_with_time_json, doc);

	/*
	 * Get tokens from contact properties and adds it in document
	 * "search_tokens"
	 */
	doc.addField(Field.newBuilder().setName("search_tokens")
		.setText(SearchUtil.getSearchTokens(contact.properties)));

	// Adds document to Index
	addToIndex(doc.setId(contact.id.toString()).build());
    }

    @Override
    public void edit(Object entity)
    {
	add(entity);
    }

    /**
     * Gets contact collection related to given document ids
     * 
     * Since querying on ContactDocumet returns document ids, this method
     * returns related contacts to document ids
     * 
     * @param doc_ids
     *            {@link List}
     * @return {@link Collection}
     */
    @SuppressWarnings("rawtypes")
    public Collection getResults(List doc_ids)
    {
	Objectify ofy = ObjectifyService.begin();

	// Returns contact related to doc_ids
	return ofy.get(Contact.class, doc_ids).values();
    }

    /**
     * Deletes an entity from document(called when contact is deleted then
     * respective entity in document should be deleted)
     * 
     * @param id
     *            {@link String}
     * 
     */
    public void delete(String id)
    {
	index.remove(id);
    }

    /**
     * Adds Document to index
     * 
     * @param doc
     *            {@link Document}
     */
    private static void addToIndex(Document doc)
    {
	try
	{
	    // Adds document to index
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

    /**
     * Add tag fields to document as <tagName>_time and it is saved as a date
     * field.
     * 
     * @param tags_json_string
     * @param doc
     */
    private static void addTagFields(String tags_json_string,
	    Document.Builder doc)
    {
	if (tags_json_string == null)
	    return;

	try
	{
	    // Converts tags JSON in to a Map
	    HashMap<String, Long> tagsMappedWithTime = new ObjectMapper()
		    .readValue(tags_json_string,
			    new TypeReference<HashMap<String, Long>>()
			    {
			    });

	    // Iterates through each tag and creates field for each tag i.e.,
	    // <tagName>_time.
	    for (String tag : tagsMappedWithTime.keySet())
	    {

		String normalizedTag = SearchUtil.normalizeString(tag);

		System.out.println(StringUtils.isBlank(normalizedTag));

		Long TagCreationTimeInMills = tagsMappedWithTime.get(tag);

		/*
		 * Truncate date Document search date is without time component
		 */
		Date TagCreatedDate = DateUtils.truncate(new Date(
			TagCreationTimeInMills), Calendar.DATE);

		if (!normalizedTag.matches("^[A-Za-z][A-Za-z0-9_]"))
		    continue;

		// Adds Other fields in contacts to document
		doc.addField(Field.newBuilder()
			.setName(normalizedTag + "_time")
			.setDate(TagCreatedDate));
	    }

	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

}
