package com.agilecrm.ticket.entitys;

import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.ticket.entitys.Tickets.Priority;
import com.agilecrm.ticket.entitys.Tickets.Status;
import com.agilecrm.ticket.entitys.Tickets.Type;

/**
 * Utility class
 * 
 * @author Mantra
 * 
 */
@XmlRootElement
public class TicketActivityAttributes
{
	String command;
	String email;
	
	Priority priority;
	Type type;
	Status status;

	Long labelID;
	Long due_time;

	public String getCommand()
	{
		return command;
	}

	public void setCommand(String command)
	{
		this.command = command;
	}

	public String getEmail()
	{
		return email;
	}

	public void setEmail(String email)
	{
		this.email = email;
	}

	public Long getLabelID()
	{
		return labelID;
	}

	public void setLabelID(Long labelID)
	{
		this.labelID = labelID;
	}

	public Long getDue_time()
	{
		return due_time;
	}

	public void setDue_time(Long due_time)
	{
		this.due_time = due_time;
	}

	public Priority getPriority()
	{
		return priority;
	}

	public void setPriority(Priority priority)
	{
		this.priority = priority;
	}

	public Type getType()
	{
		return type;
	}

	public void setType(Type type)
	{
		this.type = type;
	}

	public Status getStatus()
	{
		return status;
	}

	public void setStatus(Status status)
	{
		this.status = status;
	}
}
