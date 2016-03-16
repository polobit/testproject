package com.agilecrm.ticket.deferred;

import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.workflows.triggers.util.TicketTriggerUtil;
import com.googlecode.objectify.Key;

public class ChangeAssigneeDeferredTask extends TicketBulkActionAdaptor
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Long newAssigneeID = null;
	private Long groupID = null;

	public ChangeAssigneeDeferredTask(String nameSpace, Long domainUserID, Long newAssigneeID, Long newGroupID)
	{
		super();

		this.namespace = nameSpace;
		this.key = new Key<DomainUser>(DomainUser.class, domainUserID);
		this.newAssigneeID = newAssigneeID;
		this.groupID = newGroupID;
	}

	@Override
	protected void performAction()
	{
		for (Key<Tickets> ticketKey : ticketsKeySet)
		{
			try
			{
				Tickets ticket = TicketsUtil.changeGroupAndAssignee(ticketKey.getId(), groupID, newAssigneeID);

				// Execute trigger for assignee change
				TicketTriggerUtil.executeTriggerForAssigneeChanged(ticket);
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}
		}
	}
}