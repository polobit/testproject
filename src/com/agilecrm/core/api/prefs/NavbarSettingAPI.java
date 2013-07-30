package com.agilecrm.core.api.prefs;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.account.AccountPrefs;
import com.agilecrm.account.NavSetting;
import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.account.util.NavSettingUtil;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;


@Path("/api/navbarsets")
public class NavbarSettingAPI
{
	
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public NavSetting getNavbarSetting()
    {
		return NavSettingUtil.getNavSetting();
    }
	
	@POST
	@Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public NavSetting setNavbarSettingPOST(NavSetting nv)
	{
		return NavSettingUtil.setNavSetting(nv);
	}
	
	@PUT
	@Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void setNavbarSettingPUT(NavSetting nv)
	{
		NavSettingUtil.setNavSetting(nv);
	}
}
