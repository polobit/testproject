package com.agilecrm.ticket.entitys;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Unindexed;

/**
 * 
 * @author Sasi on 28-Sep-2015
 * 
 */
@XmlRootElement
@Unindexed
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
	 * Stores list of agent id's
	 */
	public List<Key<DomainUser>> agentsKeyList = new ArrayList<Key<DomainUser>>();
	
	
	public TicketGroups()
	{
		super();
	}

	/**
	 * Initialize DataAccessObject
	 */
	public static ObjectifyGenericDao<TicketGroups> ticketGroupsDao = new ObjectifyGenericDao<TicketGroups>(TicketGroups.class);
}
