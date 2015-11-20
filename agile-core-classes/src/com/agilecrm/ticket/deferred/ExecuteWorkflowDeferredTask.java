package com.agilecrm.ticket.deferred;

import com.agilecrm.contact.Contact;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.workflows.triggers.util.TicketTriggerUtil;
import com.googlecode.objectify.Key;

public class ExecuteWorkflowDeferredTask extends TicketBulkActionAdaptor
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Long workflowID = null;

	public ExecuteWorkflowDeferredTask(String nameSpace, Long domainUserID, Long workflowID)
	{
		super();

		this.namespace = nameSpace;
		this.key = new Key<DomainUser>(DomainUser.class, domainUserID);
		this.workflowID = workflowID;
	}

	@Override
	protected void performAction()
	{
		for (Key<Tickets> ticketKey : ticketsKeySet)
		{
			try
			{
				// Fetching ticket
				Tickets ticket = TicketsUtil.getTicketByID(ticketKey.getId());

				// Fetching contact
				Contact contact = ticket.getContact();

				if (contact == null)
					continue;

				// Executing workflow on given ticket id
				TicketTriggerUtil.executeCampaign(contact, workflowID, ticket);
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}
		}
	}
}