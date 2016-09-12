package com.agilecrm.core.api.webrule;

import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;

import com.agilecrm.AllDomainStats;
import com.agilecrm.alldomainstats.util.AllDomainStatsUtil;
import com.agilecrm.cms.CMSPlugin;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.webrules.WebRule;
import com.agilecrm.webrules.util.WebRuleUtil;

import net.sf.json.JSONException;

@Path("/api/webrule")
public class WebRuleAPI
{
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<WebRule> getWebRules()
    {
	return WebRuleUtil.getAllWebRules();
    }
  
    
    
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public void saveWebRule(WebRule webRule, @Context HttpServletResponse response) throws PlanRestrictedException
    {
	 webRule.save();
	 
	//Increase count of Web Rules for AllDomainstats report in database
		AllDomainStatsUtil.updateAllDomainStats(AllDomainStats.WEBRULE_COUNT);
	
		// Inform to CMS plugins
		CMSPlugin.updateToCmsPlugins(CMSPlugin.EventName.WebRule, true);
    }

    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public void updateWebRule(WebRule webRule)
    {
	webRule.save();
	
	// Inform to CMS plugins
	CMSPlugin.updateToCmsPlugins(CMSPlugin.EventName.WebRule, false);
    }

    /*    *//**
     * Saves position of webrule, used to show webrule in order according
     * to position ascending order
     * 
     * @param webrules
     *            {@link List} of {@link WebRule}
     */

    @Path("/positions")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public void savePositions(List<WebRule> webrules)
    {
	if (webrules == null)
	    return;

	// UI sends only ID and Position
	for (WebRule webrule : webrules)
	{
	    WebRule fullWebrule;
	    try
	    {
		fullWebrule = WebRule.dao.get(webrule.id);
		System.out.println(fullWebrule);
		fullWebrule.position = webrule.position;
		fullWebrule.save();
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	
	// Inform to CMS plugins
	CMSPlugin.updateToCmsPlugins(CMSPlugin.EventName.WebRule, false);
			
    }

    /**
     * Webrule delete functionality
     * 
     * @param model_ids
     * @throws JSONException
     */
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteReports(@FormParam("ids") String model_ids) throws JSONException
    {

	try
	{
	    JSONArray webruleJSONArray = new JSONArray(model_ids);

	    // Deletes reports associated with the ids sent in request
	    WebRule.dao.deleteBulkByIds(webruleJSONArray);
	    
	    // Delete cache also
	    WebRuleUtil.deleteRulesFromCache();
	    
	    // Inform to CMS plugins
		CMSPlugin.updateToCmsPlugins(CMSPlugin.EventName.WebRule, false);

	}
	catch (org.json.JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

    }
}
