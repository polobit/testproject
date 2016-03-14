package com.agilecrm.ticket.deferred;

import java.util.List;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.ticket.entitys.TicketLabels;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.workflows.triggers.util.TicketTriggerUtil;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;

public class ManageLabelsDeferredTask extends TicketBulkActionAdaptor
{
	private static final long serialVersionUID = 1L;
	private List<Key<TicketLabels>> labels = null;
	private String command = "";

	public ManageLabelsDeferredTask(List<Key<TicketLabels>> labels, String command, String nameSpace,Long domainUserID)
	{
		super();

		this.namespace = nameSpace;
		this.key = new Key<DomainUser>(DomainUser.class, domainUserID);
		this.labels = labels;
		this.command = command;
		this.namespace = nameSpace;
	}

	@Override
	protected void performAction()
	{
		for (Key<Tickets> ticketKey : ticketsKeySet)
		{
			for (Key<TicketLabels> labelKey : labels)
			{
				try
				{
					Tickets ticket = TicketsUtil.updateLabels(ticketKey.getId(), labelKey, command);

					if ("add".equalsIgnoreCase(command))
						// Execute note closed by user trigger
						TicketTriggerUtil.executeTriggerForLabelAddedToTicket(ticket);
					else
						// Execute note closed by user trigger
						TicketTriggerUtil.executeTriggerForLabelDeletedToTicket(ticket);
				}
				catch (Exception e)
				{
					System.out.println(ExceptionUtils.getFullStackTrace(e));
				}
			}
		}
	}
}
