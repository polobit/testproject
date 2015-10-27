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

import com.agilecrm.landingpages.LandingPage;
import com.agilecrm.landingpages.LandingPageCNames;
import com.agilecrm.landingpages.LandingPageUtil;

@Path("/api/landingpages")
public class LandingPagesAPI
{

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
		LandingPageCNames landingPageCNames = LandingPageUtil.getLandingPageCNamesForPage(id);
		if(landingPageCNames != null) {
			System.out.println("in not null");
			landingPage.cname = landingPageCNames.cname;
			landingPage.cname_id = landingPageCNames.id;
		}
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
		JSONArray landingPageJSONArray = new JSONArray(model_ids);
		LandingPage.dao.deleteBulkByIds(landingPageJSONArray);
	}

}
