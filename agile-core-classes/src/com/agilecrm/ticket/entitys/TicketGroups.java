package com.agilecrm.ticket.entitys;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.Globals;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.ticket.utils.TicketGroupUtil;
import com.agilecrm.user.DomainUser;
import com.campaignio.urlshortener.util.Base62;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;
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
	 * Stores current domain user key as owner.
	 */
	@NotSaved
	public String group_email = "";

	public TicketGroups()
	{
		super();
	}

	/**
	 * Initialize DataAccessObject
	 */
	public static ObjectifyGenericDao<TicketGroups> ticketGroupsDao = new ObjectifyGenericDao<TicketGroups>(
			TicketGroups.class);

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

		group_email = NamespaceManager.get() + "+" + Base62.fromDecimalToOtherBase(62, this.id) + Globals.INBOUND_EMAIL_SUFFIX;
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
}
