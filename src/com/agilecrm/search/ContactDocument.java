package com.agilecrm.search;

import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.time.DateUtils;

import com.agilecrm.contact.Contact;
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
 * field names are replaced with "_" before creating a doc. The type of the
 * field is specified according to type of the field value (created/updated time
 * are added as DATE type in document), and other fields are described in
 * document as TEXT type. When queried on <code>ContactDocument</code> class
 * index using to search API queries returns ContactDocument entity ids, so this
 * class contains a method to return contacts list respective to document ids
 * </p>
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
public class ContactDocument
{
    /**
     * Initializes/get search service for the app
     */
    private static SearchService searchService = SearchServiceFactory.getSearchService();

    /**
     * Index for the contact Document, Required to search on contacts document
     */
    public static Index index = searchService.getIndex(IndexSpec.newBuilder().setName("contacts")
	    .setConsistency(Consistency.PER_DOCUMENT));

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
    public static void buildDocument(Contact contact)
    {
	// Get builder object to build document
	Document.Builder doc = Document.newBuilder();

	// Process the contact property fields and tags(normalized forms)
	Map<String, String> fields = SearchUtil.getDocumentFields(contact);

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
		.setText(SearchUtil.getSearchTokens(contact.properties)));

	// Add document to Index
	addToIndex(doc.setId(contact.id.toString()).build());
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
     * Gets contact collection related to given document ids
     * 
     * Since querying on ContactDocumet returns document ids, this method
     * returns related contacts to document ids
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
     * Deletes an entity from document(called when contact is deleted then
     * respective entity in document should be deleted)
     * 
     * @param contact
     *            {@link Contact}
     * 
     */
    public static void deleteDocument(Contact contact)
    {
	index.remove(contact.id.toString());
    }
}
