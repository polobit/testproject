package com.agilecrm.ticket.entitys;

import java.io.Serializable;
import java.util.Calendar;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.Key;

/**
 * <code>TicketsBackup</code> class save received ticket data in db. An entity
 * will be created when new ticket is received and it will be deleted
 * if it is successfully created in helpdesk.
 * 
 * @author Sasi
 * 
 */
@XmlRootElement
public class TicketsBackup implements Serializable
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	// Key
	@Id
	public Long id;

	public String ticketData = "";

	/**
	 * Stores epoch time when ticket is created
	 */
	public Long created_time = null;
	
	
	public TicketsBackup()
	{
		super();
	}

	/**
	 * Initialize DataAccessObject.
	 */
	public static ObjectifyGenericDao<TicketsBackup> dao = new ObjectifyGenericDao<TicketsBackup>(TicketsBackup.class);

	/**
	 * Sets entity id if it is null.
	 */
	@PrePersist
	private void prePersist()
	{
		this.created_time = Calendar.getInstance().getTimeInMillis();
	}

	public TicketsBackup(String ticketData)
	{
		super();
		this.ticketData = ticketData;
	}

	public Key<TicketsBackup> save()
	{
		System.out.println("Saving backup...");
		return dao.put(this);
	}

	public static void delete(Key<TicketsBackup> key)
	{
		if (key == null)
			return;
		
		dao.deleteKey(key);
		System.out.println("Backup deleted...");
	}
}
