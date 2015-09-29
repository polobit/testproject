package com.agilecrm.ticket.utils;

import java.util.Calendar;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.search.document.TicketDocument;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.Tickets.LAST_UPDATED_BY;
import com.agilecrm.ticket.entitys.Tickets.Priority;
import com.agilecrm.ticket.entitys.Tickets.Source;
import com.agilecrm.ticket.entitys.Tickets.Status;
import com.agilecrm.ticket.entitys.Tickets.Type;
import com.googlecode.objectify.Key;

/**
 * 
 * @author Sasi on 28-Sep-2015
 * 
 */
public class TicketUtil
{
	public static Tickets getTicketByID(Long ticketID)
	{
		try
		{
			return Tickets.ticketsDao.get(ticketID);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}

		return null;
	}

	/**
	 * 
	 * @param group_id
	 * @param assigned_to_group
	 * @param requester_name
	 * @param requester_email
	 * @param subject
	 * @param cc_emails
	 * @param plain_text
	 * @param html_text
	 * @param source
	 * @param attachments
	 * @param ipAddress
	 * @param created_by
	 * @param note_type
	 */
	public static Tickets createTicket(Long group_id, Boolean assigned_to_group, String requester_name,
			String requester_email, String subject, String cc_emails, String plain_text, String html_text,
			Source source, Boolean attachments, String ipAddress)
	{
		Tickets ticket = null;

		try
		{
			ticket = new Tickets(group_id, assigned_to_group, requester_name, requester_email, subject, cc_emails,
					plain_text, source, attachments);

			Long createTime = Calendar.getInstance().getTimeInMillis();

			ticket.created_time = createTime;
			ticket.last_updated_by = LAST_UPDATED_BY.REQUESTER;
			ticket.last_reply_text = plain_text;
			ticket.status = Status.NEW;
			ticket.type = Type.PROBLEM;
			ticket.priority = Priority.LOW;
			ticket.requester_ip_address = ipAddress;

			// Get country and city from ipaddress

			Key<Tickets> key = Tickets.ticketsDao.put(ticket);

			System.out.println("key: " + key.getId());

			// Create search document
			new TicketDocument().add(ticket);
		}
		catch (Exception e)
		{
			System.out.println("ExceptionUtils.getFullStackTrace(e): " + ExceptionUtils.getFullStackTrace(e));
			e.printStackTrace();
		}

		return ticket;
	}

	/**
	 * 
	 * @param ticketID
	 * @param cc_emails
	 * @param plain_text
	 * @param attachments_exists
	 * @return
	 */
	public static Tickets updateTicket(Long ticketID, String cc_emails, String plain_text, Boolean attachments_exists)
	{
		try
		{
			// Get ticket by ticket ID
			Tickets ticket = TicketUtil.getTicketByID(ticketID);

			Long updatedTime = Calendar.getInstance().getTimeInMillis();

			ticket.cc_emails = cc_emails;
			ticket.last_updated_time = updatedTime;
			ticket.last_customer_replied_time = updatedTime;
			ticket.last_updated_by = LAST_UPDATED_BY.REQUESTER;
			ticket.last_reply_text = plain_text;
			ticket.user_replies_count += 1;

			if (!ticket.attachments_exists)
				ticket.attachments_exists = attachments_exists;

			Tickets.ticketsDao.put(ticket);

			// Update search document
			new TicketDocument().edit(ticket);

			return ticket;
		}
		catch (Exception e)
		{
			System.out.println("ExceptionUtils.getFullStackTrace(e): " + ExceptionUtils.getFullStackTrace(e));
			e.printStackTrace();
		}

		return null;
	}

	public static Long getTicketShortID(Long ticketID)
	{
		return ticketID;
	}
}