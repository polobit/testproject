package com.agilecrm.core.api.account;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;

import com.agilecrm.util.NamespaceUtil;

/**
 * <code>NamespaceStatsAPI</code> inlucdes rest calls to get namespace
 * statistics. It is used in subscription page to show user's usage.
 * 
 * @author Yaswanth
 * 
 */
@Path("/api/namespace-stats")
public class NamespaceStatsAPI
{

    // Get Stats
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getNamespaceStats()
    {
	return NamespaceUtil.getNamespaceStats().toString();
    }

    // Get Stats
    @Path("stats2")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public JSONObject getStats()
    {
	return NamespaceUtil.getNamespaceCount();
    }

    /**
     * Returns the JSON object having the count of contacts, deals, campaigns
     * etc of the current domain.
     * 
     * @return JSON object.
     */
    @Path("/getdomainstats")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public String getAccountStats()
    {
	return NamespaceUtil.getDomainStats();
    }
}
