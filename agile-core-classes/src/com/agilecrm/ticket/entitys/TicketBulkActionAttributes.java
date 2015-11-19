package com.agilecrm.ticket.entitys;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * Utility class to receive attributes from client side to execute bulk
 * operations.
 * 
 * @author Sasi on 19-Nov-2015
 * 
 */
@XmlRootElement
public class TicketBulkActionAttributes
{
	public Long assigneeID = null, groupID = null, filterID = null, workflowID = null;
	public String ticketIDs = "";
}
