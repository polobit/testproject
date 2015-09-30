package com.agilecrm.ticket.entitys;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Unindexed;

/**
 * <code>Tickets</code> root class for Ticketing. Every webhook returned from
 * Mandrill will be saved as Ticket in Tickets table.
 * 
 * <p>
 * Tickets inherits {@link Cursor} to include Cursor class variables within this
 * class.
 * </p>
 * 
 * <p>
 * {@link TicketsUtil} class contains utility methods for performing CRUD
 * operations on Tickets.
 * </p>
 * 
 * @author Sasi on 28-Sep-2015
 * @see {@link TicketsUtil}
 * 
 */
@XmlRootElement
@Unindexed
public class Tickets extends Cursor
{
	// Key
	@Id
	public Long id;

	/**
	 * Stores ticket group id to which it belongs
	 */
	public Key<TicketGroups> group_id = null;

	/**
	 * Stores true if ticket is assigned to a group
	 */
	public Boolean assigned_to_group = true;

	/**
	 * Stores user ID to whom ticket is assigned
	 */
	public Key<DomainUser> assignee_id = null;

	/**
	 * Stores name of customer who created ticket
	 */
	public String requester_name = "";

	/**
	 * Stores email of customer who created ticket
	 */
	public String requester_email = "";

	/**
	 * Stores contact id of customer
	 */
	public String contact_id = "";

	/**
	 * Stores contact id of customer
	 */
	public String short_id = "";

	/**
	 * Stores ticket subject
	 */
	public String subject = "";

	/**
	 * Stores CC email addresses if ticke have any
	 */
	public String cc_emails = "";

	/**
	 * Stores epoch time when ticket is created
	 */
	public Long created_time = 0L;

	/**
	 * Stores epoch time when ticket is last updated
	 */
	public Long last_updated_time = 0L;

	public static enum LAST_UPDATED_BY
	{
		AGENT, REQUESTER
	};

	/**
	 * Stores last updated by text either agent or customer
	 */
	public LAST_UPDATED_BY last_updated_by = LAST_UPDATED_BY.REQUESTER;

	/**
	 * Stores epoch time when agent is first replied
	 */
	public Long first_replied_time = 0L;

	/**
	 * Stores epoch time of agent's last reply
	 */
	public Long last_agent_replied_time = 0L;

	/**
	 * Stores epoch time of customer's last reply
	 */
	public Long last_customer_replied_time = 0L;

	/**
	 * Stores first created plain text ticket content
	 */
	public String first_notes_text = "";

	/**
	 * Stores last created plain text ticket content
	 */
	public String last_reply_text = "";

	public static enum Status
	{
		NEW, OPEN, CLOSED
	};

	public static enum Type
	{
		INCIDENT, QUESTION, TASK, PROBLEM
	};

	public static enum Priority
	{
		LOW, MEDIUM, HIGH
	};

	public static enum Source
	{
		EMAIL, WEB_FORM
	};

	/**
	 * Stores ticket status i.e NEW, OPEN or CLOSED
	 */
	public Status status = Status.NEW;

	/**
	 * Stores ticket type i.e INCIDENT, QUESTION, TASK or PROBLEM
	 */
	public Type type = Type.PROBLEM;

	/**
	 * Stores ticket priority i.e LOW, MEDIUM or HIGH
	 */
	public Priority priority = Priority.LOW;

	/**
	 * Stores ticket created source EMAIL or WEB_FORM
	 */
	public Source source = Source.EMAIL;

	/**
	 * Stores customer country to generate country wise reports
	 */
	public String country = "";
	public String city = "";

	/**
	 * Stores number of times public notes were added by both Agent and
	 * Customer. Used to generate first contact resolution report.
	 */
	public Integer user_replies_count = 1;

	/**
	 * Stores true if any of its notes have attachments
	 */
	public Boolean attachments_exists = false;

	/**
	 * Stores true if ticket is deleted from client
	 */
	public Boolean is_archived = false;

	/**
	 * Stores true if ticket is deleted from client
	 */
	public String requester_ip_address = "";

	/**
	 * Default constructor
	 */
	public Tickets()
	{

	}

	public Tickets(Long group_id, Boolean assigned_to_group, String requester_name, String requester_email,
			String subject, String cc_emails, String first_notes_text, Source source, Boolean attachments_exists)
	{
		super();
		this.group_id = new Key<TicketGroups>(TicketGroups.class, group_id);
		this.assigned_to_group = assigned_to_group;
		this.requester_name = requester_name;
		this.requester_email = requester_email;
		this.subject = subject;
		this.cc_emails = cc_emails;
		this.first_notes_text = first_notes_text;
		this.source = source;
		this.attachments_exists = attachments_exists;
	}

	/**
	 * Initialize DataAccessObject.
	 */
	public static ObjectifyGenericDao<Tickets> ticketsDao = new ObjectifyGenericDao<Tickets>(Tickets.class);
}
