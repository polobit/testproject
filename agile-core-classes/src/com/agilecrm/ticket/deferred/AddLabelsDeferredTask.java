package com.agilecrm.ticket.deferred;

import java.util.List;
import java.util.Set;

import com.agilecrm.contact.Tag;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;

public class AddLabelsDeferredTask extends TicketBulkActionAdaptor
{
	private static final long serialVersionUID = 1L;
	private List<Tag> tags = null;
	private Set<Key<Tickets>> ticketsKeySet = null;

	public AddLabelsDeferredTask(List<Tag> tags, String nameSpace, Long domainUserID, Set<Key<Tickets>> ticketsKeySet)
	{
		super();

		this.namespace = nameSpace;
		this.key = new Key<DomainUser>(DomainUser.class, domainUserID);
		this.ticketsKeySet = ticketsKeySet;
		this.tags = tags;
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
