package com.agilecrm.ticket.deferred;

import java.util.List;

import com.agilecrm.contact.Tag;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;

public class ManageLabelsDeferredTask extends TicketBulkActionAdaptor
{
	private static final long serialVersionUID = 1L;
	private List<Tag> tags = null;
	private String command = "";

	public ManageLabelsDeferredTask(List<Tag> tags, String command, String nameSpace, Long domainUserID)
	{
		super();

		this.namespace = nameSpace;
		this.key = new Key<DomainUser>(DomainUser.class, domainUserID);
		this.tags = tags;
		this.command = command;
	}

	@Override
	protected void performAction()
	{
		for (Key<Tickets> ticket : ticketsKeySet)
		{
			TicketsUtil.addTagsList(ticket.getId(), tags);
		}
	}
}
