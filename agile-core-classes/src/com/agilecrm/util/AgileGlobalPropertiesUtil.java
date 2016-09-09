package com.agilecrm.util;

import com.agilecrm.AgileGlobalProperties;
import com.agilecrm.account.EmailGateway;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.EntityNotFoundException;

public class AgileGlobalPropertiesUtil
{
	
	public static final String AGILE_GLOBAL_PROPS = "__agile_global_props__"; 
	public static AgileGlobalProperties getAgileGlobalProperties()
	{
		String oldNamespace = NamespaceManager.get();
		
		try
		{
			NamespaceManager.set("");
			
			// Get from Cache
			AgileGlobalProperties props = (AgileGlobalProperties) CacheUtil.getCache("__agile_global_props__");

			if (props != null)
			{
			    System.out.println("Returning agile global properties from Cache...");
			    return props;
			}
			
			return AgileGlobalProperties.dao.get();
		}
		catch (EntityNotFoundException e)
		{
			e.printStackTrace();
			return null;
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}
	}
	
	public static String getGlobalSendGridSubUserPwd()
	{
		AgileGlobalProperties props = getAgileGlobalProperties();
		
		if(props == null)
			return null;
		
		return props.getSendgridSubUserPwd();
	}
}
