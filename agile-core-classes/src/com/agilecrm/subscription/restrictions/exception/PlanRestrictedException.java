package com.agilecrm.subscription.restrictions.exception;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

public class PlanRestrictedException extends WebApplicationException
{

    public PlanRestrictedException(String reason)
    {

	super(Response.status(Response.Status.NOT_ACCEPTABLE)
		.entity(reason + ". <span class=\"hideInIphone\">Please <a href=\"#subscribe\" class=\"hideCurrentModal\">upgrade</a></span>").build());
    }

    public PlanRestrictedException(String reason, boolean attachUpgradeMessage)
    {
	super(Response.status(Response.Status.NOT_ACCEPTABLE)
		.entity(reason + (attachUpgradeMessage ? ". <span class=\"hideInIphone\">Please <a href=\"#subscribe\"  class=\"hideCurrentModal\">upgrade</a></span>" : "")).build());
    }
    
    public PlanRestrictedException(String reason, String info)
    {
	super(Response.status(Response.Status.NOT_ACCEPTABLE)
			.entity(reason + ". <span class=\"hideInIphone\">Please <a href=\"#subscribe\" class=\"hideCurrentModal\">upgrade</a>.<br></span>If contacts are deleted, <a href=\"/login\">re-login</a> to refresh the contacts count.").build());
    }
}
