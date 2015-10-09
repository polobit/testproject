package com.agilecrm.ticket.entitys;


import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.ticket.utils.TicketCannedMessagesUtil;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;


/**
 * <code>TicketCannedMessages</code> class is a entity class for creating canned messages in
 * Ticketing.
 * 
 * <p>
 * {@link TicketCannedMessagesUtil} is a utility class which provides CRUD opertions on
 * TicketCannedMessagesUtil.
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
	
	/**
	 * Stores canned message
	 */
	public String message = "";

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

	@javax.persistence.PostLoad
	private void PostLoad()
	{
		if (owner_key != null)
			owner_id = owner_key.getId();
	}

	@JsonIgnore
	public void setOwner_key(Key<DomainUser> owner_key)
	{
		this.owner_key = owner_key;
	}
}