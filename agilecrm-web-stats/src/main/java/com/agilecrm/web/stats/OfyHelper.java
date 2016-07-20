package com.agilecrm.web.stats;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.googlecode.objectify.ObjectifyService;

/**
 * OfyHelper, a ServletContextListener, is setup in web.xml to run before a JSP
 * is run. This is required to let JSP's access Ofy.
 **/
public class OfyHelper implements ServletContextListener
{
    
    @Override
    public void contextInitialized(ServletContextEvent sce)
    {
	// This will be invoked as part of a warmup request, or the first user
	// request if no warmup
	// request.
	ObjectifyService.register(StatsAccess.class);
	
    }
    
    @Override
    public void contextDestroyed(ServletContextEvent sce)
    {
	// TODO Auto-generated method stub
	
    }
    
}
