package com.agilecrm.core.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.account.APIKey;

@Path("/api")
public class API
{

    // This method is called if TEXT_PLAIN is request
    /**
     * This method is required to collect to developers API, requests are sent
     * to <domain>.agilecrm.com/dev/api
     * 
     * @return
     */
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String sayPlainTextHello()
    {
	return "Connected";
    }

    // API Key
    // This method is called if TEXT_PLAIN is request
    @Path("api-key")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public APIKey getAPIKey()
    {
	return APIKey.getAPIKey();
    }

    // Regenerate API Key
    @Path("api-key/regenerate/api-key")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public APIKey regenerateAPIKey()
    {
	return APIKey.regenerateAPIKey();
    }

    // Regenerate JS API Key
    @Path("api-key/regenerate/js-api-key")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public APIKey regenerateJSAPIKey()
    {
	return APIKey.regenerateJSAPIKey();
    }
}
