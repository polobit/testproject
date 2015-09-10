package com.agilecrm.search.document;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Tag;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.search.BuilderInterface;
import com.agilecrm.search.util.SearchUtil;
import com.agilecrm.user.DomainUser;
import com.google.appengine.api.search.Document;
import com.google.appengine.api.search.Document.Builder;
import com.google.appengine.api.search.Field;
import com.google.appengine.api.search.Index;

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
public class ContactDocument extends com.agilecrm.search.document.Document implements BuilderInterface
{

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
	@Override
	public void add(Object entity)
	{
		Contact contact = (Contact) entity;
		Builder doc = buildDocument(contact);
		
		// Adds document to Index
		addToIndex(doc);   
			
	}
	
	public Builder buildDocument(Contact contact)
	{

		// Gets builder object required to build a document
		Document.Builder doc = Document.newBuilder();

		// Processes contact property fields and tags(in normalized form)
		Map<String, String> fields = SearchUtil.getFieldsMap(contact, doc);
		
		/*
		 * Adds first letter of firstname, lastname for Person and name for
		 * Company to text search.
		 */
		SearchUtil.addNameFirstLetter(contact, doc);
		//schema version for ignoring stale data.
		doc.addField(Field.newBuilder().setName("schema_version").setNumber(1.0));

		// Sets created date to document with out time component(Search API
		// support date without time component)
		Date truncatedDate = DateUtils.truncate(new Date(contact.created_time * 1000), Calendar.DATE);

		/*
		 * Date date = DateUtil.deserializeDate(String.valueOf(truncatedDate
		 * .getTime()));
		 */
		System.out.println(truncatedDate);
		doc.addField(Field.newBuilder().setName("created_time").setDate(truncatedDate));

		doc.addField(Field.newBuilder().setName("type").setText(contact.type.toString()));

		doc.addField(Field.newBuilder().setName("created_time_epoch").setNumber(contact.created_time.doubleValue()));

		// Describes updated time document if updated time is not 0.
		if (contact.updated_time > 0L)
		{
			fields.put("updated_time", contact.updated_time.toString());
			Date updatedDate = DateUtils.truncate(new Date(contact.updated_time * 1000), Calendar.DATE);

			doc.addField(Field.newBuilder().setName("updated_time").setDate(updatedDate));

			doc.addField(Field.newBuilder().setName("updated_time_epoch").setNumber(contact.updated_time));
		}
		
		// Describes last contacted time document if updated time is not 0.
		if (contact.last_contacted > 0L)
		{
			fields.put("last_contacted", contact.last_contacted.toString());
			Date updatedDate = DateUtils.truncate(new Date(contact.last_contacted * 1000), Calendar.DATE);

			doc.addField(Field.newBuilder().setName("last_contacted").setDate(updatedDate));

			doc.addField(Field.newBuilder().setName("last_contacted_epoch").setNumber(contact.last_contacted));
		}
		
		// Describes last contacted time document if updated time is not 0.
		if (contact.last_emailed > 0L)
		{
			fields.put("last_emailed", contact.last_emailed.toString());
			Date updatedDate = DateUtils.truncate(new Date(contact.last_emailed * 1000), Calendar.DATE);

			doc.addField(Field.newBuilder().setName("last_emailed").setDate(updatedDate));

			doc.addField(Field.newBuilder().setName("last_emailed_epoch").setNumber(contact.last_emailed));
		}
		
		// Describes last contacted time document if updated time is not 0.
		if (contact.last_campaign_emaild > 0L)
		{
			fields.put("last_campaign_emaild", contact.last_campaign_emaild.toString());
			Date updatedDate = DateUtils.truncate(new Date(contact.last_campaign_emaild * 1000), Calendar.DATE);

			doc.addField(Field.newBuilder().setName("last_campaign_emaild").setDate(updatedDate));

			doc.addField(Field.newBuilder().setName("last_campaign_emaild_epoch").setNumber(contact.last_campaign_emaild));
		}
		
		// Describes last contacted time document if updated time is not 0.
		if (contact.last_called > 0L)
		{
			fields.put("last_called", contact.last_called.toString());
			Date updatedDate = DateUtils.truncate(new Date(contact.last_called * 1000), Calendar.DATE);

			doc.addField(Field.newBuilder().setName("last_called").setDate(updatedDate));

			doc.addField(Field.newBuilder().setName("last_called_epoch").setNumber(contact.last_called));
		}

		// Adds Other fields in contacts to document
		doc.addField(Field.newBuilder().setName("lead_score").setNumber(contact.lead_score));

		// Adds Other fields in contacts to document
		doc.addField(Field.newBuilder().setName("star_value").setNumber(contact.star_value));

		addTagFields(contact.getTagsList(), doc);

		/*
		 * Get tokens from contact properties and adds it in document
		 * "search_tokens"
		 */
		doc.addField(Field.newBuilder().setName("search_tokens")
				.setText(SearchUtil.getSearchTokens(contact.properties)));
		
		/*
		 * Get all field names in contact seperated by space and adds it in
		 * document "field_labels"
		 */
		doc.addField(Field.newBuilder().setName("field_labels")
				.setText(StringUtils.join(fields.keySet(), " ")));

		DomainUser user = contact.getOwner();

		// Add owner to document
		if (user != null)
			doc.addField(Field.newBuilder().setName("owner_id").setText(String.valueOf(user.id)));
		
		if(contact.campaignStatus != null && !contact.campaignStatus.isEmpty())
		    doc.addField(Field.newBuilder().setName("campaign_status").setText(SearchUtil.getCampaignStatus(contact)));

		doc.setId(contact.id.toString()).build();
		return doc;
	}
	
	

	@Override
	public void edit(Object entity)
	{
		add(entity);
	}

	/**
	 * Deletes an entity from document(called when contact is deleted then
	 * respective entity in document should be deleted)
	 * 
	 * @param id
	 *            {@link String}
	 * 
	 */
	@Override
	public void delete(String id)
	{
		index.delete(id);
	}

	@Override
	public Index getIndex()
	{
		// TODO Auto-generated method stub
		return index;
	}
	
	/**
	 * Adds Document to index
	 * 
	 * @param doc
	 *            {@link Document}..
	 */
	public void addToIndex(Builder... docs)
	{
		// Adds document to index
		try
		{
			index.put(docs);
		}
		catch (Exception e)
		{
			System.out.println(e.getMessage());
			e.printStackTrace();
		}

	}

	/**
	 * Adds Document to index
	 * 
	 * @param doc
	 *            {@link Document}
	 */
	private void addToIndex(Document doc)
	{
		// Adds document to index
		try
		{
			index.put(doc);
		}
		catch (Exception e)
		{
			System.out.println(e.getMessage());
			e.printStackTrace();
		}

	}

	/**
	 * Add tag fields to document as <tagName>_time and it is saved as a date
	 * field.
	 * 
	 * @param tags_json_string
	 * @param doc
	 */
	private void addTagFields(ArrayList<Tag> tags, Document.Builder doc)
	{
		if (tags == null || tags.isEmpty())
			return;

		// Iterates through each tag and creates field for each tag i.e.,
		// <tagName>_time.
		for (Tag tag : tags)
		{

			System.out.println(tag);

			// Tag value
			String normalizedTag = SearchUtil.normalizeTextSearchString(tag.tag);

			// Created time
			Long TagCreationTimeInMills = tag.createdTime;

			/*
			 * Truncate date Document search date is without time component
			 */

			Date TagCreatedDate = DateUtils.truncate(new Date(TagCreationTimeInMills), Calendar.DATE);

			// If tag doesn't satisfies the regular expression of field name in
			// document search, field is not added to avoid exceptions while
			// searching.
			if (!normalizedTag.matches("^[A-Za-z][A-Za-z0-9_]*$"))
				continue;

			System.out.println(normalizedTag);

			try
			{
				doc.addField(Field.newBuilder().setName(normalizedTag + "_time_epoch")
						.setNumber(TagCreationTimeInMills.doubleValue() / 1000));
			}
			catch (IllegalArgumentException e)
			{
				// TODO: handle exception
				e.printStackTrace();

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
	@SuppressWarnings("rawtypes")
	public List getResults(List<Long> doc_ids)
	{
		return ContactUtil.getContactsBulk(doc_ids);
	}
}
