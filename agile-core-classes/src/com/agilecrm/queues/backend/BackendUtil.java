package com.agilecrm.queues.backend;

import com.google.appengine.api.backends.BackendService;
import com.google.appengine.api.backends.BackendServiceFactory;

public class BackendUtil
{
    public static String getCurrentBackendName()
    {
	try
	{
	    BackendService backendsApi = BackendServiceFactory.getBackendService();

	    // Get the backend handling the current request.
	    String backendName = backendsApi.getCurrentBackend();

	    System.out.println("Current Backend Name is " + backendName);

	    return backendName;
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while getting current backend name..." + e.getMessage());
	}

	return "";
    }
}
