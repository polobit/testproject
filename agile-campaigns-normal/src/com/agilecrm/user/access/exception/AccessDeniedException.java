package com.agilecrm.user.access.exception;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

public class AccessDeniedException extends WebApplicationException
{
    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    public AccessDeniedException(String reason)
    {

	super(Response.status(Response.Status.FORBIDDEN).entity(reason).build());
    }
}
