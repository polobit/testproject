package com.agilecrm.subscription.restrictions.exception;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

public class PlanRestrictedException extends WebApplicationException
{

    public PlanRestrictedException(String reason)
    {

	super(Response.status(Response.Status.NOT_ACCEPTABLE)
		.entity(reason + ". Please <a href=\"#subscribe\" class=\"hideCurrentModal\">upgrade</a>").build());
    }

    public PlanRestrictedException(String reason, boolean attachUpgradeMessage)
    {
	super(Response.status(Response.Status.NOT_ACCEPTABLE)
		.entity(reason + (attachUpgradeMessage ? ". Please <a href=\"#subscribe\"  class=\"hideCurrentModal\">upgrade</a>" : "")).build());
    }
}
