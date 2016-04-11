package com.agilecrm.ticket.entitys;

import javax.persistence.Id;

import org.codehaus.jackson.map.ObjectMapper;

import com.agilecrm.AllDomainStats;
import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;

/**
 * 
 * @author Sasi
 * 
 */
public class TicketStats
{
	/**
	 * All Domain Stats Id
	 */
	@Id
	private Long id;

	/**
	 * Created Time
	 */
	@Indexed
	private Long created_time = 0L;

	private Long groups = 0L;
	private Long labels = 0L;
	private Long canned_responses = 0L;
	private Long views = 0L;
	private Long tickets_received = 0l;

	/**
	 * Stores the property names in final variables, for reading flexibility of
	 * the property values
	 */
	public static final String GROUPS_COUNT = "groups";
	public static final String LABELS_COUNT = "labels";
	public static final String CANNED_RESPONSES = "canned_responses";
	public static final String VIEW_COUNT = "views";
	public static final String TICKETS_COUNT = "tickets_received";

	/**
	 * ObjectifyDAO
	 */
	public static ObjectifyGenericDao<TicketStats> ticketStatsdao = new ObjectifyGenericDao<TicketStats>(
			TicketStats.class);

	public TicketStats()
	{
		super();
	}

	public TicketStats(Long created_time)
	{
		this.created_time = created_time;
	}

	/**
	 * Saves a Stats Report in the database
	 */
	public void save()
	{
		String currentNameSpace = NamespaceManager.get();
		NamespaceManager.set("");

		try
		{
			ticketStatsdao.put(this);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			NamespaceManager.set(currentNameSpace);
		}
	}

	public void incrementField(String fieldName)
	{
		switch (fieldName)
		{
			case TicketStats.CANNED_RESPONSES:
				this.canned_responses++;
				break;
			case TicketStats.GROUPS_COUNT:
				this.groups++;
				break;
			case TicketStats.LABELS_COUNT:
				this.labels++;
				break;
			case TicketStats.TICKETS_COUNT:
				this.tickets_received++;
				break;
			case TicketStats.VIEW_COUNT:
				this.views++;
				break;
		}
	}

	@Override
	public String toString()
	{
		try
		{
			return new ObjectMapper().writeValueAsString(this);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}

		return "Tickets []";
	}
}
