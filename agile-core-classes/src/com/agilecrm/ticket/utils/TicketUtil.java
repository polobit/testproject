package com.agilecrm.ticket.utils;

import java.util.Calendar;
import java.util.List;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.ticket.entitys.TicketNotes;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.TicketNotes.CREATED_BY;
import com.agilecrm.ticket.entitys.TicketNotes.NOTE_TYPE;
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
	public static void createTicket(Long group_id, Boolean assigned_to_group, String requester_name, String requester_email,
			String subject, String cc_emails, String plain_text, String html_text, Source source, Boolean attachments,
			String ipAddress, CREATED_BY created_by, NOTE_TYPE note_type)
	{
		try
		{
			Tickets ticket = new Tickets(group_id, assigned_to_group, requester_name, requester_email, subject,
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

			TicketNotesUtil.createTicketNotes(key.getId(), group_id, created_by, requester_name, requester_email,
					plain_text, html_text, note_type, null);
		}
		catch (Exception e)
		{
			System.out.println("ExceptionUtils.getFullStackTrace(e): " + ExceptionUtils.getFullStackTrace(e));
			e.printStackTrace();
		}
	}
}
