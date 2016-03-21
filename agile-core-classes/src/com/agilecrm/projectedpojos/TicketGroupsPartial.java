package com.agilecrm.projectedpojos;

import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.Globals;
import com.agilecrm.ticket.utils.TicketGroupUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.Entity;
import com.googlecode.objectify.annotation.Cached;

/**
 * 
 * @author Sasi
 * 
 */
@XmlRootElement
@Cached
public class TicketGroupsPartial extends ProjectionEntityParse
{
	public Long id;

	public String group_name;
	public String group_email;

	public TicketGroupsPartial()
	{
		super();
	}

	public TicketGroupsPartial parseEntity(Entity entity)
	{
		id = entity.getKey().getId();
		group_name = (String) getPropertyValue(entity, "group_name");
		group_email = NamespaceManager.get() + "+" + TicketGroupUtil.getShortGroupID(id) + Globals.INBOUND_EMAIL_SUFFIX;

		return this;
	}
}