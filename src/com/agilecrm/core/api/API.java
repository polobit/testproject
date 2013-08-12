package com.agilecrm.core.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.account.APIKey;

@Path("/api")
public class API
{
	// API Key
	// This method is called if TEXT_PLAIN is request
	@Path("api-key")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public APIKey getAPIKey()
	{
		return APIKey.getAPIKey();
	}
}
