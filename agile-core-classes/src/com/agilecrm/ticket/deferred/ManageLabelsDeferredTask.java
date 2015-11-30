package com.agilecrm.ticket.deferred;

import java.util.List;

import com.agilecrm.ticket.entitys.TicketLabels;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;

public class ManageLabelsDeferredTask extends TicketBulkActionAdaptor
{
	private static final long serialVersionUID = 1L;
	private List<Key<TicketLabels>> labels = null;
	private String command = "";

	public ManageLabelsDeferredTask(List<Key<TicketLabels>> labels, String command, String nameSpace, Long domainUserID)
	{
		super();

		this.namespace = nameSpace;
		this.key = new Key<DomainUser>(DomainUser.class, domainUserID);
		this.labels = labels;
		this.command = command;
	}

	@Override
	protected void performAction()
	{
		for (Key<Tickets> ticket : ticketsKeySet)
		{
			TicketsUtil.addLabelsList(ticket.getId(), labels);
		}
	}
}
