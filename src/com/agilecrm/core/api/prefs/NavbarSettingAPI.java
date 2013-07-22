package com.agilecrm.core.api.prefs;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.account.AccountPrefs;
import com.agilecrm.account.NavSetting;
import com.agilecrm.account.util.AccountPrefsUtil;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;


@Path("/api/navbarsets")
public class NavbarSettingAPI
{
	
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public NavSetting getNavbarSetting()
    {
		System.out.println("HITTING.... navsets");
		Objectify ofy=ObjectifyService.begin();
		NavSetting nv=ofy.query(NavSetting.class).get();
		
		if(nv==null || nv.id==null ){ nv=new NavSetting(); nv.setDefault(); }
		
		return nv;
    }
	
	@POST
	@Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public NavSetting setNavbarSetting(NavSetting nv)
	{
		Objectify ofy=ObjectifyService.begin();
		ofy.put(nv);
		if(nv.id==null)return null;
		return nv;
	}
	
	@PUT
	@Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void setNavbarSetting2(NavSetting nv)
	{
		Objectify ofy=ObjectifyService.begin();
		ofy.put(nv);
	}
}
