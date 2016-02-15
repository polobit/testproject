package com.agilecrm.core.api.landingpages;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.landingpages.LandingPage;
import com.agilecrm.landingpages.LandingPageUtil;
import com.agilecrm.util.HTTPUtil;

@Path("/api/landingpages")
public class LandingPagesAPI
{
	
	@Path("/verifycname")
	@GET
    @Produces(MediaType.APPLICATION_JSON)
	public String verifyCnameSetup(@QueryParam("domain") String domain)
	{
		String responseText = "{\"result\":false}";
		
		try {
			String response = HTTPUtil.accessURL("http://integrations.clickdesk.com:8080/ClickdeskPlugins/CNAMELookUp?domain="+domain);
			JSONObject res = new JSONObject(response);
			if(!res.isNull("ipaddress") && res.getString("ipaddress").equals("52.91.107.156")) {
				res.put("result", true);
			} else {
				res.put("result", false);
			}
			responseText = res.toString();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		System.out.println(responseText);
		return responseText;
	}
	
	@Path("/has-rights-to-add-domain")
	@GET
    @Produces(MediaType.APPLICATION_JSON)
	public String hasRightsToAddDomain(@QueryParam("domain") String domain)
	{
		System.out.println("hasRightsToAddDomain this "+ domain);
		String responseText = "{\"result\":false}";
		
		if(LandingPageUtil.hasRightsToAddDomain(domain)) {
			responseText = "{\"result\":true}";
		}
		
		System.out.println(responseText);
		return responseText;
	}

	/**
	 * 
	 * @return list of landing pages.
	 */
	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	public List<LandingPage> getAllWebPages(@QueryParam("cursor") String cursor, @QueryParam("page_size") String count)
	{
		if (count != null)
		{
			return LandingPageUtil.getLandingPages((Integer.parseInt(count)), cursor);
		}
		return LandingPageUtil.getLandingPages();
	}

	@Path("{landingPageId}")
	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	public LandingPage getLandingPage(@PathParam("landingPageId") Long id)
	{
		LandingPage landingPage = LandingPageUtil.getLandingPage(id);
		return landingPage;
	}

	@Path("{landingPageId}")
	@DELETE
	@Produces({ MediaType.APPLICATION_JSON })
	public void deletelandingPage(@PathParam("landingPageId") Long id)
	{
		try
		{
			LandingPage landingPage = LandingPageUtil.getLandingPage(id);
			if (landingPage != null)
				landingPage.delete();
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}

	@Path("/checkName")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
	public boolean checkNameExists(String jsonString)
	{
		JSONObject data;
		String name="";
		try {
			data = new JSONObject(jsonString);
			name = data.getString("landingpageName").trim();
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		LandingPageUtil lputil = new LandingPageUtil();
		if(lputil.isNameExists(name)){
			return true;
		}else{
			return false;
		}
	}
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
	public LandingPage createLandingPage(LandingPage landingPage)
	{
		System.out.println(landingPage);
		landingPage.save();
		return landingPage;
	}
	
	

	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
	public LandingPage updateLandingPage(LandingPage landingPage)
	{
		landingPage.updated_time = System.currentTimeMillis() / 1000;
		landingPage.save();
		return landingPage;
	}

	/**
	 * Deletes bulk
	 * 
	 * 
	 * 
	 * @param model_ids
	 *             ids, read as form parameter from request url
	 * @throws JSONException
	 */
	@Path("bulk")
	@POST
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public void deletelandingPages(@FormParam("ids") String model_ids) throws JSONException
	{
		JSONArray landingPageIds = new JSONArray(model_ids);
		LandingPage.dao.deleteBulkByIds(landingPageIds);
		LandingPageUtil.deleteLandingPageCNames(landingPageIds);
	}

}
