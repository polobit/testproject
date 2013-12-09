package com.agilecrm.core.api.webrule;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import net.sf.json.JSONException;

import org.json.JSONArray;

import com.agilecrm.webrules.WebRule;
import com.agilecrm.webrules.util.WebRuleUtil;

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
    public void saveWebRule(WebRule webRule)
    {
	webRule.save();
    }

    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public void updateWebRule(WebRule webRule)
    {
	webRule.save();
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
    public void deleteReports(@FormParam("ids") String model_ids)
	    throws JSONException
    {

	try
	{
	    JSONArray webruleJSONArray = new JSONArray(model_ids);

	    // Deletes reports associated with the ids sent in request
	    WebRule.dao.deleteBulkByIds(webruleJSONArray);

	}
	catch (org.json.JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

    }
}
