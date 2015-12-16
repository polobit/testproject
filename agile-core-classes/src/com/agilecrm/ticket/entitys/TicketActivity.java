package com.agilecrm.ticket.entitys;

import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.contact.Contact;
import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * 
 * @author Sasi
 * 
 */
@XmlRootElement
public class TicketActivity extends Cursor
{
	@Id
	public Long id;

	/**
	 * Stores contact id of customer
	 */
	@JsonIgnore
	public Key<Contact> contact_key = null;

	@NotSaved
	public Long contact_id = null;

	/**
	 * Stores contact id of customer
	 */
	@JsonIgnore
	public Key<Tickets> ticket_key = null;

	@NotSaved
	public Long ticket_id = null;

	/**
	 * Key object of DomainUser.
	 */
	@NotSaved(IfDefault.class)
	private Key<DomainUser> user = null;

	/**
	 * Name of the user performing the activity.
	 */
	@NotSaved(IfDefault.class)
	private String user_name = null;

	/**
	 * The value of the unique field in the entity to identify it.
	 */
	@NotSaved(IfDefault.class)
	public String label = null;

	@NotSaved(IfDefault.class)
	public String old_data = null;

	@NotSaved(IfDefault.class)
	public String new_data = null;

	@NotSaved(IfDefault.class)
	public String changed_field = null;

	/**
	 * Time of activity performed.
	 */
	public Long created_time = 0L;

	/**
	 * Incl. for client validation. Do not remove or change.
	 */
	@NotSaved
	public String entity_type = "ticketActivity";

	/**
	 * Util attributes to send data to client when changed group
	 */
	@NotSaved
	public TicketGroups old_group = null, new_group = null;

	/**
	 * Util attributes to send data to client when changed assignee
	 */
	@NotSaved
	public DomainUser old_assignee = null, new_assignee = null;

	@NotSaved
	public Contact contact = null;

	/**
	 * Type of the activity.
	 * 
	 */
	public enum TicketActivityType
	{
		TICKET_CREATED, TICKET_DELETED, TICKET_ASSIGNED, TICKET_ASSIGNEE_CHANGED, TICKET_GROUP_CHANGED, TICKET_STATUS_CHANGE, TICKET_PRIORITY_CHANGE, TICKET_TYPE_CHANGE, TICKET_LABEL_ADD, TICKET_LABEL_REMOVE, TICKET_ASSIGNEE_REPLIED, TICKET_REQUESTER_REPLIED, TICKET_PRIVATE_NOTES_ADD, TICKET_MARKED_FAVORITE, TICKET_MARKED_UNFAVORITE, BULK_ACTION_MANAGE_LABELS, BULK_ACTION_CHANGE_ASSIGNEE, BULK_ACTION_EXECUTE_WORKFLOW, BULK_ACTION_CLOSE_TICKETS, BULK_ACTION_DELETE_TICKETS, TICKET_TAG_ADD, TICKET_TAG_REMOVE, DUE_DATE_CHANGED, TICKET_CC_EMAIL_ADD, TICKET_CC_EMAIL_REMOVE
	};

	public TicketActivityType ticket_activity_type;

	/**
	 * Util attribute to send clean activity title to client
	 */
	@NotSaved
	public String activity_title = "";

	private static ObjectifyGenericDao<TicketActivity> dao = new ObjectifyGenericDao<TicketActivity>(
			TicketActivity.class);

	public TicketActivity()
	{

	}

	public TicketActivity(TicketActivityType ticket_activity_type, Long contact_id, Long ticket_id, String old_data,
			String new_data, String changed_field)
	{
		super();

		if (contact_id != null)
			this.contact_key = new Key<Contact>(Contact.class, contact_id);

		if (contact_id != null)
			this.ticket_key = new Key<Tickets>(Tickets.class, ticket_id);

		this.old_data = old_data;
		this.new_data = new_data;
		this.changed_field = changed_field;
		this.created_time = Calendar.getInstance().getTimeInMillis();
		this.ticket_activity_type = ticket_activity_type;

		// switch (ticket_activity_type)
		// {
		// case TICKET_CREATED:
		// this.label = "Ticket Created";
		// break;
		// case TICKET_ASSIGNED:
		// this.label = label;
		// break;
		// case TICKET_ASSIGNED_CHANGED:
		// this.label = label;
		// break;
		// case TICKET_GROUP_CHANGED:
		// this.label = label;
		// break;
		// case TICKET_STATUS_CHANGE:
		// this.label = label;
		// break;
		// case TICKET_PRIORITY_CHANGE:
		// this.label = label;
		// break;
		// case TICKET_TYPE_CHANGE:
		// this.label = label;
		// break;
		// case TICKET_TAG_ADD:
		// this.label = label;
		// break;
		// case TICKET_TAG_REMOVE:
		// this.label = label;
		// break;
		// case TICKET_ASSIGNEE_REPLIED:
		// this.label = label;
		// break;
		// case TICKET_REQUESTER_REPLIED:
		// this.label = label;
		// break;
		// case TICKET_PRIVATE_NOTES_ADD:
		// this.label = "";
		// break;
		// }
	}

	/**
	 * Gets domain user with respect to owner id if exists, otherwise null.
	 * 
	 * @return Domain user object.
	 * @throws Exception
	 *             when Domain User not exists with respect to id.
	 */
	@XmlElement(name = "user")
	public DomainUser getUser() throws Exception
	{
		if (user != null)
		{
			try
			{
				return DomainUserUtil.getDomainUser(user.getId());
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}
		}

		return null;
	}

	/**
	 * Deletes entity from database
	 */
	public void delete()
	{
		dao.delete(this);
	}

	/**
	 * Saves the new entity or even updates the existing one.
	 */
	public void save()
	{
		dao.put(this);
	}

	/**
	 * called this method before activity getting saved
	 */
	@PrePersist
	private void prePersist()
	{
		if (created_time == 0L && id == null)
		{
			created_time = System.currentTimeMillis() / 1000;
		}

		if (user == null)
		{
			UserInfo userInfo = SessionManager.get();
			if (userInfo == null)
				return;
			user_name = userInfo.getName();
			user = new Key<DomainUser>(DomainUser.class, userInfo.getDomainId());
		}
	}

	@javax.persistence.PostLoad
	private void PostLoad()
	{
		if (contact_id == null)
			contact_id = contact_key.getId();

		if (ticket_id == null)
			ticket_id = ticket_key.getId();

		if (StringUtils.isBlank(activity_title))
		{
			switch (ticket_activity_type)
			{
			case TICKET_CREATED:
				this.activity_title = "Ticket created";
				break;
			case TICKET_ASSIGNED:
				this.activity_title = "Ticket assigned";
				break;
			case TICKET_ASSIGNEE_CHANGED:
				this.activity_title = "Assignee changed";
				break;
			case TICKET_GROUP_CHANGED:
				this.activity_title = "Group changed";
				break;
			case TICKET_STATUS_CHANGE:
				this.activity_title = "Status changed";
				break;
			case TICKET_PRIORITY_CHANGE:
				this.activity_title = "Priority changed";
				break;
			case TICKET_TYPE_CHANGE:
				this.activity_title = "Type changed";
				break;
			case TICKET_LABEL_ADD:
				this.activity_title = "Label added";
				break;
			case TICKET_LABEL_REMOVE:
				this.activity_title = "Label removed";
				break;
			case TICKET_ASSIGNEE_REPLIED:
				this.activity_title = "Assignee replied";
				break;
			case TICKET_REQUESTER_REPLIED:
				this.activity_title = "Requester replied";
				break;
			case TICKET_PRIVATE_NOTES_ADD:
				this.activity_title = "Note added";
				break;
			case TICKET_DELETED:
				this.activity_title = "Ticket deleted";
				break;
			case TICKET_MARKED_FAVORITE:
				this.activity_title = "Marked favorite";
				break;
			case TICKET_MARKED_UNFAVORITE:
				this.activity_title = "Marked unfavorite";
				break;
			case DUE_DATE_CHANGED:
				this.activity_title = "Due date changed";
				break;
			case TICKET_CC_EMAIL_ADD:
				this.activity_title = "CC email added";
				break;
			case TICKET_CC_EMAIL_REMOVE:
				this.activity_title = "CC email removed";
				break;
			default:
				this.activity_title = "";
			}
		}
	}

	public List<TicketActivity> getActivityByContactId(Long contact_id)
	{
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("contact_key", new Key<Contact>(Contact.class, contact_id));

		return dao.listByProperty(searchMap);
	}

	public List<TicketActivity> getActivityByTicketId(Long ticket_id)
	{
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("ticket_key", new Key<Tickets>(Tickets.class, ticket_id));

		return dao.listByPropertyAndOrder(searchMap, "-created_time");
	}
}
