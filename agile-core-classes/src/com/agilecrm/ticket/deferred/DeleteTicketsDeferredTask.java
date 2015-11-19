package com.agilecrm.ticket.deferred;

import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;

public class DeleteTicketsDeferredTask extends TicketBulkActionAdaptor
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public DeleteTicketsDeferredTask(String nameSpace, Long domainUserID)
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
				TicketsUtil.deleteTicket(ticketKey.getId());
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}
		}
	}
}