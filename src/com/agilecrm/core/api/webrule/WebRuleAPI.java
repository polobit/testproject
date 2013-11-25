package com.agilecrm.core.api.webrule;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

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
}
