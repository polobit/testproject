package com.thirdparty.google.deferred;

import com.google.appengine.api.taskqueue.DeferredTask;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.contacts.ContactSyncUtil;
import com.thirdparty.google.utl.ContactPrefsUtil;

public class GoogleContactsSyncDeferredTask implements DeferredTask
{
    /**
	 * 
	 */
    private static final long serialVersionUID = 1L;

    Long id;

    public GoogleContactsSyncDeferredTask()
    {

    }

    public GoogleContactsSyncDeferredTask(Long id)
    {
	this.id = id;
    }

    @Override
    public void run()
    {
	try
	{
	    ContactPrefs contactPrefs = ContactPrefsUtil.get(id);

	    ContactSyncUtil.syncContacts(contactPrefs);
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	// TODO Auto-generated method stub

    }
}
