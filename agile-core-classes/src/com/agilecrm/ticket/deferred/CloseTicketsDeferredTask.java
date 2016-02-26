package com.agilecrm.ticket.deferred;

import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.workflows.triggers.util.TicketTriggerUtil;
import com.googlecode.objectify.Key;

public class CloseTicketsDeferredTask extends TicketBulkActionAdaptor
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CloseTicketsDeferredTask(String nameSpace, Long domainUserID)
	{
		super();

		this.namespace = nameSpace;
		this.key = new Key<DomainUser>(DomainUser.class, domainUserID);
	}

	@Override
	protected void performAction()
	{
		for (Key<Tickets> ticketKey : ticketsKeySet)
		{
			try
			{
				Tickets ticket = TicketsUtil.closeTicket(ticketKey.getId());

				// Execute note closed by user trigger
				TicketTriggerUtil.executeTriggerForClosedTicket(ticket);
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}
		}
	}
}