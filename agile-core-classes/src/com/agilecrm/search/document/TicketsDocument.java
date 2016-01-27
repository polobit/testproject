package com.agilecrm.search.document;

import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONObject;

import com.agilecrm.search.BuilderInterface;
import com.agilecrm.ticket.entitys.TicketLabels;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.Tickets.Status;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.util.StringUtils2;
import com.google.appengine.api.search.Cursor;
import com.google.appengine.api.search.Document;
import com.google.appengine.api.search.Field;
import com.google.appengine.api.search.GetRequest;
import com.google.appengine.api.search.GetResponse;
import com.google.appengine.api.search.Index;
import com.google.appengine.api.search.IndexSpec;
import com.google.appengine.api.search.Query;
import com.google.appengine.api.search.QueryOptions;
import com.google.appengine.api.search.Results;
import com.google.appengine.api.search.ScoredDocument;
import com.google.appengine.api.search.SearchServiceFactory;
import com.google.appengine.api.search.SortExpression;
import com.google.appengine.api.search.SortExpression.SortDirection;
import com.google.appengine.api.search.SortOptions;
import com.googlecode.objectify.Key;

/**
 * <code>TicketDocument</code> class is a text search entity for {@link Tickets}
 * class . This class implements {@link BuilderInterface} interface and override
 * methods in it to perform CRUD operations on text search.
 * 
 * @author Sasi on 29-sep-2015
 * 
 */
public class TicketsDocument implements BuilderInterface
{
	String indexName = "tickets";

	/**
	 * Adds the Ticket entity to text search DB.
	 * 
	 */
	@Override
	public void add(Object entity)
	{
		try
		{
			System.out.println("Starting documenting ticket...");

			Tickets ticket = (Tickets) entity;

			Document.Builder document = Document.newBuilder();

			String ticketID = (ticket.id <= 9 ? "0" + ticket.id : ticket.id) + "";

			// Set ticket id as doc id
			document.setId(ticketID);

			// Set ticket group id
			document.addField(Field.newBuilder().setName("group_id").setText(ticket.getGroup_id().getId() + ""));

			// Set ticket assignee id if exists
			if (ticket.getAssignee_id() != null)
			{
				document.addField(Field.newBuilder().setName("assignee_id")
						.setText(ticket.getAssignee_id().getId() + ""));

				document.addField(Field.newBuilder().setName("assigned_time")
						.setNumber(Math.floor(ticket.assigned_time / 1000)));
			}

			/**
			 * Set ticket created time. Epoch number is greater than limits
			 * provided by setNumber method, so converting millis epoch to
			 * normal epoch.
			 */
			document.addField(Field.newBuilder().setName("created_time")
					.setNumber(Math.floor(ticket.created_time / 1000)));

			if (ticket.due_time != null)
				// Set due date
				document.addField(Field.newBuilder().setName("due_date").setNumber(Math.floor(ticket.due_time / 1000)));

			// Set ticket last updated time
			document.addField(Field.newBuilder().setName("last_updated_time")
					.setNumber(Math.floor(ticket.last_updated_time / 1000)));

			// Set ticket first replied time
			document.addField(Field.newBuilder().setName("first_replied_time")
					.setNumber(Math.floor(ticket.first_replied_time / 1000)));

			// Set ticket last agent updated time
			document.addField(Field.newBuilder().setName("last_agent_replied_time")
					.setNumber(Math.floor(ticket.last_agent_replied_time / 1000)));

			// Set ticket last customer updated time
			document.addField(Field.newBuilder().setName("last_customer_replied_time")
					.setNumber(Math.floor(ticket.last_customer_replied_time / 1000)));

			// Set ticket last updated by
			document.addField(Field.newBuilder().setName("last_updated_by").setText(ticket.last_updated_by.toString()));

			// Set ticket status
			document.addField(Field.newBuilder().setName("status").setText(ticket.status.toString()));

			if (ticket.status == Status.CLOSED)
				// Set closed time
				document.addField(Field.newBuilder().setName("closed_time")
						.setNumber(Math.floor(ticket.closed_time / 1000)));

			// Set ticket type
			document.addField(Field.newBuilder().setName("ticket_type").setText(ticket.type.toString()));

			// Set ticket priority
			document.addField(Field.newBuilder().setName("priority").setText(ticket.priority.toString()));

			// Set priority code to get records in ASC or DESC order
			document.addField(Field.newBuilder().setName("priority_code").setNumber(ticket.priority.getCode()));

			// Set email source
			document.addField(Field.newBuilder().setName("source").setText(ticket.source.toString()));

			String requesterName = ticket.requester_name;
			String requesterEmail = ticket.requester_email;
			String plainText = ticket.last_reply_text;

			// Set requester name
			document.addField(Field.newBuilder().setName("requester_name").setText(requesterName));

			// Set requester email
			document.addField(Field.newBuilder().setName("requester_email").setText(requesterEmail));

			// Set mail content
			document.addField(Field.newBuilder().setName("mail_content").setText(plainText));

			// Set mail subject
			document.addField(Field.newBuilder().setName("subject").setText(ticket.subject));

			StringBuffer labelsString = new StringBuffer();

			List<TicketLabels> labels = TicketLabels.dao.fetchAllByKeys(ticket.labels_keys_list);

			for (TicketLabels label : labels)
				labelsString.append(label.id + " ");

			// Set tags
			document.addField(Field.newBuilder().setName("labels").setText(labelsString.toString().trim()));

			// Setting search tokens
			document.addField(Field
					.newBuilder()
					.setName("search_tokens")
					.setText(
							StringUtils2.breakdownFragments(plainText).toString() + " " + requesterName + " "
									+ requesterEmail + " " + ticketID));

			System.out.println(getIndex().put(document));

			// Updating to contacts text search table for global search

			// Setting search tokens
			document.addField(Field
					.newBuilder()
					.setName("search_tokens")
					.setText(
							StringUtils2.breakdownFragments(requesterName + " " + requesterEmail).toString() + " "
									+ ticketID));

			document.addField(Field.newBuilder().setName("type").setText("TICKETS"));

			System.out.println(getContactIndex().put(document));
		}
		catch (Exception e)
		{
			System.out.println("ExceptionUtils.getFullStackTrace(e): " + ExceptionUtils.getFullStackTrace(e));
			e.printStackTrace();
		}
	}

	/**
	 * Updates existing document.
	 */
	@Override
	public void edit(Object entity)
	{
		try
		{
			Tickets ticket = (Tickets) entity;
			Document document = getIndex().get(ticket.id + "");

			String existingMailContent = "";

			try
			{
				existingMailContent = document.getOnlyField("mail_content").getText();
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}

			System.out.println("existingMailContent: " + existingMailContent);

			if (StringUtils.isBlank(existingMailContent))
			{
				add(ticket);
				return;
			}

			ticket.last_reply_text += existingMailContent;

			System.out.println("ticket.last_reply_text: " + ticket.last_reply_text);

			add(ticket);
		}
		catch (Exception e)
		{
			System.out.println("ExceptionUtils.getFullStackTrace(e): " + ExceptionUtils.getFullStackTrace(e));
			e.printStackTrace();
		}
	}

	/**
	 * 
	 */
	@Override
	public void delete(String id)
	{
		getIndex().delete(id);
	}

	@Override
	public Index getIndex()
	{
		IndexSpec indexSpec = IndexSpec.newBuilder().setName(indexName).build();
		return SearchServiceFactory.getSearchService().getIndex(indexSpec);
	}

	public Index getContactIndex()
	{
		IndexSpec indexSpec = IndexSpec.newBuilder().setName("contacts").build();
		return SearchServiceFactory.getSearchService().getIndex(indexSpec);
	}

	public JSONObject searchDocuments(String queryString, String cursorString, String sortField, int limit)
			throws Exception
	{
		List<Key<Tickets>> resultArticleIds = new ArrayList<Key<Tickets>>();

		System.out.println("searching Documents");

		// Create the initial cursor
		Cursor cursor = Cursor.newBuilder().setPerResult(true).build();

		// Set cursor if you already have
		if (StringUtils.isNotBlank(cursorString))
			cursor = Cursor.newBuilder().setPerResult(true).build(URLDecoder.decode(cursorString));

		QueryOptions options = QueryOptions.newBuilder().setCursor(cursor).setLimit(limit).build();
		Query query = null;

		// SortDirection direction = sortField.startsWith("-") ?
		// SortExpression.SortDirection.DESCENDING
		// : SortExpression.SortDirection.ASCENDING;
		//
		// sortField = sortField.replace("-", "");
		//
		// // Build the SortOptions with 2 sort keys
		// SortOptions sortOptions = SortOptions
		// .newBuilder()
		// .addSortExpression(
		// SortExpression.newBuilder().setExpression(sortField).setDirection(direction)
		// .setDefaultValueNumeric(0)).setLimit(1000).build();

		SortExpression.Builder sortExpressionBuilder = SortExpression.newBuilder();
		if (sortField.startsWith("-"))
		{
			sortField = sortField.substring(1);
			sortExpressionBuilder = sortExpressionBuilder.setDirection(SortDirection.DESCENDING);
		}
		else
		{
			sortExpressionBuilder = sortExpressionBuilder.setDirection(SortDirection.ASCENDING);
		}

		sortExpressionBuilder.setExpression(sortField);
		sortExpressionBuilder.setDefaultValueNumeric(0d);

		SortOptions sortOptions = SortOptions.newBuilder().addSortExpression(sortExpressionBuilder.build()).build();

		try
		{
			// Setting records fetching limit to 20
			options = QueryOptions.newBuilder(options).setSortOptions(sortOptions).build();

			query = Query.newBuilder().setOptions(options).build(queryString);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}

		Results<ScoredDocument> results = getIndex().search(query);

		String newCursor = "";
		Long totalResults = 0l;

		try
		{
			totalResults = results.getNumberFound();
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}

		for (ScoredDocument document : results)
		{
			resultArticleIds.add(new Key<Tickets>(Tickets.class, Long.parseLong(document.getId())));

			try
			{
				newCursor = document.getCursor().toWebSafeString();
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}
		}

		System.out.println("Cursor: " + newCursor);

		return new JSONObject().put("cursor", newCursor).put("keys", resultArticleIds).put("count", totalResults);
	}

	public int countRows(String queryString)
	{
		QueryOptions options = QueryOptions.newBuilder().setReturningIdsOnly(true).build();

		Query query = Query.newBuilder().setOptions(options).build(queryString);

		return getIndex().search(query).getResults().size();
	}

	public int getTicketsCount(String queryString)
	{
		QueryOptions options = QueryOptions.newBuilder().setNumberFoundAccuracy(10000).setLimit(1).build();

		Query query = Query.newBuilder().setOptions(options).build(queryString);

		return (int) getIndex().search(query).getNumberFound();
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
		return TicketsUtil.getTicketsBulk(doc_ids);
	}

	public void removeAllDocuments()
	{
		try
		{
			// looping because getRange by default returns up to 100 documents
			// at a time
			while (true)
			{
				List<String> docIds = new ArrayList<String>();

				// Return a set of doc_ids.
				GetRequest request = GetRequest.newBuilder().setReturningIdsOnly(true).build();
				GetResponse<Document> response = getIndex().getRange(request);

				if (response.getResults().isEmpty())
				{
					break;
				}

				for (Document doc : response)
				{
					docIds.add(doc.getId());
				}

				getIndex().delete(docIds);
			}
		}
		catch (RuntimeException e)
		{
			ExceptionUtils.getFullStackTrace(e);
		}
	}
}