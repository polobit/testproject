package com.agilecrm.core.api.prefs;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.account.NavSetting;
import com.agilecrm.account.util.NavSettingUtil;

/**
 * NabbarSettingAPI is the rest interface to deal with {@link NavSetting}.
 * <code>NavSetting</code> is a single object for a single user. Each of GET,
 * PUT,POST requests correspond to single object.<code>NavSettingUtil</code> is
 * the utility class for providing various facilities e.g. read & write, to the
 * NavSetting object.
 * 
 * @author Chandan
 * 
 */
@Path("/api/navbarsets")
public class NavSettingAPI
{

	/**
	 * GET call to the path.
	 * 
	 * @return NavSetting object representing state of Navbar
	 */
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public NavSetting getNavSetting()
	{
		return NavSettingUtil.getNavSetting();
	}

	/**
	 * POST & PUT are essentially same. They both update the NavSetting object
	 * with new one from the client.
	 * 
	 * @param navSetting
	 *            - the object from the client
	 * @return NavSetting as saved on server.
	 */
	@POST
	@Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public NavSetting createNavSetting(NavSetting navSetting)
	{
		return NavSettingUtil.saveNavSetting(navSetting);
	}

	/**
	 * Same as POST, update navSetting from client, don't return
	 * 
	 * @param navSetting
	 */
	@PUT
	@Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void updateNavSetting(NavSetting navSetting)
	{
		NavSettingUtil.saveNavSetting(navSetting);
	}
}
