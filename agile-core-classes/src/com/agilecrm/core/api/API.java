package com.agilecrm.core.api;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
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
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public APIKey getAPIKey()
    {
	return APIKey.getAPIKey();
    }

    @Path("api-key/key")
    @POST
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public APIKey generateAPIKey()
    {
	return APIKey.regenerateAPIKey();
    }

    @Path("api-key/jskey")
    @POST
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public APIKey generateJSAPIKey()
    {
	return APIKey.regenerateJSAPIKey();
    }

    @Path("api-key")
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public APIKey updateAllowedDomains(APIKey apiKey)
    {
	return APIKey.updateAllowedDomains(apiKey);
    }
}