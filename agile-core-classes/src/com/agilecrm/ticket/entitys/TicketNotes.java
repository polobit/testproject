package com.agilecrm.ticket.entitys;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.ticket.entitys.Tickets.LAST_UPDATED_BY;
import com.googlecode.objectify.annotation.Unindexed;

/**
 * 
 * @author Sasi on 28-Sep-2015
 * 
 */
@XmlRootElement
@Unindexed
public class TicketNotes
{
	// Key
	@Id
	public Long id;
	
	/**
	 * Stores ticket id
	 */
	public Long ticket_id = 0L;
	
	/**
	 * Stores ticket group id to which it belongs
	 */
	public Long group_id = 0L;

	/**
	 * Stores user ID to whom ticket is assigned
	 */
	public Long assignee_id = 0L;
	
	public static enum CREATED_BY
	{
		AGENT, REQUESTER
	};
	
	/**
	 * Stores last updated by text either agent or customer
	 */
	public CREATED_BY created_by = CREATED_BY.REQUESTER;
	
	/**
	 * Stores name of customer who created ticket
	 */
	public String requester_name = "";

	/**
	 * Stores email of customer who created ticket
	 */
	public String requester_email = "";
	
	/**
	 * Stores epoch time when notes is created
	 */
	public Long created_time = 0L;
	
	/**
	 * Stores description exists in case of Rules & Macros
	 */
	public String event_description = "";
	
	/**
	 * Stores notes content in plain text format
	 */
	public String plain_text = "";
	
	/**
	 * Stores notes content in html text format
	 */
	public String html_text = "";
	
	/**
	 * Stores original notes content in plain text format
	 */
	public String original_plain_text = "";
	
	/**
	 * Stores original notes content in html text format
	 */
	public String original_html_text = "";
	
	public static enum NOTE_TYPE
	{
		PUBLIC, PRIVATE
	};

	/**
	 * Stores type of notes
	 */
	public NOTE_TYPE note_type = NOTE_TYPE.PUBLIC;
	
	
	/**
	 * Stores list of attachments URL's saved in Google cloud
	 */
	public List<String> attachments_list = new ArrayList<String>();
	
	/**
	 * Stores requested viewed time in epoch format
	 */
	public Long requester_viewed_time = 0L;

	/**
	 * Default constructor
	 */
	public TicketNotes()
	{
		super();
	}
	

	public TicketNotes(Long ticket_id, Long group_id, CREATED_BY created_by, String requester_name,
			String requester_email, String plain_text, String html_text,
			String original_plain_text, String original_html_text, NOTE_TYPE note_type, List<String> attachments_list)
	{
		super();
		this.ticket_id = ticket_id;
		this.group_id = group_id;
		this.created_by = created_by;
		this.requester_name = requester_name;
		this.requester_email = requester_email;
		this.plain_text = plain_text;
		this.html_text = html_text;
		this.original_plain_text = original_plain_text;
		this.original_html_text = original_html_text;
		this.note_type = note_type;
		this.attachments_list = attachments_list;
	}


	/**
	 * Initialize DataAccessObject
	 */
	public static ObjectifyGenericDao<TicketNotes> ticketNotesDao = new ObjectifyGenericDao<TicketNotes>(TicketNotes.class);
}
