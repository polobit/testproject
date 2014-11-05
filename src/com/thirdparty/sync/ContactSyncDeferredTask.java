package com.thirdparty.sync;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.sync.SyncFrequency;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactsImportUtil;

/**
 * Deferred task to get all prefs based on frequency and initialize sync on it
 * 
 * @author yaswanth
 */
public class ContactSyncDeferredTask implements DeferredTask
{

    private String namespace = null;
    private SyncFrequency frequency = null;

    ContactSyncDeferredTask()
    {

    }

    public ContactSyncDeferredTask(String namespace, SyncFrequency frequency)
    {
	this.namespace = namespace;
	this.frequency = frequency;
    }

    @Override
    public void run()
    {
	if (StringUtils.isEmpty(namespace))
	    return;
	String oldNamespace = NamespaceManager.get();
	try
	{
	    NamespaceManager.set(namespace);

	    List<ContactPrefs> prefs = new ArrayList<ContactPrefs>();
	    if (prefs == null || prefs.size() == 0)
		return;

	    for (ContactPrefs pref : prefs)
	    {
		if (pref.inProgress)
		    continue;

		ContactsImportUtil.initilaizeImportBackend(pref);
	    }
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }
}