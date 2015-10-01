package com.agilecrm.ticket.entitys;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;

/**
 * <code>TicketNotes</code> class contains Tickets sent by requester and agent.
 * 
 * @author Sasi on 28-Sep-2015
 * 
 */
@XmlRootElement
public class TicketNotes
{
	// Key
	@Id
	public Long id;

	/**
	 * Stores ticket id
	 */
	public Key<Tickets> ticket_key = null;

	/**
	 * Util attribute to send ticket id to client
	 */
	@NotSaved
	public Long ticket_id = null;

	/**
	 * Stores ticket group id to which it belongs
	 */
	public Key<TicketGroups> group_key = null;

	/**
	 * Util attribute to send group id to client
	 */
	@NotSaved
	public Long group_id = null;

	/**
	 * Stores user ID to whom ticket is assigned
	 */
	public Key<DomainUser> assignee_key = null;

	/**
	 * Util attribute to send assignee id to client
	 */
	@NotSaved
	public Long assignee_id = null;

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
			String requester_email, String plain_text, String html_text, String original_plain_text,
			String original_html_text, NOTE_TYPE note_type, List<String> attachments_list)
	{
		super();
		this.ticket_key = new Key<Tickets>(Tickets.class, ticket_id);
		this.group_key = new Key<TicketGroups>(TicketGroups.class, group_id);
		this.created_by = created_by;
		this.requester_name = requester_name;
		this.requester_email = requester_email;
		this.plain_text = plain_text;
		this.html_text = html_text;
		this.original_plain_text = original_plain_text;
		this.original_html_text = original_html_text;
		this.note_type = note_type;
		this.attachments_list = attachments_list;
		this.created_time = Calendar.getInstance().getTimeInMillis();
	}

	@javax.persistence.PostLoad
	private void PostLoad()
	{
		if (ticket_key != null)
			ticket_id = ticket_key.getId();

		if (group_key != null)
			group_id = group_key.getId();

		if (assignee_key != null)
			assignee_id = assignee_key.getId();
	}

	/**
	 * Initialize DataAccessObject
	 */
	public static ObjectifyGenericDao<TicketNotes> ticketNotesDao = new ObjectifyGenericDao<TicketNotes>(
			TicketNotes.class);
}
