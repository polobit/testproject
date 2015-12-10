package com.agilecrm.queues.backend;

import com.google.appengine.api.modules.ModulesService;
import com.google.appengine.api.modules.ModulesServiceFactory;

public class ModuleUtil
{
    public static String getCurrentModuleName()
    {
	try
	{
	    ModulesService moduleService = ModulesServiceFactory.getModulesService();

	    // Get the backend handling the current request.
	    String moduleName = moduleService.getCurrentModule();

	    System.out.println("Current Backend Name is " + moduleName);

	    return moduleName;
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while getting current backend name..." + e.getMessage());
	}

	return "";
    }
}
