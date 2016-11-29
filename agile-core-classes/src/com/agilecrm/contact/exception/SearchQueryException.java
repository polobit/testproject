package com.agilecrm.contact.exception;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

public class SearchQueryException extends WebApplicationException{
	
	private static final long serialVersionUID = 1L;

    public SearchQueryException(String reason)
    {
    	super(Response.status(Response.Status.BAD_REQUEST).entity(reason).build());
    }

}
