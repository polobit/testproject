package com.agilecrm.ticket.entitys;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class TicketWorkflow
{
	private Long ticket_id = null;
	private Long workflow_id = null;
	
	public Long getTicket_id()
	{
		return ticket_id;
	}
	public void setTicket_id(Long ticket_id)
	{
		this.ticket_id = ticket_id;
	}
	public Long getWorkflow_id()
	{
		return workflow_id;
	}
	public void setWorkflow_id(Long workflow_id)
	{
		this.workflow_id = workflow_id;
	}
	
	
}
