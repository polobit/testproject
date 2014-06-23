package com.agilecrm.core.api.whitelist;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;

import com.agilecrm.whitelist.AccessDomain;
import com.agilecrm.whitelist.util.AccessDomainUtil;
import com.google.appengine.labs.repackaged.org.json.JSONException;

@Path("/api/whitelist")
public class AccessDomainAPI
{
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<AccessDomain> getDomainsWithAccess()
    {
	return AccessDomainUtil.getDomainsWithAccess();
    }

    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public void saveDomainsWithAccess(AccessDomain accessDomain)
    {
	accessDomain.save();
    }

    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public void updateDomainsWithAccess(AccessDomain accessDomain)
    {
	accessDomain.save();
    }

    @Path("bulk")
    @POST
    @Consumes({ MediaType.APPLICATION_FORM_URLENCODED })
    public void deleteDomainsWithAccess(@FormParam("ids") String model_ids) throws JSONException
    {
	try
	{
	    JSONArray accessDomainsArray = new JSONArray(model_ids);
	    AccessDomain.dao.deleteBulkByIds(accessDomainsArray);
	}
	catch (org.json.JSONException e)
	{
	    e.printStackTrace();
	}
    }
}
