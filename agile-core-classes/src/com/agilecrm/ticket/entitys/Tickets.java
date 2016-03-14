package com.agilecrm.ticket.entitys;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.map.ObjectMapper;

import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.projectedpojos.ContactPartial;
import com.agilecrm.projectedpojos.DomainUserPartial;
import com.agilecrm.projectedpojos.TicketGroupsPartial;
import com.agilecrm.search.document.TicketsDocument;
import com.agilecrm.session.SessionManager;
import com.agilecrm.ticket.utils.TicketGroupUtil;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.CacheUtil;
import com.agilecrm.workflows.triggers.util.TicketTriggerUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;
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
public class Tickets extends Cursor implements Serializable
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

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
	public TicketGroupsPartial group = null;

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
	public Long assigned_time = null;

	/**
	 * Stores epoch time of due date
	 */
	public Long due_time = null;

	/**
	 * Stores epoch time when ticket is closed
	 */
	public Long closed_time = null;

	/**
	 * Util attribute to domain user obj
	 */
	@NotSaved
	public DomainUserPartial assignee = null;

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
	public Long created_time = null;

	/**
	 * Stores epoch time when ticket is last updated
	 */
	public Long last_updated_time = null;

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
	public Long first_replied_time = null;

	/**
	 * Stores epoch time of agent's last reply
	 */
	public Long last_agent_replied_time = null;

	/**
	 * Stores epoch time of customer's last reply
	 */
	public Long last_customer_replied_time = null;

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

	public static enum CreatedBy
	{
		CUSTOMER, AGENT
	};

	/**
	 * Stores who created the ticket
	 */
	public CreatedBy created_by = CreatedBy.CUSTOMER;

	/**
	 * Stores customer country to generate country wise reports
	 */
	// public String country = "";
	// public String city = "";

	/**
	 * Stores number of times public notes were added by both Agent and
	 * Customer. Used to generate first contact resolution report.
	 */
	public Integer user_replies_count = 1;

	/**
	 * Stores number of times public notes were added by both Agent and
	 * Customer. Used to generate first contact resolution report.
	 */
	public Integer no_of_reopens = 0;

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
	 * Util attribute using when creating new ticket from admin dashboard.
	 */
	@NotSaved
	public List<Long> contact_ids = new ArrayList<Long>();

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

	/**
	 * Stores the property names in final variables, for reading flexibility of
	 * the property values
	 */
	public static final String CREATE_TIME = "created_time";
	public static final String LAST_UPDATED_TIME = "last_updated_time";
	public static final String CLOSED_TIME = "closed_time";

	/**
	 * 
	 * @param group_id
	 * @param assignee_id
	 * @param requester_name
	 * @param requester_email
	 * @param subject
	 * @param cc_emails
	 * @param plain_text
	 * @param status
	 * @param type
	 * @param priority
	 * @param source
	 * @param attachments
	 * @param ipAddress
	 * @param tags
	 * @return
	 */
	public Tickets(Long group_id, Long assignee_id, String requester_name, String requester_email, String subject,
			List<String> cc_emails, String plain_text, Status status, Type type, Priority priority, Source source,
			CreatedBy createdBy, Boolean attachments, String ipAddress, List<Key<TicketLabels>> labelsKeysList)
	{
		try
		{
			this.group_id = new Key<TicketGroups>(TicketGroups.class, group_id);
			this.groupID = group_id;
			this.labels_keys_list = labelsKeysList;
			this.status = status;
			this.type = type;
			this.priority = priority;
			this.source = source;
			this.created_by = createdBy;

			Long epochTime = Calendar.getInstance().getTimeInMillis();

			if (assignee_id != null)
			{
				this.assignee_id = new Key<DomainUser>(DomainUser.class, assignee_id);
				this.assigned_time = epochTime;
			}
			else
				this.assigned_to_group = true;

			this.requester_name = requester_name;
			this.requester_email = requester_email;
			this.subject = subject;
			this.cc_emails = cc_emails;
			this.first_notes_text = plain_text;
			this.last_reply_text = plain_text;
			this.attachments_exists = attachments;

			this.created_time = epochTime;
			this.last_updated_time = epochTime;
			this.last_customer_replied_time = epochTime;
			this.last_updated_by = LAST_UPDATED_BY.REQUESTER;
			this.requester_ip_address = ipAddress;
			this.user_replies_count = 1;

			/**
			 * Checking if new ticket requester is exists in Contacts
			 */
			Contact contact = ContactUtil.searchContactByEmail(requester_email);

			if (contact == null)
				contact = ContactUtil.createContact(requester_name, requester_email);

			this.contact_key = new Key<Contact>(Contact.class, contact.id);
			this.contactID = contact.id;

			// Save ticket
			this.saveWithNewID();

			// Create search document
			new TicketsDocument().add(this);

			// Logging ticket created activity
			ActivityUtil.createTicketActivity(ActivityType.TICKET_CREATED, this.contactID, this.id, "", plain_text,
					"last_reply_text");

			// Execute triggers
			TicketTriggerUtil.executeTriggerForNewTicket(this);
		}
		catch (Exception e)
		{
			System.out.println("ExceptionUtils.getFullStackTrace(e): " + ExceptionUtils.getFullStackTrace(e));
			e.printStackTrace();
		}
	}

	/**
	 * Updates existing {@link Tickets} as well as text search document
	 * {@link TicketsDocument}
	 * 
	 * @param ticketID
	 * @param cc_emails
	 * @param last_reply_plain_text
	 * @param attachments_exists
	 * @return {@link Tickets} object
	 * @throws EntityNotFoundException
	 */
	public Tickets updateTicketAndSave(List<String> cc_emails, String last_reply_plain_text,
			LAST_UPDATED_BY last_updated_by, Long updated_time, Long customer_replied_time,
			Long last_agent_replied_time, Boolean attachments_exists, Boolean isTicketClosed)
	{
		Long currentTime = Calendar.getInstance().getTimeInMillis();

		if (this.user_replies_count == 1)
			this.first_replied_time = currentTime;

		boolean isPublicNotes = (this.last_updated_time == updated_time) ? false : true, assigneeChanged = false;

		// Increment only when public notes is added
		if (isPublicNotes)
			this.user_replies_count += 1;

		this.cc_emails = cc_emails;
		this.last_updated_time = updated_time;
		this.last_updated_by = last_updated_by;
		this.last_reply_text = last_reply_plain_text;

		if (customer_replied_time != null)
			this.last_customer_replied_time = customer_replied_time;

		if (last_agent_replied_time != null)
			this.last_agent_replied_time = last_agent_replied_time;

		if (!this.attachments_exists)
			this.attachments_exists = attachments_exists;

		Key<DomainUser> domainUserKey = DomainUserUtil.getCurentUserKey();

		if (last_updated_by == LAST_UPDATED_BY.AGENT)
		{
			// Checking if assignee is replying to new ticket for first time
			if (this.status == Status.NEW || this.assignee_id == null)
			{
				// Logging ticket assigned activity
				ActivityUtil.createTicketActivity(ActivityType.TICKET_ASSIGNED, this.contactID, this.id, "",
						SessionManager.get().getName(), "assigneeID");
			}
			else
			{
				if (this.assignee_id != null && this.assignee_id.getId() != domainUserKey.getId())
				{
					// Log assignee changed activity
					ActivityUtil.createTicketActivity(ActivityType.TICKET_ASSIGNEE_CHANGED, this.contactID, this.id,
							"", SessionManager.get().getName(), "assigneeID");

					assigneeChanged = true;
				}
			}

			// Set current user as ticket assignee
			this.assignee_id = domainUserKey;
			this.assigneeID = domainUserKey.getId();
			this.assigned_time = currentTime;
			this.assigned_to_group = false;
		}

		Status oldStatus = this.status;

		if (isTicketClosed)
		{
			this.status = Status.CLOSED;
			this.closed_time = currentTime;
		}
		else
			this.status = (last_updated_by == LAST_UPDATED_BY.REQUESTER) ? Status.OPEN : Status.PENDING;

		// If status if closed then incr. no of re-opens attr.
		if (oldStatus == Status.CLOSED)
		{
			this.no_of_reopens += 1;
			this.closed_time = null;
		}

		if (oldStatus != this.status)
			// Logging status changed activity
			ActivityUtil.createTicketActivity(ActivityType.TICKET_STATUS_CHANGE, this.contactID, this.id,
					oldStatus.toString(), this.status.toString(), "status");

		// // Logging public notes activity
		// if (isPublicNotes)
		// {
		// ActivityType activityType = (last_updated_by ==
		// LAST_UPDATED_BY.REQUESTER) ? ActivityType.TICKET_REQUESTER_REPLIED
		// : ActivityType.TICKET_ASSIGNEE_REPLIED;
		//
		// ActivityUtil.createTicketActivity(activityType, this.contactID,
		// this.id, "", last_reply_plain_text,
		// "html_text");
		// }

		this.save();

		if (assigneeChanged)
			TicketTriggerUtil.executeTriggerForAssigneeChanged(this);

		if (this.status == Status.CLOSED)
			TicketTriggerUtil.executeTriggerForClosedTicket(this);

		return this;
	}

	public Tickets save()
	{
		// Updating ticket entity
		Tickets.ticketsDao.put(this);

		// Updating text search data
		new TicketsDocument().edit(this);

		return this;
	}

	/**
	 * Saves the ticket object with a id which is just +1 increment to last
	 * ticket id.
	 */
	public Key<Tickets> saveWithNewID() throws Exception
	{
		if (this.id != null)
			return ticketsDao.put(this);

		String namespace = NamespaceManager.get(), syncKey = namespace + "_tickets_lock";

		boolean lockAcquired = false;

		Long ticketsCount = null;

		try
		{
			lockAcquired = acquireLock(syncKey);

			ticketsCount = (Long) CacheUtil.getCache(namespace + "_tickets_count");

			// Checking if ticket count is null or not
			if (ticketsCount == null)
			{
				List<Tickets> tickets = ticketsDao.fetchAllByOrder(1, "", null, false, true, "-created_time");

				ticketsCount = (tickets == null || tickets.size() == 0) ? 0l : tickets.get(0).id;
			}

			// Increment ticket id and assign to new ticket
			this.id = ++ticketsCount;

			// Update new value in memcache
			CacheUtil.setCache(namespace + "_tickets_count", ticketsCount);

			// Saving ticket
			return ticketsDao.put(this);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			e.printStackTrace();
		}
		finally
		{
			if (lockAcquired)
				decrement(syncKey);
		}

		return null;
	}

	/**
	 * Enabling lock on memcache key
	 * 
	 * Source:
	 * http://stackoverflow.com/questions/14907908/google-app-engine-how-
	 * to-make-synchronized-actions-using-memcache-or-datastore
	 * 
	 * @param syncKey
	 * @return
	 */
	public boolean acquireLock(String syncKey)
	{
		MemcacheService memcacheService = MemcacheServiceFactory.getMemcacheService();

		while (true)
		{
			if (memcacheService.increment(syncKey, 1L, 0L) == 1L)
				return true;

			try
			{
				System.out.println("Waiting for acquiring lock.");
				Thread.sleep(500L);
			}
			catch (InterruptedException e)
			{
				e.printStackTrace();
				System.out.println(ExceptionUtils.getFullStackTrace(e));
			}
		}
	}

	public static void decrement(String syncKey)
	{
		MemcacheServiceFactory.getMemcacheService().put(syncKey, 0l);
	}

	/**
	 * Sets entity id if it is null.
	 */
	@PrePersist
	private void prePersist()
	{
		if (id != null)
		{

		}
	}

	@javax.persistence.PostLoad
	private void postLoad()
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

	public ContactPartial getContact()
	{
		if (this.contactID != null)
		{
			List<Key<Contact>> keys = new ArrayList<Key<Contact>>();
			keys.add(this.contact_key);
			
			return ContactUtil.getPartialContacts(keys).get(0);
		}

		return null;
	}

	public TicketGroupsPartial getGroup()
	{
		return TicketGroupUtil.getPartialGroupByID(group_id.getId());
	}

	public DomainUserPartial getAssignee()
	{
		if (assignee_id != null)
		{
			return DomainUserUtil.getPartialDomainUser(assignee_id.getId());
		}

		return null;
	}

	@Override
	public String toString()
	{
		try
		{
			return new ObjectMapper().writeValueAsString(this);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}

		return "Tickets []";
	}

}
