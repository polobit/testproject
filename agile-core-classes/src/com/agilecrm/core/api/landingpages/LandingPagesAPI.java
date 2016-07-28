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

import com.agilecrm.AllDomainStats;
import com.agilecrm.alldomainstats.util.AllDomainStatsUtil;
import com.agilecrm.landingpages.LandingPage;
import com.agilecrm.landingpages.LandingPageCNames;
import com.agilecrm.landingpages.LandingPageUtil;
import com.agilecrm.util.HTTPUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;

@Path("/api/landingpages")
public class LandingPagesAPI
{
	
	@Path("/getframe/{landingPageId}/{frameId}")
	@GET
	@Produces({ MediaType.TEXT_HTML })
	public String getLandingPageFrame(@PathParam("landingPageId") Long id,@PathParam("frameId") int requestedFrameId)
	{
		LandingPage landingPage = LandingPageUtil.getLandingPage(id);
		if(!landingPage.blocks.isEmpty()) {
			try {
				JSONArray frames = new JSONArray(landingPage.blocks);
				int noOfFrames = frames.length();
				for (int i = 0; i < noOfFrames; ++i) {
				    JSONObject frame = frames.getJSONObject(i);
				    int frameId = frame.getInt("frames_id");
				    if(frameId == requestedFrameId) {
				    	return frame.getString("frameContent");
				    }
				}
			} catch (JSONException e) {
				e.printStackTrace();
				return "";
			}
		}
		
		return "";
	}
	
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
		
		if(SystemProperty.environment.value() == SystemProperty.Environment.Value.Development || LandingPageUtil.hasRightsToAddDomain(domain)) {
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
	public List<LandingPage> getAllWebPages(@QueryParam("cursor") String cursor, @QueryParam("page_size") String count ,  @QueryParam("global_sort_key") String fieldName)
	{
		if(fieldName == null)
			fieldName = "name";
		if (count != null)
		{
			return LandingPageUtil.getLandingPages((Integer.parseInt(count)), cursor , fieldName);
		}
		return LandingPageUtil.getLandingPages(fieldName);
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
			if (landingPage != null) {
				JSONArray pageIds = new JSONArray();
				pageIds.put(landingPage.id);
				LandingPageUtil.deleteLandingPageCNames(pageIds);
				landingPage.delete();
			}
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
		String id ="";
		try {
			data = new JSONObject(jsonString);
			name = data.getString("landingpageName").trim();
			id = data.getString("id");
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		LandingPageUtil lputil = new LandingPageUtil();
		if(lputil.isNameExists(name,id)){
			return true;
		}else{
			return false;
		}
	}
	
	@Path("/custom-domain/{landingPageId}")
	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	public LandingPageCNames getLandingPageCName(@PathParam("landingPageId") Long id)
	{
		LandingPageCNames landingPageCName = LandingPageUtil.getLandingPageCNamesForPage(id);
		return landingPageCName;
	}
	
	@Path("/custom-domain")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
	public LandingPageCNames createLandingPageCName(LandingPageCNames landingPageCName)
	{
		landingPageCName.domain = NamespaceManager.get();
		landingPageCName.save();
		return landingPageCName;
	}
	
	
	@Path("/custom-domain")
	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
	public LandingPageCNames updateLandingPageCName(LandingPageCNames landingPageCName)
	{
		landingPageCName.domain = NamespaceManager.get();
		landingPageCName.save();
		return landingPageCName;
	}
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
	public LandingPage createLandingPage(LandingPage landingPage)
	{
		System.out.println(landingPage);
		if(landingPage.version >= 2.0) {	    
        	landingPage.html = LandingPageUtil.getFullHtmlCode(landingPage);
        }
		landingPage.save();
		
		//Increase count of Campaign for AllDomainstats report in database
		AllDomainStatsUtil.updateAllDomainStats(AllDomainStats.LANDINGPAGE_COUNT);
		
		return landingPage;
	}
	
	

	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
	public LandingPage updateLandingPage(LandingPage landingPage)
	{
		if(landingPage.version >= 2.0) {	    
        	landingPage.html = LandingPageUtil.getFullHtmlCode(landingPage);
        }
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
