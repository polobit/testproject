package com.agilecrm.core.api;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.agilecrm.account.APIKey;
import com.agilecrm.account.util.APIKeyUtil;

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
    /**
     *@Priyanka
     *<code>
     *code for the validate tracking code taking website_url as
     * the parameter and if website_url is correct and contains 
     * agilecrm's tracking code then showing the result.  
     *</code> 
     * */
     @Path("api-key/validate")
     @POST
     @Produces({ MediaType.TEXT_PLAIN, MediaType.APPLICATION_XML })
     public String validateTrackingCode(@QueryParam("website_url") String websiteURL)
     {
     	//System.out.print("Website URL for tracking code "+websiteURL);
     	return APIKeyUtil.validateWebTrackingCode(websiteURL);
     }
    @Path("api-key/allowed-domains")
    @PUT
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public APIKey updateAllowedDomains(@QueryParam("allowed_domains") String allowedDomains)
    {
	return APIKey.updateAllowedDomains(allowedDomains);
    }
    
    @Path("api-key/blocked-ips")
    @PUT
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public APIKey updateBlockedIps(@QueryParam("blocked_ips") String blockedIps)
    {
	return APIKey.updateBlockedIps(blockedIps);
    }
}