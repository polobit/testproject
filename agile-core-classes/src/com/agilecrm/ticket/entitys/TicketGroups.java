package com.agilecrm.ticket.entitys;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.ticket.utils.TicketGroupUtil;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Unindexed;

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
	public List<Key<DomainUser>> agents_key_list = new ArrayList<Key<DomainUser>>();
	
	/**
	 * Stores list of agent id's
	 */
	@NotSaved
	public List<String> agents_keys = new ArrayList<String>();

	 /**
     * Stores current domain user key as owner.
     */
    public Key<DomainUser> owner_key = null;
    
	public TicketGroups()
	{
		super();
	}

	/**
	 * Initialize DataAccessObject
	 */
	public static ObjectifyGenericDao<TicketGroups> ticketGroupsDao = new ObjectifyGenericDao<TicketGroups>(
			TicketGroups.class);
}
