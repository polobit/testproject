package com.agilecrm.ticket.utils;

import java.util.Calendar;
import java.util.List;

import com.agilecrm.ticket.entitys.TicketNotes;
import com.agilecrm.ticket.entitys.TicketNotes.CREATED_BY;
import com.agilecrm.ticket.entitys.TicketNotes.NOTE_TYPE;

/**
 * 
 * @author Sasi on 28-Sep-2015
 */
public class TicketNotesUtil
{
	public static TicketNotes createTicketNotes(Long ticket_id, Long group_id, CREATED_BY created_by, String requester_name,
			String requester_email, String original_plain_text, String original_html_text,
			NOTE_TYPE note_type, List<String> attachments_list)
	{
		TicketNotes ticketNotes = new TicketNotes(ticket_id, group_id, created_by, requester_name, requester_email, parsePlainText(original_plain_text), parseHtmlText(original_html_text),
				original_plain_text, original_html_text, note_type, attachments_list);
		
		ticketNotes.created_time = Calendar.getInstance().getTimeInMillis();
		
		TicketNotes.ticketNotesDao.put(ticketNotes);
		
		return ticketNotes;
	}

	public static String parsePlainText(String original_plain_text)
	{
		// parse plain text
		return original_plain_text;
	}

	public static String parseHtmlText(String original_html_text)
	{
		// parse plain text
		return original_html_text;
	}
}
