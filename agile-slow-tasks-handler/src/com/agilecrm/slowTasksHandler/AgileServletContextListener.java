package com.agilecrm.slowTasksHandler;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.agilecrm.services.ServiceLocator;

public class AgileServletContextListener implements ServletContextListener
{

	public void contextInitialized(ServletContextEvent sce) 
	{
		System.out.println("Entered Servlet Context Listener");
		
		System.out.println("Registering services from core Service Registry");
		// Register Services from different modules with ServiceLocator
		ServiceLocator.registerServicesFromRegistry(new com.agilecrm.services.core.ServiceRegistry());
		
		// Register objectify entities
		com.agilecrm.coreComponents.ObjectifyRegistry.registerEntities();
	}

	public void contextDestroyed(ServletContextEvent sce) 
	{
		
	}

}
