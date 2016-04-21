package com.agilecrm.ticket.entitys;

import java.io.Serializable;
import java.util.Calendar;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import org.json.JSONObject;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;

/**
 * <code>TicketsBackup</code> class save received ticket data in db. An entity
 * will be created when new ticket is received and it will be deleted if it is
 * successfully created in helpdesk.
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

	public String ticket_data = "";

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
		this.ticket_data = ticketData;
	}

	public Key<TicketsBackup> save()
	{
		String namespace = NamespaceManager.get();

		System.out.println("Saving backup...");

		NamespaceManager.set("");

		try
		{
			return dao.put(this);
		}
		finally
		{
			NamespaceManager.set(namespace);
		}
	}

	public static void delete(Key<TicketsBackup> key)
	{
		if (key == null)
			return;

		String namespace = NamespaceManager.get();

		NamespaceManager.set("");

		try
		{
			dao.deleteKey(key);
			System.out.println("Backup deleted...");
		}
		finally
		{
			NamespaceManager.set(namespace);
		}
	}

	public JSONObject getData(Long id) throws Exception
	{
		String namespace = NamespaceManager.get();

		NamespaceManager.set("");

		try
		{
			TicketsBackup backup = dao.get(id);

			System.out.println("Record fetched..");

			return new JSONObject(backup.ticket_data);
		}
		finally
		{
			NamespaceManager.set(namespace);
		}
	}
}
