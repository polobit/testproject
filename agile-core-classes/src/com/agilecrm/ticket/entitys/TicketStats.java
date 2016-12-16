package com.agilecrm.ticket.entitys;

import java.io.Serializable;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.codehaus.jackson.map.ObjectMapper;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.annotation.Indexed;

/**
 * 
 * @author Sasi
 * 
 */
@XmlRootElement
public class TicketStats implements Serializable
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
	public Long created_time = 0L;

	public Long groups = 0L;
	public Long labels = 0L;
	public Long canned_responses = 0L;
	public Long views = 0L;
	public Long tickets_received = 0l;
	public Long artices_created = 0l;
	public Long sections_created = 0l;
	public Long notes_created = 0l;
	public Long our_notes_created = 0l;
	
	/**
	 * Stores the property names in final variables, for reading flexibility of
	 * the property values
	 */
	public static final String GROUPS_COUNT = "groups";
	public static final String LABELS_COUNT = "labels";
	public static final String CANNED_RESPONSES = "canned_responses";
	public static final String VIEW_COUNT = "views";
	public static final String TICKETS_COUNT = "tickets_received";
	public static final String Article_Count = "artices_created";
	public static final String Section_Count = "sections_created";
	public static final String Notes_Count = "notes_created";
	public static final String OUR_Notes_Count = "our_notes_created";
	
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
			case TicketStats.Article_Count:
				this.artices_created++;
				break;	
			case TicketStats.Section_Count:
				this.sections_created++;
				break;
			case TicketStats.Notes_Count:
				this.notes_created++;
				break;	
			case TicketStats.OUR_Notes_Count:
				this.our_notes_created++;
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
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}

		return "Tickets []";
	}
}
