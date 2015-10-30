package com.agilecrm.ticket.entitys;

import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * 
 * @author Sasi
 * 
 */
@XmlRootElement
public class TicketActivity
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

	/**
	 * Type of the activity.
	 * 
	 */
	public enum TicketActivityType
	{
		TICKET_CREATED, TICKET_DELETED, TICKET_ASSIGNED, TICKET_ASSIGNEE_CHANGED, TICKET_GROUP_CHANGED, TICKET_STATUS_CHANGE, TICKET_PRIORITY_CHANGE, TICKET_TYPE_CHANGE, TICKET_TAG_ADD, TICKET_TAG_REMOVE, TICKET_ASSIGNEE_REPLIED, TICKET_REQUESTER_REPLIED, TICKET_PRIVATE_NOTES_ADD, TICKET_MARKED_FAVORITE, TICKET_MARKED_UNFAVORITE
	};

	public TicketActivityType ticket_activity_type;

	private static ObjectifyGenericDao<TicketActivity> dao = new ObjectifyGenericDao<TicketActivity>(
			TicketActivity.class);

	public TicketActivity()
	{

	}

	public TicketActivity(TicketActivityType ticket_activity_type, Long contact_id, Long ticket_id, String old_data,
			String new_data, String changed_field)
	{
		super();
		this.contact_key = new Key<Contact>(Contact.class, contact_id);
		this.ticket_key = new Key<Tickets>(Tickets.class, ticket_id);
		this.old_data = old_data;
		this.new_data = new_data;
		this.changed_field = changed_field;
		this.created_time = Calendar.getInstance().getTimeInMillis();
		this.ticket_activity_type = ticket_activity_type;

//		switch (ticket_activity_type)
//		{
//		case TICKET_CREATED:
//			this.label = "Ticket Created";
//			break;
//		case TICKET_ASSIGNED:
//			this.label = label;
//			break;
//		case TICKET_ASSIGNED_CHANGED:
//			this.label = label;
//			break;
//		case TICKET_GROUP_CHANGED:
//			this.label = label;
//			break;
//		case TICKET_STATUS_CHANGE:
//			this.label = label;
//			break;
//		case TICKET_PRIORITY_CHANGE:
//			this.label = label;
//			break;
//		case TICKET_TYPE_CHANGE:
//			this.label = label;
//			break;
//		case TICKET_TAG_ADD:
//			this.label = label;
//			break;
//		case TICKET_TAG_REMOVE:
//			this.label = label;
//			break;
//		case TICKET_ASSIGNEE_REPLIED:
//			this.label = label;
//			break;
//		case TICKET_REQUESTER_REPLIED:
//			this.label = label;
//			break;
//		case TICKET_PRIVATE_NOTES_ADD:
//			this.label = "";
//			break;
//		}
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

		return dao.listByProperty(searchMap);
	}
}
