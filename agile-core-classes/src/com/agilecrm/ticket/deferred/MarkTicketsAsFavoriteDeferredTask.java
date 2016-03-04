package com.agilecrm.ticket.deferred;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.DomainUser;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;

public class MarkTicketsAsFavoriteDeferredTask extends TicketBulkActionAdaptor
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public MarkTicketsAsFavoriteDeferredTask(String nameSpace, Long domainUserID)
	{
		super();

		this.namespace = nameSpace;

		try
		{
			NamespaceManager.set("");
			this.key = new Key<DomainUser>(DomainUser.class, domainUserID);
		}
		finally
		{
			NamespaceManager.set(nameSpace);
		}
	}

	@Override
	protected void performAction()
	{
		for (Key<Tickets> ticketKey : ticketsKeySet)
		{
			try
			{
				TicketsUtil.markFavorite(ticketKey.getId(), true);
			}
			catch (Exception e)
			{
				System.out.println(ExceptionUtils.getFullStackTrace(e));
			}
		}
	}
}