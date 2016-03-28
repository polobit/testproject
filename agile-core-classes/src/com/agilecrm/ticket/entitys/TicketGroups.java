package com.agilecrm.ticket.entitys;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.json.JSONArray;

import com.agilecrm.Globals;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.projectedpojos.DomainUserPartial;
import com.agilecrm.ticket.utils.TicketGroupUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;

/**
 * <code>TicketGroups</code> class is a entity class for creating Groups in
 * Ticketing.
 * 
 * <p>
 * {@link TicketGroupUtil} is a utility class which provides CRUD opertions on
 * TicketGroups.
 * </p>
 * 
 * 
 * @author Sasi on 28-Sep-2015
 * 
 */
@XmlRootElement
@Cached
public class TicketGroups
{
	// Key
	@Id
	public Long id;

	/**
	 * Stores ticket group name i.e support, sales etc
	 */
	public String group_name = "";

	/**
	 * Stores last Group edited time
	 */
	public Long updated_time = 0L;

	/**
	 * Stores list of Domain User IDs
	 */
	@JsonIgnore
	private List<Key<DomainUser>> agents_key_list = new ArrayList<Key<DomainUser>>();

	/**
	 * Stores list of agent id's
	 */
	@NotSaved
	public List<Long> agents_keys = new ArrayList<Long>();

	/**
	 * Stores current domain user key as owner.
	 */
	@JsonIgnore
	private Key<DomainUser> owner_key = null;

	/**
	 * Stores current domain user key as owner.
	 */
	@NotSaved
	public Long owner_id = null;

	/**
	 * Stores current domain user key as owner.
	 */
	public Boolean is_default = false;

	/**
	 * Stores group forwarding email
	 */
	@NotSaved
	public String group_email = "";

	/**
	 * Stores group users list
	 */
	@NotSaved
	public List<DomainUserPartial> group_users = null;

	public TicketGroups()
	{
		super();
	}

	/**
	 * Initialize DataAccessObject
	 */
	public static ObjectifyGenericDao<TicketGroups> ticketGroupsDao = new ObjectifyGenericDao<TicketGroups>(
			TicketGroups.class);

	/**
	 * 
	 * @return
	 */
	public TicketGroups save()
	{
		this.setOwner_key(DomainUserUtil.getCurentUserKey());
		this.updated_time = Calendar.getInstance().getTimeInMillis();

		TicketGroups.ticketGroupsDao.put(this);

		return this;
	}

	/**
	 * 
	 * @param groupIDsArray
	 */
	public static void delete(JSONArray groupIDsArray)
	{
		TicketGroups.ticketGroupsDao.deleteBulkByIds(groupIDsArray);
	}

	@javax.persistence.PostLoad
	private void PostLoad()
	{
		if (agents_key_list != null)
		{
			for (Key<DomainUser> key : agents_key_list)
			{
				agents_keys.add(key.getId());
			}
		}

		String temp = String.format(Globals.INBOUND_EMAIL_SUFFIX_NEW, NamespaceManager.get());
		group_email = group_name + "+" + temp;
	}

	@JsonIgnore
	public void setAgents_key_list(List<Key<DomainUser>> agents_key_list)
	{
		this.agents_key_list = agents_key_list;
	}

	@JsonIgnore
	public void setOwner_key(Key<DomainUser> owner_key)
	{
		this.owner_key = owner_key;
	}

	@Override
	public String toString()
	{
		return "TicketGroups [id=" + id + ", group_name=" + group_name + "]";
	}

	@Override
	public boolean equals(Object obj)
	{
		if (this == null || obj == null)
			return false;

		TicketGroups group = (TicketGroups) obj;

		return (this.id.longValue() == group.id.longValue());
	}

}
