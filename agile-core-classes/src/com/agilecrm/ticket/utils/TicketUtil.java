package com.agilecrm.ticket.utils;

import java.util.Calendar;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.TicketNotes.CREATED_BY;
import com.agilecrm.ticket.entitys.TicketNotes.NOTE_TYPE;
import com.agilecrm.ticket.entitys.Tickets.LAST_UPDATED_BY;
import com.agilecrm.ticket.entitys.Tickets.Priority;
import com.agilecrm.ticket.entitys.Tickets.Source;
import com.agilecrm.ticket.entitys.Tickets.Status;
import com.agilecrm.ticket.entitys.Tickets.Type;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;

/**
 * 
 * @author Sasi on 28-Sep-2015
 * 
 */
public class TicketUtil
{
	/**
	 * 
	 * @param namespace
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
	public static Tickets createTicket(String namespace, Long group_id, Boolean assigned_to_group, String requester_name, String requester_email,
			String subject, String cc_emails, String plain_text, String html_text, Source source, Boolean attachments,
			String ipAddress)
	{
		String oldNamespace = NamespaceManager.get();
		Tickets ticket = null;
		
		try
		{
			NamespaceManager.set(namespace);
			
			ticket = createTicket(group_id, assigned_to_group, requester_name, requester_email, subject, cc_emails, plain_text, html_text, source, attachments, ipAddress);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}

		return ticket;
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
	public static Tickets createTicket(Long group_id, Boolean assigned_to_group, String requester_name, String requester_email,
			String subject, String cc_emails, String plain_text, String html_text, Source source, Boolean attachments,
			String ipAddress)
	{
		Tickets ticket = null;
		
		try
		{
			 ticket = new Tickets(group_id, assigned_to_group, requester_name, requester_email, subject,
					cc_emails, plain_text, source, attachments);

			Long createTime = Calendar.getInstance().getTimeInMillis();

			ticket.created_time = createTime;
			ticket.last_updated_by = LAST_UPDATED_BY.REQUESTER;
			ticket.last_reply_text = plain_text;
			ticket.status = Status.NEW;
			ticket.type = Type.PROBLEM;
			ticket.priority = Priority.LOW;

			// Get country and city from ipaddress
			
			//Handle attachments
			
			Key<Tickets> key = Tickets.ticketsDao.put(ticket);

			System.out.println("key: " + key.getId());
		}
		catch (Exception e)
		{
			System.out.println("ExceptionUtils.getFullStackTrace(e): " + ExceptionUtils.getFullStackTrace(e));
			e.printStackTrace();
		}
		
		return ticket;
	}
}
