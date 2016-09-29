package com.agilecrm.ticket.entitys;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.ticket.utils.TicketCannedMessagesUtil;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;

/**
 * <code>TicketCannedMessages</code> class is a entity class for creating canned
 * messages in Ticketing.
 * 
 * <p>
 * {@link TicketCannedMessagesUtil} is a utility class which provides CRUD
 * opertions on TicketCannedMessagesUtil.
 * </p>
 * 
 * 
 * @author Sasi on 09-Oct-2015
 * 
 */
@XmlRootElement
public class TicketCannedMessages
{
	@Id
	public Long id;

	/**
	 * Stores canned message title
	 */
	public String title = "";

	public Boolean is_public = false;
	/**
	 * Stores canned message
	 */
	public String message = "";

	/**
	 * Stores ticket label keys
	 */
	@JsonIgnore
	private List<Key<TicketLabels>> labels_keys_list = new ArrayList<Key<TicketLabels>>();

	/**
	 * Stores list of label id's
	 */
	@NotSaved
	public List<Long> labels = new ArrayList<Long>();

	/**
	 * Stores last updated time
	 */
	public Long updated_time = 0L;

	/**
	 * Stores current domain user key as owner
	 */
	@JsonIgnore
	private Key<DomainUser> owner_key = null;

	/**
	 * Stores current domain user id as owner
	 */
	@NotSaved
	public Long owner_id = null;

	public TicketCannedMessages()
	{
		super();
	}

	/**
	 * Initialize DataAccessObject
	 */
	public static ObjectifyGenericDao<TicketCannedMessages> dao = new ObjectifyGenericDao<TicketCannedMessages>(
			TicketCannedMessages.class);

	@javax.persistence.PrePersist
	private void prePersist()
	{
		updated_time = Calendar.getInstance().getTimeInMillis();
		title = title.toLowerCase();
	}

	@javax.persistence.PostLoad
	private void PostLoad()
	{
		if (owner_key != null)
			owner_id = owner_key.getId();

		if (labels_keys_list != null)
		{
			for (Key<TicketLabels> key : labels_keys_list)
			{
				labels.add(key.getId());
			}
		}

	}

	@JsonIgnore
	public void setOwner_key(Key<DomainUser> owner_key)
	{
		this.owner_key = owner_key;
	}

	@JsonIgnore
	public void set_Labels(List<Key<TicketLabels>> labels_keys_list)
	{
		this.labels_keys_list = labels_keys_list;
	}

	@Override
	public int hashCode()
	{
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj)
	{
		TicketCannedMessages other = (TicketCannedMessages) obj;

		if (id == null)
		{
			if (other.id != null)
				return false;
		}
		else if (!id.equals(other.id))
			return false;

		return true;
	}

	@Override
	public String toString()
	{
		return "TicketCannedMessages [id=" + id + ", title=" + title + ", message=" + message + ", owner_key="
				+ owner_key + ", owner_id=" + owner_id + "]";
	}
}