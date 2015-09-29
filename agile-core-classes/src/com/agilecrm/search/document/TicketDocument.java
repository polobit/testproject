package com.agilecrm.search.document;

import java.util.List;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.search.BuilderInterface;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.utils.TicketUtil;
import com.agilecrm.util.StringUtils2;
import com.google.appengine.api.search.Document;
import com.google.appengine.api.search.Field;
import com.google.appengine.api.search.Index;
import com.google.appengine.api.search.IndexSpec;
import com.google.appengine.api.search.SearchServiceFactory;

/**
 * 
 * @author Sasi on 29-sep-2015
 * 
 */
public class TicketDocument implements BuilderInterface
{
	String indexName = "tickets";

	@Override
	public void add(Object entity)
	{
		try
		{
			System.out.println("Starting documenting ticket...");

			Tickets ticket = (Tickets) entity;

			Document.Builder document = Document.newBuilder();

			// Set ticket id as doc id
			document.setId(ticket.id + "");

			// Set ticket group id
			document.addField(Field.newBuilder().setName("group_id").setNumber(ticket.group_id));

			// Set ticket assignee id if exists
			if (ticket.assignee_id != null)
				document.addField(Field.newBuilder().setName("assignee_id").setNumber(ticket.assignee_id));

			// Set ticket created time
			document.addField(Field.newBuilder().setName("created_time").setNumber(Math.floor(ticket.created_time)));

			// Set ticket last updated time
			document.addField(Field.newBuilder().setName("last_updated_time")
					.setNumber(Math.floor(ticket.last_updated_time)));

			// Set ticket last updated by
			document.addField(Field.newBuilder().setName("last_updated_by").setText(ticket.last_updated_by.toString()));

			// Set ticket first replied time
			document.addField(Field.newBuilder().setName("first_replied_time")
					.setNumber(Math.floor(ticket.first_replied_time)));

			// Set ticket last agent updated time
			document.addField(Field.newBuilder().setName("last_agent_replied_time")
					.setNumber(Math.floor(ticket.last_agent_replied_time)));

			// Set ticket last customer updated time
			document.addField(Field.newBuilder().setName("last_customer_replied_time")
					.setNumber(Math.floor(ticket.last_customer_replied_time)));

			// Set ticket status
			document.addField(Field.newBuilder().setName("status").setText(ticket.status.toString()));

			// Set ticket type
			document.addField(Field.newBuilder().setName("type").setText(ticket.type.toString()));

			// Set ticket priority
			document.addField(Field.newBuilder().setName("priority").setText(ticket.priority.toString()));

			// Set email source
			document.addField(Field.newBuilder().setName("source").setText(ticket.source.toString()));

			String requesterName = ticket.requester_name;
			String requesterEmail = ticket.requester_email;
			String plainText = ticket.last_reply_text;
			String shortTicketID = TicketUtil.getTicketShortID(ticket.id) + "";

			// Set requester name
			document.addField(Field.newBuilder().setName("requester_name").setText(requesterName));

			// Set requester email
			document.addField(Field.newBuilder().setName("requester_email").setText(requesterEmail));

			// Set mail content
			document.addField(Field.newBuilder().setName("mail_content").setText(plainText));

			// Set requester email
			document.addField(Field
					.newBuilder()
					.setName("search_tokens")
					.setText(
							StringUtils2.breakdownFragments(plainText).toString() + " " + requesterName + " "
									+ requesterEmail + " " + shortTicketID));

			// Set email tags
			// document.addField(Field.newBuilder().setName("tags").setText(ticket.source.toString()));

			System.out.println(getIndex().put(document));
		}
		catch (Exception e)
		{
			System.out.println("ExceptionUtils.getFullStackTrace(e): " + ExceptionUtils.getFullStackTrace(e));
			e.printStackTrace();
		}
	}

	@Override
	public void edit(Object entity)
	{
		try
		{
			Tickets ticket = (Tickets) entity;
			Document document = getIndex().get(ticket.id + "");

			String existingMailContent = document.getOnlyField("mail_content").getText();

			System.out.println("existingMailContent: " + existingMailContent);

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

	@Override
	public void delete(String id)
	{
		// TODO Auto-generated method stub
	}

	@Override
	public Index getIndex()
	{
		IndexSpec indexSpec = IndexSpec.newBuilder().setName(indexName).build();
		return SearchServiceFactory.getSearchService().getIndex(indexSpec);
	}

	@Override
	public List getResults(List<Long> ids)
	{
		return null;
	}
}