package com.agilecrm.projectedpojos;

import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;

/**
 * 
 * @author Sasi
 * 
 */
public class TicketNotesPartial extends ProjectionEntityParse
{
	public Long id;

	public String plain_text = "";
	public Long created_time = null;
	public Key assignee_key = null;

	public DomainUserPartial ticket_notes_assinee = null;

	public TicketNotesPartial()
	{
		super();
	}

	public TicketNotesPartial parseEntity(Entity entity)
	{
		id = entity.getKey().getId();
		plain_text = (String) getPropertyValue(entity, "plain_text");
		created_time = (Long) getPropertyValue(entity, "created_time");
		
		//No need to send assignee key to client side
		Key assignee_key = (Key) getPropertyValue(entity, "assignee_key");

		if (assignee_key != null)
			ticket_notes_assinee = DomainUserUtil.getPartialDomainUser(assignee_key.getId());

		return this;
	}
}
