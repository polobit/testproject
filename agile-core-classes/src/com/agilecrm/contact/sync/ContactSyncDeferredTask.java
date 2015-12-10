package com.agilecrm.contact.sync;

import com.google.appengine.api.taskqueue.DeferredTask;

public class ContactSyncDeferredTask implements DeferredTask
{

    String namespace = null;
    String duration = null;
    Long contactPrefsId = null;
    
    @Override
    public void run()
    {
	// TODO Auto-generated method stub
	
    }

}
