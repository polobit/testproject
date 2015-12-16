package com.agilecrm.ticket.entitys;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

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
public class Tickets extends Cursor
{
	// Key
	@Id
	public Long id;

	/**
	 * Stores ticket group id to which it belongs
	 */
	@JsonIgnore
	public Key<TicketGroups> group_id = null;

	/**
	 * Util attribute to send group id to client
	 */
	@NotSaved
	public Long groupID = null;

	/**
	 * Util attribute to send group id to client
	 */
	@NotSaved
	public TicketGroups group = null;

	/**
	 * Stores true if ticket is assigned to a group
	 */
	public Boolean assigned_to_group = true;

	/**
	 * Stores user ID to whom ticket is assigned
	 */
	@JsonIgnore
	public Key<DomainUser> assignee_id = null;

	/**
	 * Util attribute to send assignee id to client
	 */
	@NotSaved
	public Long assigneeID = null;

	/**
	 * Stores epoch time when ticket is assigned
	 */
	public Long assigned_time = 0L;

	/**
	 * Stores epoch time of due date
	 */
	public Long due_time = 0L;

	/**
	 * Stores epoch time when ticket is closed
	 */
	public Long closed_time = 0L;

	/**
	 * Util attribute to domain user obj
	 */
	@NotSaved
	public DomainUser assignee = null;

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
	@JsonIgnore
	public Key<Contact> contact_key = null;

	@NotSaved
	public Long contactID = null;

	/**
	 * Stores contact id of customer
	 */
	public String short_id = "";

	/**
	 * Stores ticket subject
	 */
	public String subject = "";

	/**
	 * Stores CC email addresses if ticket have any
	 */
	public List<String> cc_emails = new ArrayList<String>();

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
		NEW, OPEN, PENDING, CLOSED
	};

	public static enum Type
	{
		INCIDENT, QUESTION, TASK, PROBLEM
	};

	public static enum Priority
	{
		LOW(0), MEDIUM(1), HIGH(2);

		private int code;

		private Priority(int code)
		{
			this.code = code;
		}

		public int getCode()
		{
			return code;
		}
	};

	public static enum Source
	{
		EMAIL, WEB_FORM, NEW_TICKET_DASHBOARD
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
	 * Stores true if ticket is favorite
	 */
	public Boolean is_favorite = false;

	/**
	 * Stores true if ticket is spam
	 */
	public Boolean is_spam = false;

	/**
	 * Stores true if ticket is deleted from client
	 */
	public String requester_ip_address = "";

	/**
	 * Stores ticket labels
	 */
	@NotSaved(IfDefault.class)
	@Embedded
	@JsonIgnore
	public List<Key<TicketLabels>> labels_keys_list = new ArrayList<Key<TicketLabels>>();

	/**
	 * Util attribute to get html content in new ticket
	 */
	@NotSaved
	public String html_text = "";

	/**
	 * Util attribute to save entity type
	 */
	@NotSaved
	public String entity_type = "tickets";

	/**
	 * Stores list of attachments URL's saved in Google cloud
	 */
	@NotSaved
	public List<TicketDocuments> attachments_list = new ArrayList<TicketDocuments>();

	/**
	 * Stores ticket labels
	 */
	@NotSaved
	public List<Long> labels = new ArrayList<Long>();

	/**
	 * Default constructor
	 */
	public Tickets()
	{

	}

	/**
	 * Default constructor
	 */
	public Tickets(Long id)
	{
		this.id = id;
	}

	@javax.persistence.PostLoad
	private void PostLoad()
	{
		if (group_id != null)
			groupID = group_id.getId();

		if (assignee_id != null)
			assigneeID = assignee_id.getId();

		if (contact_key != null)
			contactID = contact_key.getId();

		if (labels_keys_list != null)
		{
			for (Key<TicketLabels> key : labels_keys_list)
			{
				labels.add(key.getId());
			}
		}

	}

	/**
	 * Initialize DataAccessObject.
	 */
	public static ObjectifyGenericDao<Tickets> ticketsDao = new ObjectifyGenericDao<Tickets>(Tickets.class);

	public Key<TicketGroups> getGroup_id()
	{
		return group_id;
	}

	public Key<DomainUser> getAssignee_id()
	{
		return assignee_id;
	}

	public Contact getContact()
	{
		if (this.contactID != null)
			return ContactUtil.getContact(this.contactID);

		return null;
	}
}
