package com.agilecrm.core.api.prefs;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.account.MenuSetting;
import com.agilecrm.account.util.MenuSettingUtil;

/**
 * MenuSettingAPI is the rest interface to deal with {@link MenuSetting}.
 * <code>MenuSetting</code> is a single object for a single user. Each of GET,
 * PUT,POST requests correspond to single object.<code>MenuSettingUtil</code> is
 * the utility class for providing various facilities e.g. read & write, to the
 * MenuSetting object.
 * 
 * @author Chandan
 * 
 */
@Path("/api/menusetting")
public class MenuSettingAPI
{

	/**
	 * GET call to the path.
	 * 
	 * @return MenuSetting object representing state of Navbar
	 */
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public MenuSetting getMenuSetting()
	{
		return MenuSettingUtil.getMenuSetting();
	}

	/**
	 * POST & PUT are essentially same. They both update the MenuSetting object
	 * with new one from the client.
	 * 
	 * @param menuSetting
	 *            - the object from the client
	 * @return MenuSetting as saved on server.
	 */
	@POST
	@Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public MenuSetting createMenuSetting(MenuSetting menuSetting)
	{
		return MenuSettingUtil.saveMenuSetting(menuSetting);
	}

	/**
	 * Same as POST, update menuSetting from client, don't return
	 * 
	 * @param menuSetting
	 */
	@PUT
	@Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void updateMenuSetting(MenuSetting menuSetting)
	{
		MenuSettingUtil.saveMenuSetting(menuSetting);
	}
}
