package com.agilecrm.queues.backend;

import com.google.appengine.api.modules.ModulesService;
import com.google.appengine.api.modules.ModulesServiceFactory;

public class ModuleUtil
{
	public enum AgileModules 
	{
		AGILE_CAMPAIGNS_BULK("agile-campaigns-bulk"), AGILE_TASKS_HANDLER("agile-tasks-handler"),AGILE_CAMPAIGNS_NORMAL("agile-campaigns-normal"),
		AGILE_NORMAL_BULK("agile-normal-bulk");
		
		private String moduleName = "default";
		
		AgileModules(String moduleName)
		{
			this.moduleName = moduleName;
		}
		
		public String getModuleName()
		{
			return moduleName;
		}
	};
	
	
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
    
    public static String getModuleDefaultVersionHost(String moduleName)
    {
	    try
		{
			ModulesService ms = ModulesServiceFactory.getModulesService();
			return ms.getVersionHostname(moduleName, ms.getDefaultVersion(moduleName));
		}
		catch (Exception e)
		{
			System.err.println("Exception occured while getting current module version host name..." + e.getMessage());
			e.printStackTrace();
		}
	    
	    return moduleName;
	}
    
}
