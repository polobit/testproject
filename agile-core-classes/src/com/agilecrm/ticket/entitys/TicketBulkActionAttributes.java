package com.agilecrm.ticket.entitys;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.map.ObjectMapper;

import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.ticket.utils.TicketBulkActionUtil.TicketBulkActionType;

/**
 * Utility class to receive attributes from client side to execute bulk
 * operations.
 * 
 * @author Sasi on 19-Nov-2015
 * 
 */
@XmlRootElement
public class TicketBulkActionAttributes implements Serializable
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public Long assigneeID = null, groupID = null, workflowID = null, domain_user_id = null;
	public String ticketIDs = "", dataString = "";
	public TicketBulkActionType action_type = null;
	public List<SearchRule> conditions = new ArrayList<SearchRule>();
	
	public List<Long> labels = new ArrayList<Long>();
	
	public enum Manage_Lables {
		add, remove
	};
	
	public Manage_Lables manage_lables = Manage_Lables.add;
	
	public TicketBulkActionAttributes()
	{

	}

	public TicketBulkActionAttributes(Long assigneeID, Long groupID, Long workflowID, String ticketIDs,
			String dataString, List<SearchRule> conditions, TicketBulkActionType action_type)
	{
		super();
		this.assigneeID = assigneeID;
		this.groupID = groupID;
		this.workflowID = workflowID;
		this.ticketIDs = ticketIDs;
		this.dataString = dataString;
		this.conditions = conditions;
		this.action_type = action_type;
	}

	@Override
	public String toString()
	{
		try
		{
			return new ObjectMapper().writeValueAsString(this);
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
		
		return null;
	}
}
