package com.agilecrm.account.util;

import com.agilecrm.account.NavSetting;
import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

public class NavSettingUtil 
{
	public static NavSetting getNavSetting()
	{
		Objectify ofy=ObjectifyService.begin();
		NavSetting nv=ofy.query(NavSetting.class).get();
		
		if(nv==null || nv.id==null ){ nv=new NavSetting(); nv.setDefault(); }
		
		return nv;
	}
	
	public static NavSetting setNavSetting(NavSetting nv)
	{
		nv.save();
		return nv;
	}
}
