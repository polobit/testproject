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
 * This <code>ContactDocument</code> class saves the contact object as a
 * document and enables to search on contacts, this class contains methods to
 * build contact document(buildDocument) and utility methods to
 * process(normalize, special character handling..)
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
    public static void deleteDocument(Contact contact)
    {
	index.remove(contact.id.toString());
    }
}
